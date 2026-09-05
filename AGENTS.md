# AGENTS.md

## Project

Guruji VPN — a Tailscale-based VPN / Exit Node sharing service.
Flask backend + single-page frontend (Tailwind CSS via CDN).

## Commands

- Run backend: `python app.py` (http://localhost:5000)
- Install deps: `pip install -r requirements.txt`
- No test suite or build step currently exists.

## Config / Environment

- Copy `.env.example` → `.env` and fill in values (Python style, `KEY=value`).
- The app reads config via `os.getenv`; missing optional values fall back safely.
- **Never** commit `.env` or any file containing PhonePe/Tailscale credentials.
- PhonePe is in simulation mode unless `PHONEPE_ENABLED=true` with valid credentials.

## Conventions

- Backend is Flask; all API routes live in `app.py`.
- Frontend is a single `index.html` with inline JS; reusable styles in `css/styles.css`.
- `js/` contains modular components for future refactor — they are not yet loaded by `index.html`.
- All monetary values are stored/displayed as fixed amounts; backend is the source of truth for pricing.
- Maintain a professional, non-exaggerated security tone (no "zero logging" or "100% anonymity" claims).

## Verification

- No CI/lint configured. Before finishing changes, run `python -c "import app"` to catch syntax errors, and do a quick manual test of the API (`/api/health`, `/api/payment/create`, `/api/payment/verify`).