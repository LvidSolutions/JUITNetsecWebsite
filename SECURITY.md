# Security policy

## Supported code

The production website is deployed from the `merge` branch. Security fixes should target the current production code and should be validated by CI and a Vercel Preview before activation whenever the change can affect runtime behavior.

## Reporting a vulnerability

Do not disclose a suspected vulnerability in a public issue when it may expose credentials, personal data or an exploitable production weakness. Contact the JUIT NetSec project owner through the private company contact channel and include:

- affected URL or component
- reproduction steps
- expected and actual behavior
- impact assessment
- screenshots or request IDs with personal data removed

Never include API keys, passwords, Turnstile tokens, Redis tokens or contact-form content in a report.

## Secrets

- Store secrets only in Vercel Environment Variables or the relevant provider secret manager.
- Keep Preview and Production credentials separate.
- Never use a `VITE_` prefix for a secret; those values are compiled into browser code.
- Rotate a credential immediately if it is exposed in Git, logs, screenshots or chat.
- After rotation, redeploy every affected environment and revoke the old value.

## Contact-form security controls

The contact endpoint is expected to enforce:

- exact same-origin requests
- JSON-only input and a 20 KiB body limit
- strict allowlisted fields and length limits
- distributed IP and email rate limiting
- a honeypot field
- server-side Cloudflare Turnstile verification
- static verified email sender and visitor address only in `Reply-To`
- HTML escaping and header sanitization
- no personal data in application logs
- fail-closed behavior when required configuration or protection providers are unavailable

## Incident response

For a suspected production incident:

1. Disable the contact form with `CONTACT_FORM_ENABLED=false` and redeploy if the form is involved.
2. Preserve relevant request IDs and provider event IDs without copying contact content.
3. Rotate affected credentials.
4. Roll back to the last verified Vercel deployment when code is suspected.
5. Review Vercel, Resend, Turnstile and Upstash activity.
6. Determine whether personal data was affected and follow the company GDPR incident process.
7. Document root cause, containment, recovery and preventive action.

## Dependency security

GitHub Actions runs a locked install, high-severity dependency audit, source checks, tests and a production build. Dependabot checks npm dependencies weekly. A dependency update must not be merged solely because it is automated; review its changelog, runtime impact and test results.
