# Incident response runbook

This runbook covers the public website, Vercel Functions, CMS, contact email and related credentials.

## Severity

| Severity | Examples | Initial action |
|---|---|---|
| P1 | Domain/DNS takeover, exposed production secret, confirmed personal-data disclosure, active compromise | Contain immediately and appoint incident lead |
| P2 | Production unavailable, contact form repeatedly failing, unauthorized CMS access suspected | Disable affected feature and restore service |
| P3 | Partial route failure, monitoring degradation, non-critical security misconfiguration | Triage and schedule urgent fix |
| P4 | Low-risk bug or improvement | Normal backlog |

## Required roles

The company must record named people for these roles outside the repository:

- Incident lead
- Technical lead
- Business owner
- Legal/privacy contact
- Communications contact
- Backup decision maker

Do not put private phone numbers or recovery codes in this file.

## Immediate containment

### Contact-form incident

1. In Vercel Production, set `CONTACT_FORM_ENABLED=false`.
2. Set `VITE_CONTACT_FORM_ENABLED=false` and redeploy so the UI shows the safe fallback.
3. Revoke/rotate the affected Resend, Turnstile or Upstash credential when exposure is possible.
4. Preserve request IDs, timestamps and provider event IDs without copying form content into tickets.
5. Verify the public email and phone fallback remain usable.

### Website/deployment incident

1. Identify the first affected Vercel deployment and Git commit.
2. Roll back/promote the last verified deployment.
3. Confirm core routes and `/api/health`.
4. Block further production merges until the cause is understood.

### CMS/admin incident

1. Revoke the affected administrator sessions/account.
2. Rotate CMS tokens and webhook secrets.
3. Review document history and published changes.
4. Restore/revert affected content.
5. Confirm draft content and private configuration were not exposed.

### Domain or DNS incident

1. Contact the registrar using the documented recovery process.
2. Lock the account and rotate registrar/DNS credentials.
3. Compare active records with the last approved DNS export.
4. Restore records and verify DNSSEC/TLS/email authentication.
5. Monitor certificate issuance and mail delivery for unauthorized changes.

## Evidence and logging

Record:

- incident start and discovery time
- affected environments and deployments
- Git commit IDs
- provider event/request IDs
- actions and responsible person
- credentials rotated
- data categories potentially affected
- service recovery time

Do not copy passwords, API keys, raw Turnstile tokens, complete contact messages or unnecessary personal data into the incident record.

## Personal-data assessment

The appointed privacy/legal contact must determine:

- whether personal data was affected
- categories and approximate number of people/records
- likely consequences
- containment measures
- whether supervisory-authority notification is required
- whether affected people must be informed

The legal/privacy decision and timing must be documented separately from technical assumptions.

## Recovery verification

- [ ] Production deployment is Ready.
- [ ] Core routes and direct refresh work.
- [ ] `/api/health` responds successfully.
- [ ] Contact form remains disabled until safe to re-enable.
- [ ] Rotated credentials are active and old credentials are revoked.
- [ ] Monitoring and email delivery are normal.
- [ ] No unexpected DNS or CMS changes remain.

## Post-incident review

Within an agreed period after recovery:

1. Write a timeline and root cause.
2. Record what detection succeeded or failed.
3. Add tests or controls that prevent recurrence.
4. Update this runbook and the release checklist.
5. Assign owners and deadlines to follow-up actions.
6. Re-enable the affected feature only after documented approval.
