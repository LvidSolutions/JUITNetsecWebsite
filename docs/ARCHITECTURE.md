# JUIT NetSec website architecture

## Confirmed current platform

- Frontend: React 19 and Vite 7
- Source control: GitHub repository `LvidSolutions/JUITNetsecWebsite`
- Current production branch convention: `merge`
- Hosting and pull-request previews: Vercel
- Public accounts, payments and public uploads: not required

## Contact path implemented in draft PR #1

```text
Browser on a Vercel deployment
  -> same-origin POST /api/contact
  -> Vercel Function
       -> strict input validation
       -> distributed Upstash rate limit
       -> honeypot
       -> Cloudflare Turnstile Siteverify
       -> Resend API
  -> confirmed company inbox
```

The form is fail-closed. It is disabled unless both the frontend and server feature flags are explicitly enabled in the target Vercel environment.

## Intended content architecture

```text
Named administrators with MFA
  -> managed headless CMS Studio
  -> staging/production content datasets
  -> validated published content
  -> Vercel build/preview
  -> public website
```

Sanity is the recommended CMS, but it is not treated as approved or provisioned until issue #4 is resolved.

## Data storage decision

No separate application database is required for launch because:

- there are no public users or transactions
- CMS content belongs in the managed CMS
- contact messages are delivered to the business inbox rather than stored by the website
- rate-limit counters are temporary security data in Redis, not a business database

A managed PostgreSQL database should only be introduced after a concrete requirement such as a customer portal, CRM workflow, persistent lead status or custom authorization exists.

## Environment separation

| Concern | Preview | Production |
|---|---|---|
| Vercel deployment | Pull-request/branch preview | Production deployment from approved branch |
| Contact inbox | Test inbox | Confirmed company inbox |
| Resend key | Preview/restricted | Production/restricted |
| Turnstile | Preview widget/key | Production widget/key |
| Upstash | Preview database/credentials | Production database/credentials |
| CMS | Staging dataset | Production dataset |
| Feature flags | Enabled only during controlled testing | Enabled only after release approval |

Production secrets must never be copied into Preview environments.

## Trust boundaries

- The browser is untrusted. Frontend validation is only for user experience.
- Every accepted form field is validated again in the Vercel Function.
- `VITE_*` values are public and must never contain server credentials.
- The API accepts only exact same-origin browser requests.
- Turnstile is verified server-side.
- Client addresses are HMAC-hashed before use as Redis keys.
- Contact content is excluded from application logs.
- CMS preview tokens, webhook secrets and email credentials stay server-side.

## Pending architecture decisions

- final domain and canonical hostname
- primary/secondary languages and redirect policy
- official company contact details
- CMS approval and account ownership
- monitoring/error-reporting providers
- analytics implementation
- final content security policy after origin inventory
- backup destination and legal retention

These are tracked in issues #2 through #8 and must not be filled with inferred values.
