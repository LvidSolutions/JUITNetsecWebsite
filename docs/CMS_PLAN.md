# CMS decision and implementation plan

## Current decision

The current JUIT NetSec website does not require a CMS to launch. Its public pages are static, there are no posts or authenticated users, and the existing content can be deployed safely through Git and Vercel.

A CMS should be introduced only when non-technical administrators need to change content without a code review and deployment. Adding one before that requirement is confirmed would introduce another provider, authentication surface, content migration, privacy review and failure mode.

## Recommended future CMS

Sanity is the preferred first option because it fits the existing React/Vite architecture, provides a hosted administration interface, supports structured content and media, and does not require JUIT NetSec to operate a traditional database-backed CMS server.

Sanity must not become a hard runtime dependency for the website shell. Public pages should keep validated static fallback content so missing CMS configuration or a temporary CMS outage does not make the site unusable.

## Content that should be editable

Recommended document types:

- `siteSettings`
  - public company name
  - public email and phone
  - social links
  - default SEO metadata
- `navigation`
  - labels
  - internal routes
  - order
  - primary call to action
- `page`
  - title
  - slug
  - locale
  - modular content blocks
  - SEO fields
- `service`
  - title
  - slug
  - summary
  - full description
  - order
  - active state
- `partner`
  - name
  - official URL
  - logo
  - alternative text
  - order
- `legalPage`
  - privacy notice
  - cookie information
  - revision date
- `redirect`
  - source path
  - target path
  - permanent or temporary status
- `seo`
  - meta title
  - meta description
  - canonical override
  - Open Graph image
  - noindex flag

Animation timings, WebGL configuration and core layout should remain code-owned rather than editable CMS fields.

## Environment placeholders

These variables are examples only and should not be added to Vercel until a Sanity project exists:

```dotenv
VITE_SANITY_PROJECT_ID=SANITY_PROJECT_ID
VITE_SANITY_DATASET=production
VITE_SANITY_API_VERSION=2026-07-01
SANITY_PREVIEW_TOKEN=CMS_API_TOKEN
SANITY_WEBHOOK_SECRET=WEBHOOK_SECRET
```

`VITE_SANITY_PROJECT_ID`, dataset and API version are public configuration. Preview tokens and webhook secrets are server-only and must never have a `VITE_` prefix.

## Proposed repository structure

```text
studio/
  sanity.config.ts
  sanity.cli.ts
  schemaTypes/
    siteSettings.ts
    navigation.ts
    page.ts
    service.ts
    partner.ts
    legalPage.ts
    redirect.ts
    seo.ts
src/lib/cms/
  client.js
  queries.js
  validation.js
  fallback-content.js
api/webhooks/
  sanity.js
```

## Integration rules

1. Create separate `staging` and `production` datasets.
2. Invite named administrators individually; do not share accounts.
3. Require MFA through the administrator identity provider.
4. Fetch published content at build time where possible.
5. Validate every CMS response before passing it to React components.
6. Keep GROQ queries and Sanity-specific data mapping inside `src/lib/cms/`.
7. Components should consume project-owned domain objects rather than raw Sanity documents.
8. Keep preview tokens on the server and protect preview deployments.
9. Use a signed webhook to trigger a Vercel rebuild after publication.
10. Reject stale or invalid webhook signatures and do not log the secret or complete payload.
11. Make Preview and Studio non-indexable.
12. Export and restore-test CMS content on a documented schedule.

## Publishing flow

```text
Administrator edits draft in Sanity Studio
  -> validation passes
  -> administrator previews the staging deployment
  -> administrator publishes
  -> signed webhook triggers a Vercel build
  -> build reads published content
  -> automated tests run
  -> new static deployment becomes active
```

A failed build must leave the previous working Vercel deployment active.

## Required decisions before implementation

- Confirm that 1–3 administrators actually need browser-based content editing.
- Confirm who owns the Sanity organization and billing relationship.
- Confirm primary language and whether English is maintained independently.
- Confirm legal company data and final domain.
- Decide which administrators may publish directly and which may only edit drafts.
- Decide content backup and retention requirements.

Until these decisions and account access exist, the static repository content remains the safer production implementation.
