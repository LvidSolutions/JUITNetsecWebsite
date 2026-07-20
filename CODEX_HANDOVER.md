# JUIT NetSec website — current implementation handover

## Repository

- Remote: `https://github.com/LvidSolutions/JUITNetsecWebsite`
- Production branch: `merge`
- Stack: React 19, Vite 7, Tailwind CSS, Framer Motion, OGL, Node.js 24
- Hosting: Vercel
- Public and contact-form receiving email: `contact@juit.se`

Do not infer a final website domain, organization number, postal address, CMS project or provider credential from placeholders. Confirm business data before publishing it.

## Runtime architecture

- Static frontend: `src/`
- Vercel Functions: `api/`
- Contact entrypoint: `api/contact.js`
- Health endpoint: `api/health.js`
- Robots endpoint: `api/robots.js`, exposed as `/robots.txt`
- Sitemap endpoint: `api/sitemap.js`, exposed as `/sitemap.xml`
- Server modules: `api/_lib/`
- API and security tests: `test/`
- Browser smoke tests: `e2e/`
- Deployment guide: `docs/BACKEND_DEPLOYMENT.md`

The contact flow uses Resend, Cloudflare Turnstile and Upstash Redis. It is fail-closed when `CONTACT_FORM_ENABLED` is not exactly `true` or required server configuration is missing.

There is no application database, public authentication, payment system or file-upload API because the current website does not require those systems.

## Commands

```bash
npm ci
npm run lint
npm test
npm run build
npm run report:build
npm run smoke:local
```

Full non-browser check:

```bash
npm run check
```

Browser smoke tests:

```bash
npx playwright install chromium
npm run test:visual
```

## Environment safety

- Copy variable names from `.env.example`.
- Never commit `.env`, `.env.local`, `.vercel` or real credentials.
- Every `VITE_` value is public browser configuration.
- Preview and Production must use separate Resend, Turnstile, Upstash and hashing credentials.
- Keep `CONTACT_FORM_ENABLED=false` until a real Preview submission has been delivered and logs have been reviewed.

## Verified design constraints

Preserve the current premium dark JUIT NetSec design, animations, responsive behavior and page composition unless a task explicitly asks for a visual change. Backend and security work must not silently redesign the frontend.

## Manual launch blockers

Repository code cannot complete these external steps:

1. Purchase and confirm the company-owned production domain.
2. Add Vercel Preview and Production environment values.
3. Verify the Resend sending domain and SPF/DKIM records.
4. Create Preview and Production Turnstile widgets.
5. Create or provision isolated Upstash credentials.
6. Send one real Preview and one real Production email to `contact@juit.se`.
7. Review privacy notice, retention and processor agreements.
8. Decide whether a CMS is required. Sanity is the preferred future option, but it is not required for the current static launch.

## Change discipline

- Read only the files relevant to the requested task.
- Do not delete or rewrite major visual sections without an explicit reason.
- Add tests for critical backend behavior.
- Keep server errors generic and keep personal data out of logs.
- Review the final diff and deployment status before enabling a production feature.
