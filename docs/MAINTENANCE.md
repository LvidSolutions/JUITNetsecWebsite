# Maintenance schedule

Assign named owners for each activity in the company's operating documentation. Do not store private contact details in this file.

## Continuous/automatic

- Vercel deployment status
- GitHub CI and dependency audit
- uptime and TLS monitoring after provider setup
- application/error alerts after provider setup
- contact-provider usage and failure alerts
- scheduled CMS backup status after CMS setup

## Weekly

- Review Dependabot pull requests and security alerts.
- Review failed Vercel deployments and repeated API errors.
- Check contact delivery failures, bounces and complaints.
- Verify scheduled backups completed.
- Run or review broken-link checks.
- Remove obvious spam from the receiving inbox.

## Monthly

- Apply reviewed dependency updates.
- Send one controlled contact-form test through Preview and Production.
- Review Vercel, email, Redis, CMS and monitoring usage/costs.
- Review 404 routes and search-console errors after domain launch.
- Run Lighthouse and a basic keyboard/accessibility smoke test.
- Confirm domain, certificate and email-authentication status.
- Review administrator accounts and inactive access.
- Verify one recent backup is readable.

## Quarterly

- Restore the latest CMS backup into a temporary staging dataset.
- Review all provider access, MFA and recovery ownership.
- Review Content Security Policy and external origins.
- Run an automated security scan against staging.
- Run manual WCAG checks and real-device browser tests.
- Review privacy processors, retention and international transfers.
- Review DMARC reports and tighten policy when safe.
- Run an incident-response/tabletop exercise.
- Re-measure Core Web Vitals and bundle size.

## Annually

- Verify domain ownership, registrar lock, auto-renewal and recovery.
- Review legal/privacy/cookie notices with the responsible legal reviewer.
- Complete a full disaster-recovery exercise.
- Review architecture, providers, costs and vendor lock-in.
- Remove obsolete accounts, secrets, DNS records and integrations.
- Review all public company information and legal identifiers.
- Commission an external security/accessibility review when risk or customer requirements justify it.

## Change-triggered tasks

Run the relevant checks immediately after:

- changing DNS, email DNS or domain ownership
- changing Vercel environments or production branch
- adding a third-party script or analytics provider
- adding a CMS model or administrator
- changing contact-form fields or retention
- rotating a secret
- introducing a database, public account, payment or upload feature
- receiving a security report or personal-data request
