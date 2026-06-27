# Session Handover — Footer Responsiveness & Flyward-style Frame-out

> **FOR CODEX (continue this work).**
>
> ⚠️ **Work on GitHub only — do NOT clone/run this repo locally, and do NOT
> spin up the dev server or Playwright. Edit files directly in the GitHub repo
> to save tokens.** All the reference data you need (measured Flyward values,
> exact CSS variables) is in this file so you don't have to re-derive anything.

---

## Repo / branch
- GitHub: `LvidSolutions/JUITNetsecWebsite`
- **Active/live branch: `merge`** (the live site runs from here — be careful).
- This handover + the in-progress footer work are committed on `merge`.

## The task (from the user)
Make the footer composition stay visually correct on **every monitor size**, and
make the white-margin "frame-out" match **Flyward** (https://flyward.com/):
1. Full-bleed oversized JUIT NetSec logo anchored + cropped at the bottom.
2. Proportionally scaled **maze** graphic (upper-left). *(call it "maze", not radar)*
3. Proportionally scaled **dashboard** graphic / stats panel (upper-right).
4. White frame margins in **Flyward's proportions**, responsive (same % on any format).
5. Balanced spacing; no huge empty middle on large monitors.
6. **Animation must match Flyward: the footer stays "connected" (full-bleed) while
   scrolling and the white margins snap in as ONE motion on the last scroll tick** —
   NOT the old gradual 6-stage staggered parallax.

## Reference data (already measured from `Flyward footer.mp4` — do not re-analyze)
The video is a side-by-side of Flyward (start) vs JUIT contact-page footer. Measured
on the framed state (video 1904×914):
- **Flyward margins:** sides ≈ **2.7%** of width, bottom ≈ **4–5.5%** of height,
  top ≈ **~3%** (its navbar sits inside the frame). Per-axis, NOT uniform.
- **Flyward animation:** connected → frame-out animates in over ~0.6–0.7s (≈ one
  scroll tick) on reaching the bottom; then stays framed.
- Old JUIT (for contrast): sides ~2.3%, bottom ~2.6%, and a slow scroll-linked reveal.

## What was done this session (committed)
Only two files changed for the footer: **`src/components/layout/Footer.jsx`** and
**`src/styles/index.css`**.

1. **Frame margins → Flyward proportions, responsive per-axis** (`.footer-frame`):
   ```css
   --footer-frame-x: clamp(20px, 2.7vw, 104px);   /* sides  ~2.7% of width  */
   --footer-frame-top: clamp(16px, 3vh, 54px);    /* top    ~3% of height   */
   --footer-frame-bottom: clamp(22px, 4vh, 76px); /* bottom ~4% of height   */
   padding: calc(var(--ff,0)*top) calc(var(--ff,0)*x) calc(var(--ff,0)*bottom);
   ```
2. **Animation rewritten to one-motion frame-out** (Footer.jsx):
   - Removed framer-motion + the 6 staggered transforms (footerY/radarY/statsY/logoY/navY/bg/noise).
   - `framed` boolean state, set on scroll with **hysteresis** (frame when within 64px
     of page bottom, un-frame past 180px) to avoid flicker from the padding height change.
   - `--ff` = `framed ? 1 : 0`; the motion itself is a CSS `transition: padding 0.62s`
     on `.footer-frame`. Reduced-motion → instant (global rule).
3. **Maze + dashboard responsive scaling** (`@media (min-width:1024px) .footer-stage`):
   ```css
   --maze-w: clamp(232px, min(17.5vw, 30vh), 384px);   /* vw+vh aware        */
   --dash-w: clamp(504px, min(34vw, 58vh), 760px);
   --half:   clamp(520px, 33vw, 690px);                /* half cluster width */
   --edge:   max(var(--footer-frame-x,44px), calc(50% - var(--half)));
   min-height: min(calc(100svh - 96px), clamp(740px, 80svh, 1080px)); /* cap empty space */
   ```
   - Maze positioned `left: var(--edge)`, dashboard `right: var(--edge)` → pulled toward
     centre on wide screens, separated on narrow. Sizes via `lg:w-[var(--maze-w)]` /
     `lg:w-[var(--dash-w)]` in Footer.jsx.
4. **Full-bleed logo** (`.footer-floor-wordmark`, lg): `font-size: clamp(4rem, min(15.5vw, 33vh), 30rem)`
   (grows on large screens, capped by vh on short screens), `translateY(26%)` crop, kept centered.
5. Renamed classes for clarity: `footer-pos-radar→footer-pos-maze`,
   `footer-pos-stats→footer-pos-dashboard`, `footer-radar-graphic→footer-maze-graphic`.
   (Asset filename stays `/assets/footer-radar.png` — do not rename the asset.)

## Verified margins after changes (live, via Playwright before handoff)
| viewport | sides | bottom | notes |
|---|---|---|---|
| 1440×900 | 2.7% | 3.8% | ✅ |
| 1920×1080 | 2.7% | 3.85% | ✅ |
| 2560×1440 | 2.7% | 3.88% | ✅ |
| 3440×1440 | 2.7% | 3.88% | ✅ |
| **1366×768** | **0%** | **0%** | ❌ frame-out did NOT trigger — see open items |

## Open items / next steps (in priority order)
1. **1366×768 frame-out doesn't engage** (measured 0% margins). Likely the
   scroll-distance/hysteresis edge case when the footer is shorter than the viewport
   on short screens. Fix the `framed` trigger in `Footer.jsx` (the `update()` in the
   `useEffect`) so it reliably frames at the bottom on short viewports too.
2. **Confirm the top composition.** Because `min-height` is capped, on tall monitors
   the footer card sits at the bottom with the previous section visible above the top
   white margin. Flyward instead fills the framed viewport. Decide with the user whether
   to keep the cap (less empty middle) or fill the viewport like Flyward.
3. **Verify the one-tick animation feel** matches Flyward (connected → single 0.62s
   frame-out on last tick). Tune the `0.62s` duration / hysteresis thresholds if needed.
4. Re-check **1366 / 1440 / 1920 / 2560 / ultrawide** after fixes; ensure no maze/dashboard
   overlap on narrow and no excessive gap on wide.
5. Build (`npm run build` — but per the instruction, prefer relying on review; ask the
   user to run it / view the site since you're GitHub-only).

## Where to find things
- Footer component: `src/components/layout/Footer.jsx`
- Stats/dashboard panel: `src/components/layout/FooterStatsPanel.jsx` (content — do NOT change)
- Footer CSS: `src/styles/index.css` — search for `.footer-frame`, `.footer-stage`,
  `.footer-pos-maze`, `.footer-pos-dashboard`, `.footer-pos-nav`, `.footer-floor-wordmark`,
  `.footer-glow` (flat `#181818` background), `.footer-noise` (static animation — keep).
- Footer is rendered globally in `src/App.jsx`.
- **Local-only (NOT available to you on GitHub):** the reference `Flyward footer.mp4`
  is in the user's Downloads; Playwright QA scripts + extracted frames live in the
  local scratchpad. Everything you need from them is summarised above.

## Do NOT modify
Navbar, Hero, Services page, About, Contact, partner strip, footer **content/links**,
maze/dashboard **assets**, typography. Only footer layout / frame-margin sizing /
maze + dashboard scaling+positioning / bottom-logo scaling+positioning.

> Note: there are also unrelated **uncommitted local** changes to the Services page
> (`NetsecOperatingModel.jsx`, `ShiftStyleServiceSelector.jsx`, `servicesData.js`, plus
> a `.service-static` utility in `index.css`) from a separate task — they were NOT part
> of this footer handoff. Leave them alone.

## Final report Codex should deliver
Files modified · the CSS variables/formulas for frame margins, maze, dashboard, logo ·
screenshots (or the user's confirmation) at 1366 / 1440 / 1920 / 2560 / ultrawide ·
measured final margin % vs Flyward's % · any remaining visual differences.
