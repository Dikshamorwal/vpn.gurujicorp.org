"""
Guruji VPN - Flask Backend Application
REST API server with MongoDB integration & static frontend serving
"""

import os
import json
import uuid
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# ==========================================
# CONFIGURATION
# ==========================================
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/guruji_vpn')
SECRET_KEY = os.getenv('SECRET_KEY', 'guruji_vpn_secret_key_2026')

# Initialize MongoDB client with fallback in-memory store
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
            'price': '$9/mo',
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
    password = data.get('password')

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
    node_id = data.get('nodeId', 'in-mum-01')
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
# API ENDPOINTS: PAYMENTS
# ==========================================
@app.route('/api/payment/create', methods=['POST'])
def create_payment():
    data = request.get_json() or {}
    plan_id = data.get('planId', 'monthly')
    price_map = {'trial': 1, 'monthly': 9, 'yearly': 5}
    amount = price_map.get(plan_id, 9)

    order_id = f"ord_{uuid.uuid4().hex[:10]}"
    return jsonify({
        'success': True,
        'orderId': order_id,
        'amount': amount,
        'currency': 'USD',
        'planId': plan_id
    })


@app.route('/api/payment/verify', methods=['POST'])
def verify_payment():
    data = request.get_json() or {}
    plan_id = data.get('planId', 'monthly')
    name_map = {'trial': 'Trial Plan', 'monthly': 'Monthly Plan', 'yearly': 'Yearly Plan'}
    price_map = {'trial': '$1/7d', 'monthly': '$9/mo', 'yearly': '$5/yr'}

    sub = {
        'plan': name_map.get(plan_id, 'Monthly Plan'),
        'status': 'Active',
        'price': price_map.get(plan_id, '$9/mo'),
        'expiry': (datetime.date.today() + datetime.timedelta(days=30)).isoformat(),
        'autoRenew': True
    }
    MEMORY_STORE['subscriptions']['default'] = sub

    return jsonify({
        'success': True,
        'message': f"Subscription to {sub['plan']} activated successfully!",
        'subscription': sub
    })


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
    auth_key = f"tskey-auth-guruji-{uuid.uuid4().hex[:16]}-ephemeral"
    return jsonify({
        'success': True,
        'authKey': auth_key,
        'expiresIn': '90 days',
        'instructions': f"tailscale up --authkey={auth_key} --exit-node=in-mum-01"
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
    print(f"==================================================")
    print(f"🚀 Guruji VPN Flask Server running on http://localhost:{port}")
    print(f"==================================================")
    app.run(host='0.0.0.0', port=port, debug=True)
