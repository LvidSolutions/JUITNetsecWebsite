# Release checklist

Use this checklist for every production release from `merge`.

## Before approval

- [ ] Pull request scope is coherent and reviewed.
- [ ] GitHub CI is green: install, audit, API tests and frontend build.
- [ ] Vercel Preview is Ready for the exact pull-request head commit.
- [ ] Preview uses only Preview secrets and test inboxes.
- [ ] Relevant routes work on direct request and browser refresh.
- [ ] Browser console has no new errors.
- [ ] Keyboard, focus and reduced-motion behavior were checked for affected UI.
- [ ] No secret, `.env` file or personal data was added to Git or logs.
- [ ] Deployment, DNS, CMS or environment-variable changes are documented.
- [ ] A rollback target is identified.

## Contact-form releases

- [ ] `CONTACT_FORM_ENABLED` and `VITE_CONTACT_FORM_ENABLED` remain false until external configuration is complete.
- [ ] Resend sender domain and restricted API key are verified.
- [ ] Turnstile site/secret keys match the target environment and hostname.
- [ ] Upstash credentials and rate-limit hash secret belong to the target environment.
- [ ] Valid Preview submission returns HTTP 202 and delivers exactly one message.
- [ ] Invalid JSON, invalid origin and failed Turnstile are rejected.
- [ ] Repeated requests return HTTP 429 after the configured limit.
- [ ] Provider failure returns a generic message and preserves form values.
- [ ] Vercel logs contain request IDs and technical status only, not form content.

## Production deployment

- [ ] Confirm the Vercel Production Branch is still the intended branch.
- [ ] Confirm Production environment variables before merge.
- [ ] Merge using the approved repository method.
- [ ] Wait for the exact production deployment to report Ready.
- [ ] Verify homepage, services, about, contact and `/api/health`.
- [ ] Send one controlled production contact request when the form is enabled.
- [ ] Confirm delivery, Reply-To and email authentication.
- [ ] Check error monitoring, uptime and provider usage.

## Rollback

Rollback immediately when a release causes broken navigation, contact failure, material accessibility regression, repeated 5xx responses, leaked data or an unknown security condition.

1. Disable the contact form through both feature flags when the incident involves contact processing.
2. Promote/redeploy the last verified Vercel deployment.
3. Confirm the rollback using the production URL and `/api/health`.
4. Preserve logs and record the affected commit/deployment IDs.
5. Rotate credentials when exposure is suspected.
6. Open an incident record and complete a root-cause review before re-release.
