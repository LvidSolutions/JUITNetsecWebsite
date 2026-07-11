# Production blockers and decisions

This file intentionally records unknowns instead of filling them with assumptions.

## Confirmed business data

- [x] Official public contact email: `contact@juit.se`.
- [x] Contact-form receiving inbox: `contact@juit.se`.

## Blockers requiring account or business access

- [ ] Confirm the Vercel plan, project owner and Production Branch in the Vercel dashboard.
- [ ] Confirm the final domain; no production DNS, TLS, canonical URLs or email DNS can be completed before purchase.
- [ ] Confirm the official phone number, address and primary site language.
- [ ] Create and verify the Resend sending domain and restricted API key.
- [ ] Create Turnstile production/preview widgets and keys.
- [ ] Create Upstash Redis and add separate Preview/Production credentials.
- [ ] Add all Vercel environment variables and keep the contact form disabled until verified.
- [ ] Decide whether Sanity is approved as CMS and create the organization/project/datasets.
- [ ] Obtain legal review of privacy notice, retention, processor agreements and international transfers.

## Technical checks still required

- [ ] Confirm the actual Vercel Preview build succeeds.
- [ ] Confirm the frontend build succeeds from the complete repository.
- [ ] Run browser E2E tests against the Preview URL.
- [ ] Inventory all external origins before enforcing Content Security Policy.
- [ ] Verify mobile Safari, Firefox and Chromium.
- [ ] Verify accessibility, reduced motion and keyboard navigation.
- [ ] Verify production email delivery, SPF, DKIM and DMARC.
- [ ] Configure monitoring, alerts, backup exports and a tested rollback procedure.

## Explicit non-goals for the current contact API

- No public accounts.
- No custom admin authentication.
- No payment processing.
- No public file uploads.
- No storage of contact messages in an application database.
