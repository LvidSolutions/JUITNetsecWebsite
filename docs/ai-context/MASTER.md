# JUIT NetSec Website — Global AI Instructions

## Repository and scope

Work only in:

`https://github.com/LvidSolutions/JUITNetsecWebsite`

Do not access, inspect, or modify unrelated local folders or files on the current laptop.

Before editing, identify the smallest possible file set. Inspect only the relevant component, page, styles, and direct imports. Do not perform a repository-wide analysis for a component-level task. Never create duplicate project folders or clone the repository into another location.

Work in a dedicated feature branch. Never commit directly to `main`.

## Product positioning

JUIT NetSec AB is a Swedish IT and cybersecurity consultancy. The website should feel premium, boutique, senior, editorial, technical, minimalist, and confident.

It must not feel like a generic SaaS template, startup theme, standard Webflow template, ordinary IT support company, or corporate-blue IT brand.

Verified positioning only:

- IT Infrastructure
- Network & Secure Communication
- Cybersecurity
- IT Operations
- Technical Advisory
- IT Management

Do not invent official partnerships, certifications, SOC, MDR, penetration testing, awards, customer counts, case studies, or guaranteed results.

## Visual identity

Use black, white, and the exact green accent from the JUIT NetSec logo square.

Do not add neon, extra green glow, unrequested colors, milky translucent green backgrounds, or unrelated design changes.

Unless explicitly requested, preserve:

- spacing
- typography
- animations
- iconography
- copy
- layout hierarchy
- component sizing

Prefer existing design tokens. Do not introduce duplicate colors, spacing variables, or utility classes.

## Typography

The typography should feel condensed, grotesk, editorial, technical, tightly controlled, and uppercase where appropriate. Avoid rounded startup typography, generic SaaS typography, and oversized clumsy headings.

Do not change the global typography in animation-only or layout-only tasks.

## Main references

- HackFirst: hero, navbar, typography, spacing, editorial layout, scroll storytelling
- Shift5: Services selector, static/noise animation, technical interactions, flat hover states
- Flyward: footer reveal and full-bleed-to-inset framing
- SOHub contact page: full-bleed contact typography, soft panels, editorial whitespace, floating video
- Gustaf Furusten about page: editorial About structure
- ChainGPT Labs: premium cursor and interaction inspiration

Use references for behavior, proportion, and direction only. Do not copy branding, text, or proprietary assets.

## Addresses

Replace every physical street address, postal code, suite, or placeholder address with exactly:

`Stockholm, Sweden`

Keep company names, email addresses, and phone numbers. Multi-line addresses become one line.

## Engineering rules

- Prefer extending existing components and motion utilities.
- Never replace an existing animation system unless explicitly requested.
- Avoid parallel duplicate implementations.
- Avoid unnecessary React renders and layout thrashing.
- Keep pointer interactions smooth and target 60 FPS on desktop.
- Use semantic HTML and preserve keyboard navigation.
- Respect `prefers-reduced-motion`.
- Maintain sufficient color contrast.
- Do not add a large dependency unless absolutely necessary.
- Do not refactor shared utilities unless the requested feature requires it.

For video elements, prefer `autoplay`, `muted`, `playsInline`, and efficient loading. Pause off-screen video with `IntersectionObserver` where appropriate.

## Assets

Never create placeholder assets, replace official logos, or AI-upscale assets. Report missing required assets instead of silently substituting them.

Use correct official SVG or transparent assets for partner logos. Never implement an unverified external company URL.

## Protected areas

Unless a task explicitly concerns them, do not modify:

- navbar
- hero
- intro
- custom cursor
- company badge
- FaultyTerminal
- footer
- Contact form submit logic or validation
- global typography
- unrelated page layouts
- unrelated animation systems
- company copy

## Playwright validation

Use Playwright for visual validation.

Common desktop viewports:

- 1366 × 768
- 1440 × 900
- 1920 × 1080
- 2560 × 1440

Also validate tablet and mobile for responsive features.

For large features, implement and validate in explicit stages. Capture screenshots, report visual differences, and pause when the task says to pause. Do not continue past a visually broken stage.

## Completion criteria

A task is complete only when:

- the project builds successfully
- relevant lint/type checks pass
- Playwright validation is complete
- responsive behavior has been checked where applicable
- reduced-motion behavior has been checked where applicable
- no unrelated files were modified

## Final report

Always include:

1. Files modified
2. Reason for each modification
3. Performance impact
4. Accessibility impact
5. Responsive impact
6. Playwright screenshots or validation summary
7. Remaining known issues
8. Suggested next prompt
