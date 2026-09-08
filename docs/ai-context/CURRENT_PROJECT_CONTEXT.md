# JUIT NetSec — shared project context

Last verified: 2026-09-08 (Europe/Stockholm)

This file is the current handoff for people and coding agents working on the JUIT NetSec website. Read it together with `MASTER.md`; for page-specific work also read `HOMEPAGE.md` or `SERVICES.md`. If this snapshot conflicts with live Git, Vercel, DNS, or source code, verify the live state and update this file.

## Source of truth

- Repository: `https://github.com/LvidSolutions/JUITNetsecWebsite`
- Production branch: `merge`
- Current production commit at this snapshot: `17065b2d5afebcfd0bf975e3d8581bc0634b525f`
- Vercel project alias: `https://juit-netsec-website.vercel.app`
- GitHub deployment for `17065b2`: Production, success, completed 2026-09-08 14:44:30 UTC
- The Vercel project alias serves the bundle built from the integrated `merge` worktree.
- `juit.se` is not connected to this Vercel website. Its DNS currently resolves to `85.226.163.157` and HTTPS redirects to Microsoft Exchange/OWA. Do not change this DNS without preserving mail-related records and receiving explicit authorization for a domain migration.
- Vercel may display a stable project alias and a deployment-specific URL for the same deployment. Those URLs do not imply different source branches.

All completed visual work is in `merge`. The Scroll Craft About demo is the real About implementation in this branch, available through both `/about` and `/om-oss`.

## Integrated work

Two isolated branches were merged into `merge`:

- `codex/home-services-polish`: Home TV transition, Services hero, Operating model, responsive and reduced-motion improvements.
- `codex/about-scrollcraft-demo`: new editorial About page and interactive expertise section.

Important commits:

- `bcca433` — centered and refined Operating model using the Shift5 reference.
- `ddaec89` — kept the monitor character visible and aligned the scroll handoff.
- `952e7a4` — separated Services typography from media and respected reduced motion.
- `3092f1a` — showed Home content without video takeover for reduced motion.
- `9c5fa7d` — kept the Services canvas animating without `requestVideoFrameCallback`.
- `9a317ae` — tightened Services hero spacing on portrait tablets.
- `73a185f` — shortened the locked portion of the monitor transition.
- `4e9c509` — created the editorial About page with interactive expertise.
- `69893fe` and `17065b2` — merge commits that integrated both branches into `merge`.

## Product and visual direction

JUIT NetSec AB is presented as a Swedish IT and cybersecurity consultancy. Verified areas are IT infrastructure, network and secure communication, cybersecurity, IT operations, technical advisory, and IT management.

The design should feel premium, boutique, senior, editorial, technical, minimalist, and confident. Use black, white, and the exact JUIT green (`#00C853`). Avoid generic SaaS styling, corporate blue, extra neon, glow-heavy decoration, invented certifications, invented partnerships, case studies, customer numbers, or guaranteed outcomes.

Reference direction:

- HackFirst: hero, navigation, typography, spacing, editorial scroll storytelling.
- Shift5: Services interaction language and the Operating model composition. Keep JUIT's nested squares; do not replace them with rings.
- Flyward: footer reveal and framing.
- SOHub: Contact page composition.
- Gustaf Furusten: editorial About structure.
- Scroll Craft: deliberate page grammar, layered composition, restrained motion, distinct mobile composition, and visual verification across scroll states.

Use references for proportion and behavior only. Do not copy their branding, text, or proprietary assets.

## Application architecture

- React 19, Vite 7, Tailwind CSS 3, Framer Motion 12, OGL, Node.js 24.
- Vercel Functions in `api/`.
- Resend for contact email, Cloudflare Turnstile for bot protection, and Upstash Redis for rate limiting.
- No public authentication, payment system, file upload, CMS, or application database is currently required.
- Routes: `/`, `/tjanster`, `/om-oss`, `/about`, `/kontakt`, and `/contact`.
- Shared layout: `src/components/layout/`.
- Main page sections: `src/components/sections/`.
- Services-specific components: `src/components/services/`.
- Global styles: `src/styles/index.css`.
- Deployment rules: `vercel.json` and `docs/BACKEND_DEPLOYMENT.md`.

Never place credentials, tokens, downloaded Vercel environment files, or real secret values in Git or in this document.

## Current Home implementation

Key files:

- `src/components/layout/AnimatedLogo.jsx`
- `src/components/sections/HeroTransitionScene.jsx`
- `src/components/sections/HeroTransitionScene.css`
- `src/components/sections/StatsSection.jsx`
- `src/components/sections/StatsSection.css`
- `src/components/sections/ContactMonitorCTA.jsx`

Behavior:

- The large JUIT wordmark moves into the navbar as the opening hero scrolls.
- Its measured center matches the navbar target at desktop, tablet, and mobile sizes.
- After the logo docks and the visitor scrolls further, the monitor video starts.
- The clip is six seconds in source metadata and now plays at `1.2` speed.
- Scroll is locked only during the visible `PLAYING` phase, not during decoder preparation.
- The final green `C` remains visible while the monitor expands and lands on the first letter of the following “Cyber” section.
- Forward scroll, reverse scroll, video failure fallback, first-load timing, and reduced motion have dedicated handling.
- With reduced motion, the transition video stays paused and the following content is available in normal page flow.

The visual flow was checked at 1440×900, 768×1024, and 390×844. At the final pre-handoff measurement, horizontal C alignment differed by at most 0.008 px and vertical alignment by approximately 3–3.41 px because the measurement was taken three scroll pixels before the endpoint.

## Current Services implementation

Key files:

- `src/components/services/GlideServicesHero.jsx`
- `src/components/services/ShiftStyleServiceSelector.jsx`
- `src/components/services/PixelatedServiceVideo.jsx`
- `src/components/services/NetsecOperatingModel.jsx`
- `src/components/services/NetsecOperatingModel.css`
- `src/components/services/servicesData.js`
- `src/styles/index.css`

Services hero:

- The heading and supporting text occupy a separate readable region above the media.
- Desktop uses one hidden video decoder and one canvas to draw the five visual panels.
- The canvas uses `requestVideoFrameCallback` where available and a `requestAnimationFrame` fallback elsewhere.
- Painting and video playback stop off-screen and resume on re-entry.
- Reduced motion pauses video playback.
- Portrait-tablet spacing is tightened only between 768 and 1023 px.

Operating model:

- Keep the four nested square layers: Discover, Map, Secure, Operate.
- The composition is centered with a compact intro/readout on the left and the active detail on the right.
- Pointer, click/tap, Enter, Space, and arrow-key interactions are supported.
- Selection persists, exposes `aria-pressed`, and synchronizes the active text.
- Progressive green fill keeps the square separators; the final active state forms one solid square without glow or gradient.
- Responsive and reduced-motion layouts remain centered and readable.

## Current About implementation

Key files:

- `src/components/sections/AboutSection.jsx`
- `src/components/sections/AboutDemo.css`

This is the real About page in `merge`, not a separate production demo. It replaces the prior About composition.

- Editorial hero: “Built for real operations.”
- Uses existing repository images and verified service language.
- Includes restrained image parallax, technical details, a five-item expertise accordion, principles, and a contact close.
- Accordion controls use native buttons with `aria-expanded` and linked panels.
- The layout has been checked on desktop, mobile, reduced motion, 768×1024, and 1024×768.
- No new generated assets, dependencies, certifications, partnerships, or unsupported company claims were added.

## Current Contact and backend boundaries

The Contact page follows the existing editorial direction. Do not change form submission, validation, Turnstile, rate limiting, email delivery, or environment handling during unrelated visual work.

Before enabling or changing production contact behavior, read `docs/BACKEND_DEPLOYMENT.md`, verify required environment variables in Vercel, test Preview delivery, and keep visitor content and secrets out of logs.

## Verification status

Verified on the integrated `merge` state:

- `npm run build`: passes.
- Unit tests on 2026-09-08: 52 of 56 pass.
- Targeted Playwright checks passed for Home, Services, Operating model, and About across the relevant desktop, tablet, mobile, and reduced-motion states described above.
- The permanent Vercel project alias returns HTTP 200 and serves the integrated production bundle.

Four unit-test failures remain in `test/vercel-config.test.js`:

1. Missing `/robots.txt` rewrite to `/api/robots`.
2. Missing expected HSTS configuration in `vercel.json`.
3. Missing report-only Content Security Policy.
4. Missing API `no-store` and `noindex` headers.

These failures predate the visual changes; neither `vercel.json` nor the tests were changed by the visual branches. Treat them as real unresolved configuration work, not as passing checks. The source-lint script also flags its own prohibited-token rule strings, so do not report the full `npm run check` chain as passing.

Remaining validation limitations:

- No physical iPhone or Android device has been tested.
- No complete cross-browser engine pass or measured FPS profile has been performed.
- `juit.se` is not the Vercel website domain.

## Working rules for the next context

1. Fetch `origin/merge` and verify the exact worktree, branch, remote, and status before editing.
2. Treat `merge` as the only current integrated truth. Create a focused feature branch for new work.
3. Inspect the smallest relevant file set and preserve unrelated copy, layout, animations, backend logic, and assets.
4. Use the exact logo green and existing tokens. Preserve the current typography unless typography is explicitly in scope.
5. Keep videos efficient, pause off-screen media, avoid React state on pointer-move loops, and respect reduced motion.
6. Validate visual changes with Playwright at relevant desktop, tablet, mobile, and reduced-motion states.
7. Report builds, focused checks, known unit-test failures, and limitations separately and accurately.
8. Do not change DNS, Vercel environment variables, contact delivery, or production domains without explicit authorization and a rollback-safe plan.

## Model selection for future work

- GPT-6 Astra, Medium: cross-page planning, visual judgment, reference interpretation, difficult animation choreography, and final design review.
- GPT-5.6 Terra, Medium: focused React/CSS implementation, isolated animation fixes, and debugging with a defined target.
- GPT-5.4 Mini, Medium: routine repository searches, build/test execution, result collation, and concise handoff updates.

Use a fresh context window at a clear component boundary or when accumulated context becomes large. For a one-command check, keep the current context rather than paying the cost of reconstructing project state.

## Recommended next work

Highest-value technical follow-up: bring `vercel.json` into agreement with the four existing deployment/security tests, then run the full check chain and verify the production headers. Recommended model: GPT-5.6 Terra, Medium.

Highest-risk operational follow-up: decide whether `juit.se` should continue serving Exchange/OWA or become the website domain. Before any DNS change, inventory MX, SPF, DKIM, DMARC, autodiscover, and other mail records; confirm the registrar and authoritative DNS provider; add and verify the domain in the correct Vercel project; prepare rollback; then change only the required web records. Recommended model: GPT-6 Astra, High.

Suggested prompt:

> Read `docs/ai-context/MASTER.md` and `docs/ai-context/CURRENT_PROJECT_CONTEXT.md`. Verify `origin/merge` and the current deployment before acting. Work on one focused feature branch. Fix the four existing `vercel-config.test.js` failures without altering page visuals or contact-form behavior, run the full relevant checks, and report the exact headers and routes that changed. Do not modify DNS or Vercel secrets.
