# Vercel production setup

The website frontend and contact API are designed to run in the same Vercel project. The frontend posts to `/api/contact`, which avoids a separate API domain and public CORS configuration. The API rejects requests whose `Origin` is not exactly the current deployment origin.

## Confirm in the Vercel dashboard

These values cannot be verified from this repository and must be checked by a project owner:

1. The connected GitHub repository is `LvidSolutions/JUITNetsecWebsite`.
2. The Production Branch is `merge` until the repository branch strategy is intentionally changed.
3. Preview Deployments are enabled for pull requests.
4. The project framework preset is Vite and the output directory is `dist`.
5. The Node.js runtime selected by Vercel is supported by the project and CI.
6. Production and Preview environment variables are configured separately.
7. Enable Vercel System Environment Variables if `/api/health` should expose the deployed environment and short commit SHA. CI verifies the exact deployed commit independently through Vercel's GitHub commit status.

## Protected Preview deployments

The CI workflow first confirms that Vercel reported a successful deployment for the exact pull-request commit. It then attempts live HTTP route and security-header checks.

If Deployment Protection blocks anonymous automation, create an automation bypass secret in Vercel and store it as the GitHub repository secret:

```text
VERCEL_AUTOMATION_BYPASS_SECRET
```

The value is sent only as Vercel's server-side protection-bypass header. Never expose it through a `VITE_` variable, commit it, print it, or reuse it as an application secret.

When the secret is absent and the Preview returns HTTP 401 or 403, CI emits an explicit warning instead of claiming that live routes were tested. The local production-build smoke test remains blocking.

## Environment variables

### Public frontend variables

| Name | Production | Preview |
|---|---|---|
| `VITE_CONTACT_FORM_ENABLED` | `true` after all server secrets work | `true` only when preview services are configured |
| `VITE_CONTACT_API_URL` | `/api/contact` | `/api/contact` |
| `VITE_TURNSTILE_SITE_KEY` | Production widget site key | Separate preview/test site key |

### Server-only variables

| Name | Purpose |
|---|---|
| `CONTACT_FORM_ENABLED` | Fail-closed switch; must be exactly `true` to send |
| `RESEND_API_KEY` | Restricted Resend sending key |
| `CONTACT_FROM_EMAIL` | Verified static sender, for example `JUIT NetSec Website <website@notify.DOMAIN>` |
| `CONTACT_TO_EMAIL` | Confirmed company inbox |
| `TURNSTILE_SECRET_KEY` | Server-side Turnstile secret |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Optional comma-separated extra hostname allowlist; the current deployment hostname is always checked |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Server-only standard/ACL token |
| `RATE_LIMIT_HASH_SECRET` | At least 32 random characters, used to HMAC client addresses |
| `CONTACT_RATE_LIMIT_MAX` | Default `5` |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | Default `900` |

Generate the rate-limit hashing secret locally and store only the result in Vercel:

```bash
openssl rand -hex 32
```

## Required external setup

### Resend

1. Add a sending subdomain such as `notify.DOMAIN`.
2. Add the exact SPF and DKIM records supplied by Resend.
3. Verify the domain in Resend.
4. Create a sending-only API key.
5. Use the verified address in `CONTACT_FROM_EMAIL`.
6. Keep the visitor's address only in `Reply-To`.

### Cloudflare Turnstile

1. Create separate production and preview widgets where practical.
2. Add the relevant production and preview hostnames.
3. Store the site key in `VITE_TURNSTILE_SITE_KEY`.
4. Store the secret key in `TURNSTILE_SECRET_KEY`.
5. Verify one real browser submission in both Preview and Production.

### Upstash Redis

1. Create a small Redis database in an EU region where available.
2. Copy the REST URL and server token to Vercel.
3. Do not expose the token through a `VITE_` variable.
4. Verify that repeated submissions return HTTP 429 after the configured limit.

## Deployment verification

Do not enable the form in Production until all checks pass:

- GitHub CI is green.
- The locked dependency audit, API tests, Vercel configuration tests, frontend build and local production smoke test pass.
- Vercel reports a successful deployment for the exact pull-request commit.
- Protected Preview automation is configured, or the remaining HTTP verification is explicitly recorded as blocked.
- `/api/health` returns HTTP 200 from an authorized Preview request.
- A valid contact request returns HTTP 202.
- The email arrives in the confirmed test inbox.
- Cross-origin requests, invalid JSON, failed Turnstile and rate-limit cases are rejected.
- No form content appears in Vercel logs.
- Rollback to the previous Vercel deployment has been tested.
