# Codex Session Handover — JUIT NetSec Website

> **READ THIS FIRST. Do NOT bulk-load the codebase.**
> When you start a new prompt, **do not** open or index every file, and **do not** pull
> the whole project into context. Instead:
>
> 1. Read **this file** (`CODEX_HANDOVER.md`) — it contains everything you need.
> 2. Check the **GitHub repo** for current state:
>    `https://github.com/LvidSolutions/JUITNetsecWebsite` (live branch: **`merge`**).
> 3. Only open the **2 files named in "Pending task"** when you are actually ready to edit.
> 4. Ask before reading anything else. Stay scoped — this is a tiny, surgical footer fix.

---

## Repo facts

| | |
|---|---|
| **Remote** | `https://github.com/LvidSolutions/JUITNetsecWebsite.git` |
| **Live branch** | `merge` (NOT `main` — deploy/push here) |
| **Local path** | `C:\Users\lucas\Downloads\Repos\LVID\JUITNetsecWebsite` |
| **Stack** | React + Vite 7 + Tailwind + framer-motion, Node v24 |
| **Dev server** | `npm run dev` → http://localhost:5173 |
| **Footer is global** | Rendered once in `App.jsx`; shared by all pages |

Verified contact data (do NOT invent): email `info@juitnetsec.se`,
address `Fatburs kvarngata 26 / 118 64 Stockholm / Sweden`.
Brand colors: green `#00C853`, black `#050505`, mist `#E5E7EB`. Font: Space Grotesk.

---

## Current working-tree state (UNCOMMITTED)

```
 M src/components/layout/Footer.jsx     # footer reworked to use the 2 image assets
 M src/styles/index.css                 # .footer-glow retuned
?? public/assets/footer-radar.png       # maze/radar graphic (used)
?? public/assets/footer-stat.png        # threat-stats panel graphic (used)
?? public/assets/footer-source.png      # UNUSED original composite (~1.6MB) — candidate to delete
```

**What's already done (working tree, not yet committed):** the footer was rebuilt into a
shorter "cinematic strip" (~660px desktop, no `min-h-screen`) showing `footer-radar.png`
upper-left and `footer-stat.png` upper-right (both via `mix-blend-screen`), brand wordmark
lower-left, nav + contact lower-right. Validated on desktop/tablet/mobile.

---

## Pending task (APPROVED, NOT yet implemented)

**Problem:** both footer graphics show a visible **rectangular box** around them.
**Root cause (confirmed by inspecting the pixels):** the PNGs do not have a *black*
background — they have a baked **dark-green** background. `mix-blend-mode: screen` only
hides a *pure-black* background, so the green background gets *added* over the footer as a
rectangle (radar = square vignette corners; stats = dark green card edge).

**Fix (CSS-only, do NOT edit the PNG files):** replace `mix-blend-mode: screen` with a
**luminance-to-alpha SVG filter** so each pixel's alpha = its luminance. The dark-green
background → alpha ≈ 0 (truly gone, no rectangle on any background); bright radar lines and
white stat numbers → alpha ≈ 1 (stay crisp).

### File 1 — `src/styles/index.css` (add these utilities; leave `.footer-glow`/`.footer-noise` alone)

```css
.footer-cutout {
  filter: url(#footerCutout);
}
.footer-radar-graphic {
  -webkit-mask-image: radial-gradient(circle at 50% 50%, #000 74%, transparent 100%);
  mask-image: radial-gradient(circle at 50% 50%, #000 74%, transparent 100%);
}
```

### File 2 — `src/components/layout/Footer.jsx`

- Add the filter def once, hidden, inside `<footer>`:

```jsx
<svg aria-hidden="true" focusable="false" width="0" height="0"
     style={{ position: 'absolute', width: 0, height: 0 }}>
  <filter id="footerCutout" colorInterpolationFilters="sRGB">
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0.33 0.5 0.16 0 0" />
    <feComponentTransfer>
      <feFuncA type="table" tableValues="0 0.05 0.55 0.9 1 1" />
    </feComponentTransfer>
  </filter>
</svg>
```

- Radar `<img>`: change `mix-blend-screen` → `footer-cutout footer-radar-graphic`.
- Stats `<img>`: change `mix-blend-screen` → `footer-cutout`.
- **Nothing else changes** — same layout, sizes, spacing, `lg:min-h-[660px]`, wordmark,
  nav, contact, alt text.

### Tuning levers (decide from screenshots)

- Content too dim → raise mids: `tableValues="0 0.1 0.7 1 1 1"`.
- Faint rectangle still showing (esp. stats' bottom green glow) → flatten low end:
  `tableValues="0 0 0.4 0.85 1 1"`.
- Radar corner haze → the `footer-radar-graphic` radial mask is the backstop.

### Fallback (only if the runtime filter looks bad)

Pre-bake the same luminance→alpha into transparent PNGs with a one-off `sharp` script
(`footer-radar-cut.png` / `footer-stat-cut.png`) and repoint `src`. Not expected.

---

## Do NOT modify

Footer layout/height, logo/nav/contact placement, text content, navbar, hero, intro
animation, cursor, contact form, FaultyTerminal, services/about, global typography.
Only touch: image rendering classes + the two footer-graphic CSS rules above.

---

## Verify (Playwright)

There is a ready script: `scratchpad/shot-footer.js` (run `node shot-footer.js after`).
It uses cached Chromium and screenshots the footer at **1440 / 834 / 390** into
`visual-checks/footer/`. (Install `playwright-core` with
`PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install --no-save playwright-core`, then
`npm uninstall --no-save playwright-core` when done.)

Acceptance: no square around the radar, no rectangle around the stats panel, radar lines +
all stat figures readable, footer height still ~660px desktop, layout unchanged, zero
console errors. Test desktop + tablet + mobile.

---

## After it works

Ask the user before committing. Suggested: also delete the unused
`public/assets/footer-source.png` (~1.6MB). Commit + push to **`merge`** only when asked.
Commit message footer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` if Claude
authored; otherwise per Codex convention.
