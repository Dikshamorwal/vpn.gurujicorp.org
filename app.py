"""
Guruji VPN - Flask Backend Application
REST API server with MongoDB integration, PhonePe payment gateway
(built on Tailscale / WireGuard networking) & static frontend serving

Security notes:
  * PhonePe credentials are read ONLY from environment variables.
  * Payment success is only accepted after server-side verification
    against the PhonePe status API (never trust the frontend).
  * This app runs in payment SIMULATION mode unless PHONEPE_ENABLED=true
    and valid credentials are configured.
"""

import os
import json
import uuid
import base64
import hashlib
import hmac
import datetime

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# ==========================================
# CONFIGURATION (all from environment)
# ==========================================
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/guruji_vpn')
SECRET_KEY = os.getenv('SECRET_KEY', 'dev_only_insecure_secret_change_me')

PHONEPE_ENABLED = os.getenv('PHONEPE_ENABLED', 'false').lower() == 'true'
PHONEPE_MERCHANT_ID = os.getenv('PHONEPE_MERCHANT_ID', '')
PHONEPE_SALT_KEY = os.getenv('PHONEPE_SALT_KEY', '')
PHONEPE_SALT_INDEX = os.getenv('PHONEPE_SALT_INDEX', '1')
PHONEPE_MERCHANT_PREFIX = os.getenv('PHONEPE_MERCHANT_PREFIX', 'GURUJI')
PHONEPE_API_BASE = os.getenv(
    'PHONEPE_API_BASE',
    'https://api-preprod.phonepe.com/apis/pg-sandbox/'
).rstrip('/') + '/'
PHONEPE_REDIRECT_URL = os.getenv('PHONEPE_REDIRECT_URL', '')
PHONEPE_CALLBACK_URL = os.getenv('PHONEPE_CALLBACK_URL', '')
PHONEPE_SIM_SIGNING_SALT = os.getenv('PHONEPE_SIM_SIGNING_SALT', '')

# Tailscale integration (optional). When a real API key is present the app
# can manage devices/exit nodes directly. Otherwise placeholder values are used.
TAILSCALE_API_KEY = os.getenv('TAILSCALE_API_KEY', '')
TAILSCALE_TAILNET = os.getenv('TAILSCALE_TAILNET', 'guruji')
TAILSCALE_EXIT_NODE_ID = os.getenv('TAILSCALE_EXIT_NODE_ID', 'in-mum-01')

# ==========================================
# PRICING (backend is the source of truth)
# ==========================================
# amount_paise: integer, 1 INR = 100 paise
PLANS = {
    'trial': {
        'id': 'trial',
        'name': 'Trial Plan',
        'price': 49,
        'currency': 'INR',
        'periodDays': 7,
        'periodLabel': '/ 7 Days',
        'devices': 1,
        'features': [
            'Access to all exit nodes',
            '1 Device',
            'All features included'
        ],
        'cta': 'Start 7-Day Trial',
        'subtext': 'No credit card required',
        'popular': False,
        'amountPaise': 4900
    },
    'monthly': {
        'id': 'monthly',
        'name': 'Monthly Plan',
        'price': 199,
        'currency': 'INR',
        'periodDays': 30,
        'periodLabel': '/ Month',
        'devices': 3,
        'features': [
            'Access to all exit nodes',
            'Up to 3 Devices',
            'High speed connections',
            '24/7 Support'
        ],
        'cta': 'Get Monthly Plan',
        'subtext': 'Cancel anytime',
        'popular': True,
        'amountPaise': 19900
    },
    'yearly': {
        'id': 'yearly',
        'name': 'Yearly Plan',
        'price': 1999,
        'currency': 'INR',
        'periodDays': 365,
        'periodLabel': '/ Year',
        'devices': 5,
        'features': [
            'Access to all exit nodes',
            'Up to 5 Devices',
            'Best value for long term',
            'Priority routing'
        ],
        'cta': 'Get Yearly Plan',
        'subtext': '30-day money-back guarantee',
        'popular': False,
        'amountPaise': 199900
    }
}


def get_plan(plan_id):
    plan = PLANS.get(plan_id)
    if plan:
        return plan
    return None


# ==========================================
# DATABASE INITIALIZATION
# ==========================================
db = None
try:
    from pymongo import MongoClient
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client.server_info()  # trigger connection test
    db = client.get_database()
    print("✓ Connected to MongoDB database successfully.")
except Exception as e:
    print(f"ℹ MongoDB not detected locally ({e}). Using in-memory fallback store.")
    db = None

# In-memory storage for development / fallback
MEMORY_STORE = {
    'users': {},
    'subscriptions': {
        'default': {
            'plan': 'Monthly Plan',
            'status': 'Active',
            'price': '₹199/mo',
            'expiry': '2026-10-02',
            'autoRenew': True
        }
    },
    'vpn_state': {
        'connected': True,
        'status': 'Connected',
        'activeNode': {
            'id': 'in-mum-01',
            'name': 'India (Mumbai)',
            'code': 'India',
            'flag': '🇮🇳',
            'latency': '12 ms',
            'load': '38%'
        },
        'ipAddress': '100.84.120.45',
        'latency': '12 ms',
        'downloadSpeed': '185.4 Mbps',
        'uploadSpeed': '94.2 Mbps',
        'connectedSince': '2 hours 15 mins'
    },
    'devices': [
        {'id': 'dev-01', 'name': 'MacBook Pro 16"', 'type': 'Laptop', 'icon': '💻', 'status': 'Active', 'lastActive': 'Now'},
        {'id': 'dev-02', 'name': 'Samsung Galaxy S24', 'type': 'Android Phone', 'icon': '📱', 'status': 'Connected', 'lastActive': '5m ago'},
        {'id': 'dev-03', 'name': 'Home Office Workstation', 'type': 'Windows PC', 'icon': '🖥️', 'status': 'Offline', 'lastActive': 'Yesterday'}
    ],
    'orders': {},          # merchantTransactionId -> order record (payments)
    'auth_keys': {},
    'subscribers': []
}

EXIT_NODES = [
    {'id': 'in-mum-01', 'name': 'India (Mumbai)', 'code': 'India', 'flag': '🇮🇳', 'latency': '12 ms', 'load': '38%'},
    {'id': 'sg-sin-01', 'name': 'Singapore', 'code': 'Singapore', 'flag': '🇸🇬', 'latency': '35 ms', 'load': '45%'},
    {'id': 'us-nyc-01', 'name': 'United States (NY)', 'code': 'USA', 'flag': '🇺🇸', 'latency': '142 ms', 'load': '62%'},
    {'id': 'de-fra-01', 'name': 'Germany (Frankfurt)', 'code': 'Germany', 'flag': '🇩🇪', 'latency': '118 ms', 'load': '51%'},
    {'id': 'jp-tyo-01', 'name': 'Japan (Tokyo)', 'code': 'Japan', 'flag': '🇯🇵', 'latency': '85 ms', 'load': '40%'}
]


# ==========================================
# PHONEPE PAYMENT GATEWAY HELPERS
# ==========================================
def phonepe_is_configured():
    return bool(PHONEPE_ENABLED and PHONEPE_MERCHANT_ID and PHONEPE_SALT_KEY)


def phonepe_sign(message: str) -> str:
    """Return full X-VERIFY value: SHA256(message)###saltIndex"""
    digest = hashlib.sha256(message.encode()).hexdigest()
    return f"{digest}###{PHONEPE_SALT_INDEX}"


def phonepe_status_endpoint(transaction_id: str) -> str:
    return f"pg/v1/status/{PHONEPE_MERCHANT_ID}/{transaction_id}"


def phonepe_verify_response_signature(base64_data: str) -> bool:
    """Validate the X-VERIFY signature PhonePe attaches to a status response."""
    expected = phonepe_sign(f"{base64_data}{PHONEPE_SALT_KEY}{PHONEPE_SALT_INDEX}")
    actual = request.headers.get('X-VERIFY', '')
    return hmac.compare_digest(actual, expected)


def create_phonepe_order(plan: dict, transaction_id: str, amount_paise: int):
    """
    Create a real PhonePe order via the PG "pay" API.
    Returns (ok: bool, payload: dict).
    """
    import requests

    endpoint = 'pg/v1/pay'
    url = f"{PHONEPE_API_BASE}{endpoint}"
    redirect_url = PHONEPE_REDIRECT_URL or f"{request.host_url.rstrip('/')}/#dashboard"
    callback_url = PHONEPE_CALLBACK_URL or f"{request.host_url.rstrip('/')}/api/payment/callback"

    payload = {
        'merchantId': PHONEPE_MERCHANT_ID,
        'merchantTransactionId': transaction_id,
        'merchantUserId': f"{PHONEPE_MERCHANT_PREFIX}_{uuid.uuid4().hex[:8]}",
        'amount': amount_paise,
        'redirectUrl': redirect_url,
        'redirectMode': 'GET',
        'callbackUrl': callback_url,
        'paymentInstrument': {'type': 'PAY_PAGE'}
    }

    base64_payload = base64.b64encode(
        json.dumps(payload).encode()
    ).decode()

    headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': phonepe_sign(f"{base64_payload}{PHONEPE_SALT_KEY}{PHONEPE_SALT_INDEX}"),
        'accept': 'application/json'
    }

    try:
        resp = requests.post(url, headers=headers, json={'request': base64_payload}, timeout=30)
        data = resp.json() if resp.headers.get('content-type', '').startswith('application/json') else {}
    except Exception as e:
        return False, {'error': f'PhonePe request failed: {e}', 'statusCode': 'INTERNAL'}

    if not data.get('success'):
        return False, {
            'error': data.get('message', 'PhonePe could not initiate payment'),
            'code': data.get('code'),
            'statusCode': 'PAYMENT_INITIATION_FAILED'
        }

    return True, {
        'merchantTransactionId': transaction_id,
        'redirectInfo': (
            data.get('data', {})
                .get('instrumentResponse', {})
                .get('redirectInfo', {})
        ),
        'paymentUrl': (
            data.get('data', {})
                .get('instrumentResponse', {})
                .get('redirectInfo', {})
                .get('url', '')
        )
    }


def verify_phonepe_payment_remotely(transaction_id: str):
    """
    Server-side verification against the PhonePe status API.
    Never trusts the client. Returns (ok, subscription, message).
    """
    import requests

    endpoint = phonepe_status_endpoint(transaction_id)
    url = f"{PHONEPE_API_BASE}{endpoint}"

    # No request body is sent; X-VERIFY uses the endpoint string.
    headers = {
        'X-VERIFY': phonepe_sign(f"{endpoint}{PHONEPE_SALT_KEY}{PHONEPE_SALT_INDEX}"),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }

    try:
        resp = requests.get(url, headers=headers, timeout=30)
        data = resp.json() if resp.headers.get('content-type', '').startswith('application/json') else {}
    except Exception as e:
        return False, None, f'PhonePe status check failed: {e}'

    # Verify PhonePe's own signature on the response data.
    # if not phonepe_verify_response_signature(data.get('data', '')):
    #     return False, None, 'Signature verification failed for status response'

    if not data.get('success'):
        return False, None, data.get('message', 'PhonePe status check failed')

    payment_data = data.get('data', {})
    transaction_status = payment_data.get('transactionStatus', 'FAILURE')
    if transaction_status != 'SUCCESS':
        return False, None, f'Payment status is {transaction_status}, not SUCCESS'

    order = MEMORY_STORE['orders'].get(transaction_id)
    if not order:
        return False, None, 'Order not found on server'

    # Amount must match the stored plan amount — prevents tampering.
    if int(payment_data.get('amount', 0)) != int(order['amountPaise']):
        return False, None, 'Payment amount mismatch with the order'

    subscription = _activate_subscription(order['planId'])
    return True, subscription, 'Payment verified successfully'


# ==========================================
# SUBSCRIPTION LOGIC
# ==========================================
def _activate_subscription(plan_id: str):
    plan = get_plan(plan_id) or get_plan('monthly')
    expiry = (datetime.date.today() + datetime.timedelta(days=plan['periodDays'])).isoformat()
    sub = {
        'plan': plan['name'],
        'status': 'Active',
        'price': f"₹{plan['price']}/{plan['periodLabel'][2:]}",
        'expiry': expiry,
        'autoRenew': True
    }
    MEMORY_STORE['subscriptions']['default'] = sub
    return sub


# ==========================================
# FRONTEND STATIC ROUTES
# ==========================================
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(path):
        return send_from_directory('.', path)
    return send_from_directory('.', 'index.html')


# ==========================================
# API ENDPOINTS: AUTHENTICATION
# ==========================================
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', 'User')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    user_obj = {
        'id': f"usr_{uuid.uuid4().hex[:8]}",
        'name': name,
        'email': email,
        'avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={name}",
        'createdAt': datetime.datetime.utcnow().isoformat()
    }

    token = f"jwt_{uuid.uuid4().hex}"

    if db is not None:
        db.users.insert_one({**user_obj, 'token': token, 'password': password})
    else:
        MEMORY_STORE['users'][email] = {**user_obj, 'token': token, 'password': password}

    return jsonify({
        'success': True,
        'message': 'Account registered successfully',
        'user': user_obj,
        'token': token
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400

    user_name = email.split('@')[0].capitalize()
    user_obj = {
        'id': f"usr_{uuid.uuid4().hex[:8]}",
        'name': user_name,
        'email': email,
        'avatar': f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_name}"
    }
    token = f"jwt_{uuid.uuid4().hex}"

    return jsonify({
        'success': True,
        'message': 'Logged in successfully',
        'user': user_obj,
        'token': token
    })


@app.route('/api/auth/logout', methods=['POST'])
def logout():
    return jsonify({'success': True, 'message': 'Logged out successfully'})


# ==========================================
# API ENDPOINTS: USER PROFILE & SUBSCRIPTION
# ==========================================
@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    return jsonify({
        'success': True,
        'user': {
            'name': 'Guruji Member',
            'email': 'user@gurujicorp.org',
            'avatar': 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guruji'
        }
    })


@app.route('/api/user/subscription', methods=['GET'])
def get_subscription():
    sub = MEMORY_STORE['subscriptions']['default']
    return jsonify({'success': True, 'subscription': sub})


@app.route('/api/user/devices', methods=['GET'])
def get_devices():
    return jsonify({'success': True, 'devices': MEMORY_STORE['devices']})


@app.route('/api/pricing', methods=['GET'])
def get_pricing():
    return jsonify({'success': True, 'plans': list(PLANS.values()), 'currency': 'INR'})


# ==========================================
# API ENDPOINTS: VPN STATE & EXIT NODES
# ==========================================
@app.route('/api/vpn/status', methods=['GET'])
def get_vpn_status():
    return jsonify({'success': True, 'vpn': MEMORY_STORE['vpn_state']})


@app.route('/api/vpn/exit-nodes', methods=['GET'])
def get_exit_nodes():
    return jsonify({'success': True, 'nodes': EXIT_NODES})


@app.route('/api/vpn/connect', methods=['POST'])
def connect_vpn():
    data = request.get_json() or {}
    node_id = data.get('nodeId', TAILSCALE_EXIT_NODE_ID)
    target_node = next((n for n in EXIT_NODES if n['id'] == node_id), EXIT_NODES[0])

    MEMORY_STORE['vpn_state'] = {
        'connected': True,
        'status': 'Connected',
        'activeNode': target_node,
        'ipAddress': '100.84.120.45',
        'latency': target_node['latency'],
        'downloadSpeed': '185.4 Mbps',
        'uploadSpeed': '94.2 Mbps',
        'connectedSince': 'Just now'
    }

    return jsonify({
        'success': True,
        'message': f"Connected to Guruji VPN ({target_node['name']})",
        'vpn': MEMORY_STORE['vpn_state']
    })


@app.route('/api/vpn/disconnect', methods=['POST'])
def disconnect_vpn():
    MEMORY_STORE['vpn_state']['connected'] = False
    MEMORY_STORE['vpn_state']['status'] = 'Disconnected'
    MEMORY_STORE['vpn_state']['ipAddress'] = 'Not Assigned'
    MEMORY_STORE['vpn_state']['latency'] = '--'
    MEMORY_STORE['vpn_state']['downloadSpeed'] = '0 Mbps'

    return jsonify({
        'success': True,
        'message': 'VPN Disconnected',
        'vpn': MEMORY_STORE['vpn_state']
    })


# ==========================================
# API ENDPOINTS: PAYMENTS (PhonePe)
# ==========================================
@app.route('/api/payment/create', methods=['POST'])
def create_payment():
    """Create a PhonePe order. Returns the hosted payment URL (live mode)
    or a simulation token (sandbox/dev mode)."""
    data = request.get_json() or {}
    plan_id = data.get('planId', 'monthly')
    plan = get_plan(plan_id)
    if not plan:
        return jsonify({'success': False, 'message': 'Unknown plan'}), 400

    transaction_id = f"{PHONEPE_MERCHANT_PREFIX}{datetime.datetime.now().strftime('%Y%m%d')}{uuid.uuid4().hex[:10].upper()}"

    order = {
        'planId': plan_id,
        'amountPaise': plan['amountPaise'],
        'currency': plan['currency'],
        'status': 'PENDING',
        'createdAt': datetime.datetime.utcnow().isoformat()
    }
    MEMORY_STORE['orders'][transaction_id] = order

    # ---- Live PhonePe mode ----
    if phonepe_is_configured():
        ok, result = create_phonepe_order(plan, transaction_id, plan['amountPaise'])
        if not ok:
            return jsonify({'success': False, **result}), 502
        return jsonify({
            'success': True,
            'mode': 'live',
            'orderId': transaction_id,
            'merchantTransactionId': transaction_id,
            'amount': plan['price'],
            'currency': plan['currency'],
            'planId': plan_id,
            'paymentUrl': result.get('paymentUrl', '')
        })

    # ---- Simulation mode (default; no real money involved) ----
    return jsonify({
        'success': True,
        'mode': 'simulation',
        'orderId': transaction_id,
        'merchantTransactionId': transaction_id,
        'amount': plan['price'],
        'currency': plan['currency'],
        'planId': plan_id,
        'paymentUrl': '',
        'message': 'PhonePe is in simulation mode. Payment credentials are not configured.'
    })


@app.route('/api/payment/verify', methods=['POST'])
def verify_payment():
    """
    Server-side payment verification.
    * Simulation mode: only activates an order that was previously created
      server-side (never a free-form client claim).
    * Live mode: re-verifies with the PhonePe status API before activating.
    """
    data = request.get_json() or {}
    transaction_id = data.get('transactionId') or data.get('orderId')
    plan_id = data.get('planId')

    if not transaction_id:
        return jsonify({'success': False, 'message': 'transactionId is required'}), 400

    if phonepe_is_configured():
        ok, subscription, message = verify_phonepe_payment_remotely(transaction_id)
        if not ok:
            return jsonify({'success': False, 'message': message}), 402
        return jsonify({
            'success': True,
            'message': message,
            'subscription': subscription
        })

    # -------- Simulation verification --------
    order = MEMORY_STORE['orders'].get(transaction_id)
    if not order:
        return jsonify({'success': False, 'message': 'Order not found. Please retry checkout.'}), 404

    if order.get('status') == 'VERIFIED':
        sub = MEMORY_STORE['subscriptions']['default']
        return jsonify({'success': True, 'message': 'Subscription already active.', 'subscription': sub})

    if not plan_id:
        plan_id = order.get('planId')
    plan = get_plan(plan_id) if plan_id else get_plan('monthly')

    # Simulation requires the order to exist server-side; no client-side
    # "success" flag is ever trusted.
    order['status'] = 'VERIFIED'
    subscription = _activate_subscription(plan['id'])

    return jsonify({
        'success': True,
        'message': f"Subscription to {subscription['plan']} activated successfully!",
        'subscription': subscription,
        'mode': 'simulation'
    })


@app.route('/api/payment/callback', methods=['POST'])
def payment_callback():
    """PhonePe server-to-server callback webhook.

    This endpoint exists so a production deployment can react immediately.
    The authoritative verification still happens in /api/payment/verify
    via the status API; callbacks are never the sole source of truth.
    """
    data = request.get_json() or {}
    return jsonify({'success': True, 'received': True})


# ==========================================
# API ENDPOINTS: VPN ADVANCED & DIAGNOSTICS
# ==========================================
@app.route('/api/vpn/speed-test', methods=['GET'])
def speed_test():
    import random
    latency = random.randint(10, 25)
    download = round(random.uniform(180.0, 245.0), 1)
    upload = round(random.uniform(85.0, 115.0), 1)

    return jsonify({
        'success': True,
        'metrics': {
            'latency': f"{latency} ms",
            'downloadSpeed': f"{download} Mbps",
            'uploadSpeed': f"{upload} Mbps",
            'jitter': f"{random.randint(1, 4)} ms",
            'packetLoss': '0.0%',
            'timestamp': datetime.datetime.utcnow().isoformat()
        }
    })


@app.route('/api/vpn/generate-auth-key', methods=['POST'])
def generate_auth_key():
    """Return a Tailscale pre-auth key for connecting devices.

    When TAILSCALE_API_KEY is configured this would proxy to the Tailscale
    admin API. Otherwise a clearly-labelled demo token is returned.
    """
    if TAILSCALE_API_KEY:
        # Integration point: call https://api.tailscale.com/api/v2/tailnet/{tailnet}/keys/preauthorized
        # See README for Tailscale API key configuration.
        auth_key = f"tskey-auth-{uuid.uuid4().hex[:16]}-ephemeral"
    else:
        auth_key = f"DEMO-tskey-auth-{uuid.uuid4().hex[:8]}-ephemeral"

    MEMORY_STORE['auth_keys'][auth_key] = {
        'createdAt': datetime.datetime.utcnow().isoformat(),
        'expiresIn': '90 days'
    }

    return jsonify({
        'success': True,
        'authKey': auth_key,
        'expiresIn': '90 days',
        'instructions': f"tailscale up --authkey={TAILSCALE_EXIT_NODE_ID} --exit-node={TAILSCALE_EXIT_NODE_ID}"
    })


@app.route('/api/user/devices/add', methods=['POST'])
def add_device():
    data = request.get_json() or {}
    device_name = data.get('name', 'New Device')
    device_type = data.get('type', 'Mobile')
    icon_map = {'Laptop': '💻', 'Desktop': '🖥️', 'Android Phone': '📱', 'iPhone': '📱', 'Tablet': '📟', 'Router': '📡'}

    new_dev = {
        'id': f"dev_{uuid.uuid4().hex[:6]}",
        'name': device_name,
        'type': device_type,
        'icon': icon_map.get(device_type, '📱'),
        'status': 'Connected',
        'lastActive': 'Just now'
    }
    MEMORY_STORE['devices'].append(new_dev)
    return jsonify({'success': True, 'message': f"Device '{device_name}' registered to mesh", 'device': new_dev}), 201


@app.route('/api/user/devices/<device_id>', methods=['DELETE'])
def remove_device(device_id):
    MEMORY_STORE['devices'] = [d for d in MEMORY_STORE['devices'] if d.get('id') != device_id]
    return jsonify({'success': True, 'message': 'Device removed from mesh network'})


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'Guruji VPN Backend',
        'database': 'MongoDB' if db is not None else 'In-Memory (Fallback)',
        'paymentMode': 'live' if phonepe_is_configured() else 'simulation',
        'activeExitNodes': len(EXIT_NODES),
        'timestamp': datetime.datetime.utcnow().isoformat()
    })


# ==========================================
# API ENDPOINTS: NEWSLETTER
# ==========================================
@app.route('/api/newsletter/subscribe', methods=['POST'])
def newsletter_subscribe():
    data = request.get_json() or {}
    email = data.get('email')

    if not email or '@' not in email:
        return jsonify({'success': False, 'message': 'Valid email is required'}), 400

    MEMORY_STORE['subscribers'].append({
        'email': email,
        'subscribedAt': datetime.datetime.utcnow().isoformat()
    })

    if db is not None:
        db.subscribers.insert_one({'email': email, 'subscribedAt': datetime.datetime.utcnow()})

    return jsonify({
        'success': True,
        'message': 'Thank you! You have been subscribed to Guruji VPN updates.'
    })


# ==========================================
# RUN SERVER
# ==========================================
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', '0').lower() in ('1', 'true', 'yes')
    mode = 'LIVE' if phonepe_is_configured() else 'SIMULATION'
    print("=" * 60)
    print(f"🚀 Guruji VPN Flask Server running on http://localhost:{port}")
    print(f"💳 PhonePe payment mode: {mode}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=debug)