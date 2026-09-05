# Guruji VPN

Professional Tailscale-based VPN / Exit Node sharing service.

Secure, private and simple internet access powered by the **Tailscale** mesh network and **WireGuard** — quick to set up on any device (Windows, macOS, Linux, Android, iOS).

## Features

- **Tailscale-based networking** — reliable mesh VPN built on WireGuard
- **Exit Node sharing** — route your internet traffic through one of our shared exit nodes
- **Multi-device support** — connect phones, laptops and desktops
- **Simple phone setup** — install Tailscale, sign in, select the Guruji exit node
- **PhonePe payment** — server-side verified checkout (env-configured credentials)
- **User dashboard** — connection status, exit nodes, subscription, connected devices
- **Mobile-first design** — fully responsive, light and professional UI

## Tech Stack

- **Backend:** Flask (Python 3.9+) with REST API
- **Database:** MongoDB (optional — falls back to in-memory store for local dev)
- **Frontend:** Single-page static site with Tailwind CSS (CDN)
- **Payments:** PhonePe Payment Gateway (env-configured; simulation mode by default)

## Project Structure

```
├── app.py                  # Flask backend: API routes, payments, serving
├── index.html              # Frontend SPA (Tailwind + inline JS)
├── css/styles.css          # Custom styles
├── js/                     # Modular JS (maintained for future split)
├── requirements.txt        # Python dependencies
├── .env.example            # Required environment variables (copy to .env)
└── .gitignore
```

## Quick Start

### 1. Backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # then edit .env
python app.py
```

The server runs at `http://localhost:5000` and serves both the API and the frontend.

### 2. PhonePe payments

1. Get your PhonePe merchant credentials (Merchant ID, Salt Key, Salt Index).
2. Fill the `PHONEPE_*` variables in `.env`.
3. Set `PHONEPE_ENABLED=true` and point `PHONEPE_API_BASE` at the correct environment (sandbox vs production).

When `PHONEPE_ENABLED` is `false`, the payment endpoints run in **simulation mode** so the flow can be tested end-to-end without real money.

> **Security:** Merchant credentials are read from the server environment only. They are never shipped to (or stored by) the frontend. Payment success is only ever accepted after server-side verification by PhonePe's status API, never from the client.

## API Overview

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create account |
| `/api/auth/login` | POST | Login |
| `/api/user/profile` | GET | User profile |
| `/api/user/subscription` | GET | Subscription details |
| `/api/user/devices` | GET | Connected devices |
| `/api/vpn/status` | GET | VPN / exit-node status |
| `/api/vpn/exit-nodes` | GET | List exit nodes |
| `/api/vpn/connect` | POST | Connect to an exit node |
| `/api/vpn/disconnect` | POST | Disconnect |
| `/api/payment/create` | POST | Create a PhonePe payment order |
| `/api/payment/verify` | POST | Server-side payment verification |
| `/api/health` | GET | Health check |

## Mobile Connection (quick guide)

1. Install **Tailscale** from the App Store / Play Store.
2. Sign in with your Gmail (same one used on Guruji).
3. Open the phone, tap the menu (⋮), choose **Exit Nodes**.
4. Select the **Guruji VPN** exit node and connect.

## License

Private repository — all rights reserved. Do not redistribute without permission.