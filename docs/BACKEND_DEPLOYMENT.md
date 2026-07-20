# JUIT NetSec backend and Vercel deployment

This document describes the production backend that lives in the same repository and Vercel project as the React/Vite frontend.

## Architecture

```text
Browser
  -> Vercel CDN and static Vite build
  -> POST /api/contact (Vercel Function)
       -> strict request validation
       -> exact same-origin check
       -> distributed Upstash rate limit
       -> honeypot check
       -> Cloudflare Turnstile Siteverify
       -> Resend email API
       -> contact@juit.se

Monitoring
  -> GET /api/health

SEO
  -> GET /robots.txt -> /api/robots
  -> GET /sitemap.xml -> /api/sitemap
```

There is no traditional always-on server. There is no application database, public login, payment flow or file-upload endpoint because the current website does not require them. Adding those systems would increase cost, personal-data storage and attack surface without supporting an existing feature.

## Contact endpoint

`POST /api/contact` accepts JSON only. The browser and API use these fields:

| Field | Required | Limit |
|---|---:|---:|
| `name` | yes | 2–100 characters |
| `email` | yes | 254 characters |
| `phone` | no | 40 characters and 6–20 digits |
| `message` | yes | 10–5,000 characters |
| `website` | honeypot | 200 characters |
| `turnstileToken` | yes | 2,048 characters |
| `submissionId` | yes | UUID v4 |
| `formStartedAt` | yes | Unix time in milliseconds |

Unknown properties are rejected. Requests must use the exact current origin, `application/json`, and a body no larger than 20 KiB. Responses and API logs do not contain the submitted message.

## Environment variables

Copy `.env.example` for local names only. Never commit `.env`, `.env.local`, Vercel downloads or real credentials.

### Server-only

| Variable | Purpose |
|---|---|
| `CONTACT_FORM_ENABLED` | Fail-closed switch. Must be exactly `true` before the API sends email. |
| `RESEND_API_KEY` | Resend sending-only API key restricted to the verified sending domain. |
| `CONTACT_FROM_EMAIL` | Static verified sender, for example `JUIT NetSec Website <website@notify.example.se>`. |
| `CONTACT_TO_EMAIL` | Confirmed receiving mailbox. Current value: `contact@juit.se`. |
| `TURNSTILE_SECRET_KEY` | Turnstile server secret. |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Optional comma-separated exact hostnames; no schemes, paths or wildcards. |
| `UPSTASH_REDIS_REST_URL` | Credential-free HTTPS REST URL. |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only Upstash token. |
| `RATE_LIMIT_HASH_SECRET` | At least 32 random characters used to HMAC IP and email identifiers. |
| `CONTACT_RATE_LIMIT_MAX` | IP attempts per window. Default `5`. |
| `CONTACT_RATE_LIMIT_EMAIL_MAX` | Email attempts per window. Default `2`. |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | Window length. Default `900`. |

### Browser-visible

| Variable | Purpose |
|---|---|
| `VITE_TURNSTILE_SITE_KEY` | Public Turnstile site key. It is compiled into the frontend and is not a secret. |

Any value with a `VITE_` prefix is public. Never place an API key or secret in a `VITE_` variable.

Generate the rate-limit hashing secret locally:

```bash
openssl rand -hex 32
```

Use different secrets and provider credentials for Preview and Production.

## Local setup

Requirements:

- Node.js 24
- npm

Install and run the frontend:

```bash
npm ci
npm run dev
```

Run repository checks:

```bash
npm run lint
npm test
npm run build
npm run report:build
npm run smoke:local
```

Run the full bundled check:

```bash
npm run check
```

Run browser smoke tests after installing Playwright Chromium:

```bash
npx playwright install chromium
npm run test:visual
```

The unit tests inject fake provider responses and require no secrets. Exercising Vercel Functions locally requires a Vercel-compatible local runtime such as `vercel dev` and a private local environment file.

## Vercel configuration

Confirm in the Vercel project dashboard:

1. The connected repository is `LvidSolutions/JUITNetsecWebsite`.
2. The Production Branch is `merge` unless the branch strategy is intentionally changed.
3. Framework preset is Vite.
4. Build command is `npm run build`.
5. Output directory is `dist`.
6. Install command is `npm ci`.
7. Node.js runtime is 24.
8. Preview and Production environment variables are configured separately.
9. Preview deployments are protected or explicitly marked `noindex`.

Environment changes affect only new deployments. Redeploy after adding or rotating a value.

## Provider setup

### Resend

1. Choose a sending subdomain under a domain controlled by JUIT NetSec, for example `notify.example.se`.
2. Add the exact SPF and DKIM records shown by Resend.
3. Wait until Resend reports the domain as verified.
4. Create separate Preview and Production sending-only API keys.
5. Restrict each key to the verified sending domain where supported.
6. Set the visitor address only as `Reply-To`; never use it as `From`.
7. Send one real Preview message to `contact@juit.se` before enabling Production.

### Cloudflare Turnstile

1. Create separate Preview and Production widgets where practical.
2. Configure exact permitted hostnames. Turnstile hostname entries do not accept URL schemes or wildcard characters.
3. Add the public site key as `VITE_TURNSTILE_SITE_KEY`.
4. Add the secret as `TURNSTILE_SECRET_KEY`.
5. Confirm the server response reports action `contact_form` and an allowed hostname.
6. Test expiration, provider failure and a real browser submission.

### Upstash Redis

1. Create Preview and Production databases in an EU region where available, or use isolated credentials and prefixes.
2. Add the REST URL and server token to the matching Vercel environment.
3. Generate a different `RATE_LIMIT_HASH_SECRET` for each environment.
4. Confirm the third attempt for the same email and the sixth attempt from the same IP return HTTP 429 within 15 minutes.
5. Confirm no raw IP address or email appears in Redis keys.

## Deployment sequence

1. Keep `CONTACT_FORM_ENABLED=false` while adding credentials.
2. Deploy Preview.
3. Verify `/api/health`, `/robots.txt` and `/sitemap.xml`.
4. Set `CONTACT_FORM_ENABLED=true` in Preview and redeploy.
5. Complete happy-path and negative contact tests.
6. Verify exactly one email arrives and logs contain no form content.
7. Configure separate Production credentials with `CONTACT_FORM_ENABLED=false`.
8. Deploy Production and verify the static site and health endpoint.
9. Set Production `CONTACT_FORM_ENABLED=true` and redeploy.
10. Send one real Production message and test rollback to the prior Vercel deployment.

## Expected API behavior

| Scenario | Expected status |
|---|---:|
| Valid contact request | `202` |
| Validation or Turnstile rejection | `400` |
| Wrong or missing origin | `403` |
| Body over 20 KiB | `413` |
| Wrong content type | `415` |
| Rate limit exceeded | `429` |
| Contact form disabled or protection provider unavailable | `503` |
| Email provider failure | `502` |

## Logging and personal data

Allowed log fields:

- event name
- request UUID
- HTTP status
- provider message ID

Do not log:

- name
- email
- phone
- message
- IP address
- Turnstile token
- API keys or provider tokens

The contact message is delivered to the company mailbox and is not stored in an application database. Mailbox retention and deletion rules must be decided and documented by JUIT NetSec under its GDPR process.

## CMS decision

No CMS is required to launch the current website: the public content is static, there are only 1–3 administrators, and introducing a CMS requires provider ownership, content modelling, access-control decisions and content migration. Sanity remains the recommended first option if non-technical content editing becomes a confirmed requirement.

Do not add a CMS token to browser code. A future integration should:

- use public read-only data for published content or server-side/build-time access
- keep preview tokens server-only
- provide static fallback content
- use separate staging and production datasets
- validate CMS data before rendering
- trigger a Vercel rebuild through a signed webhook

## Remaining manual approvals

The repository cannot create or accept external provider accounts. Launch still requires:

- a company-owned production domain and DNS access
- Resend domain verification and API keys
- Turnstile site and secret keys
- Upstash Preview and Production credentials
- Vercel environment-variable access
- a real end-to-end email test
- review of privacy notice, retention and provider agreements
