# JUIT NetSec contact API

Small standalone backend for the website contact form.

## Endpoints

- `GET /health`
- `POST /api/contact`

## Local setup

1. Copy `.env.example` to `.env` and fill in the secrets.
2. Run `npm install`.
3. Export the variables from `.env` in your shell.
4. Run `npm run dev`.

The frontend calls `VITE_CONTACT_API_URL`. For local development, set it to `http://localhost:3000/api/contact`.

## Required production setup

- Verify `juitnetsec.se` as a sending domain in Resend.
- Store `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` only in the hosting provider's secret manager.
- Set `ALLOWED_ORIGINS` to the exact production and preview origins that may submit the form.
- Keep the backend and frontend accounts owned by JUIT NetSec AB, with named users and MFA enabled.

## Security controls

- Strict JSON Schema validation and a 20 KB request limit.
- Per-IP rate limit of 5 contact requests per 15 minutes.
- Exact CORS allowlist.
- Security headers through Helmet.
- Honeypot field and optional Cloudflare Turnstile server-side verification.
- No message content is written to application logs.
- No database is used, reducing stored personal data and attack surface.
