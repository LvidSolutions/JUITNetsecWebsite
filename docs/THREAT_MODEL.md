# JUIT NetSec website threat model

## Scope

This model covers the public React/Vite website, Vercel Functions, the contact form, Vercel deployment integration, Resend, Cloudflare Turnstile, Upstash Redis and the planned CMS integration. It does not claim that external provider configuration has been verified.

## Assets to protect

- company domain and DNS control;
- GitHub and Vercel deployment integrity;
- administrator accounts and recovery methods;
- API, email, CAPTCHA, Redis and CMS credentials;
- contact-form personal data;
- company email reputation and deliverability;
- website availability and public content integrity;
- logs, backups and incident evidence.

## Trust boundaries

```text
Visitor browser
  -> Vercel CDN and deployment protection
  -> static frontend
  -> same-origin /api/contact Vercel Function
       -> Cloudflare Turnstile
       -> Upstash Redis
       -> Resend
            -> company inbox

GitHub
  -> Vercel build and deployment

Administrator
  -> planned CMS identity provider and Studio
  -> CMS content API
  -> website build/deploy hook
```

Every arrow crossing into another provider is a trust boundary. Provider success must not be inferred solely from a local test.

## Primary threats and controls

| Threat | Impact | Current or required control | Residual risk |
|---|---|---|---|
| Automated contact spam | Mail flood, cost, lost enquiries | Honeypot, Turnstile, distributed rate limit, body limit | Distributed bot networks can rotate IPs |
| Contact endpoint abuse from another site | Spam and unwanted API use | Exact same-origin enforcement | Direct scripted clients can still set headers; Turnstile remains required |
| Header injection | Additional recipients or malformed mail | Strict field validation and CRLF sanitization | Provider behavior must still be verified |
| XSS through form content | Mail-client or admin compromise | HTML escaping and plain-text alternative | Mail-client parser vulnerabilities remain external |
| XSS through CMS content | Visitor compromise | Schema validation, safe rich-text renderer, CSP | CMS editor accounts remain high-value targets |
| Secret exposure in frontend | Provider account compromise | Server-only variables, CI env-file guard, no `VITE_` prefix | Dashboard access can still expose values |
| Secret exposure in logs | Credential or PII leak | Structured allowlisted logs and log tests | Provider platform metadata is externally controlled |
| Stolen admin account | Content defacement or malicious scripts | Named accounts, MFA/passkeys, least privilege, access review | Identity provider compromise |
| Compromised dependency | Build or runtime compromise | Lockfile, `npm ci`, audit, Dependabot, pinned Actions | Audit databases are incomplete |
| Compromised GitHub Action | CI secret theft | Immutable Action SHAs and least permissions | Trusted pinned commit can still contain defects |
| Malicious deployment | Defacement or data interception | Protected branches, reviews, CI, exact Vercel commit status | Repository owner compromise |
| Preview data leak | Drafts or secrets exposed | Separate Preview variables, deployment protection, no production CMS tokens | Misconfigured provider dashboard |
| Redis outage | Form abuse if limit fails open | Fail-closed 503 behavior | Legitimate messages are unavailable during outage |
| Turnstile outage | Form unavailable or bots accepted | Fail-closed 503 behavior, visible fallback contact details | Availability depends on provider |
| Resend outage | Lost or delayed enquiries | Timeout, generic error, preserved form values, retry by user | A provider may accept mail before a network timeout |
| Duplicate emails | Repeated enquiries and confusion | Stable submission UUID and provider idempotency key | Idempotency retention is provider-dependent |
| DNS or registrar takeover | Total site and mail compromise | Company ownership, MFA, lock, DNSSEC, change alerts | Registrar account recovery remains critical |
| DDoS | Site or function unavailability | Vercel edge protection, bounded functions, rate limiting | Large provider-level attack |
| Personal data retained too long | GDPR and breach impact | No application database, retention policy for mail/logs | Mailbox and backups need separate controls |
| Broken rollback | Extended incident | Vercel rollback runbook and rehearsal | CMS/DNS rollback requires external access |

## Abuse cases that must stay tested

- malformed and oversized JSON;
- unexpected JSON properties;
- invalid email and enum values;
- missing, expired, wrong-action and wrong-hostname Turnstile tokens;
- Turnstile transport failure;
- Redis transport failure, malformed JSON and unexpected result shape;
- rate-limit exhaustion;
- honeypot submissions;
- email HTML injection and CRLF injection;
- email provider rejection and malformed success body;
- cross-origin form submission;
- missing required configuration;
- accidental logging of form data or credentials;
- protected Preview deployments without an automation bypass secret.

## Security decisions

- The public site has no user accounts or sessions.
- CMS authentication should be delegated to the selected managed CMS rather than implemented in this application.
- Contact messages are not stored in an application database at launch.
- The contact API fails closed when CAPTCHA or distributed rate limiting is unavailable.
- Production contact delivery remains disabled until a real Preview message and rollback test succeed.
- A CSP is not enforced until all final third-party origins are inventoried and report-only results are reviewed.
- HSTS is not enabled until the final domain and required subdomains are verified over HTTPS.

## Review triggers

Review this threat model when any of the following changes:

- a database or customer login is introduced;
- file uploads are added;
- a CMS is selected or replaced;
- analytics or advertising scripts are added;
- a new domain, API host or third-party provider is introduced;
- contact messages are stored outside the business mailbox;
- administrators or roles change;
- a security incident or meaningful near miss occurs.
