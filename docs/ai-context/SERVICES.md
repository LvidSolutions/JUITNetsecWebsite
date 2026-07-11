# Services Page Context

Read `MASTER.md` first. The Services page is the current highest priority.

## Existing page areas

- hero
- three-column selector
- square process/workflow feature
- service sections
- partner strip
- CTA
- footer

Do not modify unrelated areas while working on one component.

## Three-column selector

Columns:

1. Managed IT Operations
2. Cybersecurity
3. Control Plane & Governance

### Required videos

- Managed IT Operations: `cosmos_1992624789.mp4`
- Cybersecurity: `cosmos_1032118682.mp4`
- Control Plane & Governance: `cosmos_93407076 (1).mp4`

Reference recordings from the prior session:

- pixel reveal: `20260711-1213-05.2679116.mp4`
- current selector: `20260711-1216-38.3269825.mp4`

These files must be available as repository assets or otherwise explicitly supplied to the coding agent. Do not search local Downloads folders on the current laptop. Report missing files before implementing substitutions.

### Default state

When no column is hovered:

- video is genuinely block-pixelated, not merely blurred
- approximately 12–30 visible blocks across each column width
- text remains identifiable
- no full green overlay
- no glow

### Hover state

- a radial reveal originates at the pointer position
- the reveal follows the pointer
- video becomes sharp only inside the field
- pixelation resolves locally
- edges are soft and feathered
- text and video clarify together
- default tint/inversion is neutralized inside the field
- the entire column must not sharpen at once

On mouse leave, the reveal contracts or fades and pixelation returns smoothly without snapping, flashing, or blinking.

### Technical priority

1. Low-resolution canvas plus radial mask
2. WebGL shader only if the existing stack clearly supports it
3. Two video layers plus pixelated canvas/CSS mask

Use refs, CSS variables, `requestAnimationFrame`, and `IntersectionObserver`. Do not update React state on every `mousemove`. Avoid large dependencies.

### Responsive behavior

Desktop: full pointer-controlled reveal.

Tablet: pointer behavior when available, tap fallback otherwise.

Mobile: tap activates one column; other columns return to pixelated state; no horizontal overflow.

Reduced motion: static pixelated poster/fallback with a quick simple mask or opacity transition.

## Services color harmonization

Before implementing the selector effect:

- use existing design tokens
- use the exact JUIT logo green accent
- remove divergent milky or translucent green tones
- add no glow, neon, or new colors
- do not change typography, copy, or layout during this stage

## Required staged workflow

### Stage 1

Harmonize Services page colors. Validate with Playwright. Pause and report.

### Stage 2

Place the correct video in each column and implement coarse pixelated default state. Validate and pause.

### Stage 3

Implement radial pointer-controlled pixel reveal. Validate and pause.

### Stage 4

Refine text reveal and active-column behavior. Validate and pause.

### Stage 5

Complete responsive behavior, touch fallback, reduced-motion support, and performance validation. Final validation.

## Square process feature

Keep the square structure; never replace it with a ring.

Four nested layers:

1. Discover
2. Map
3. Secure
4. Operate

Use only safe, verified service copy.

### Hover progression

- hover layer 1: activate outer layer; separators remain
- hover layer 2: activate layers 1–2; separators remain
- hover layer 3: activate layers 1–3; separators remain
- hover center/layer 4: activate all layers, animate inner lines away, and produce one solid square using the exact logo green

No glow, gradient, or transparency in the fully active state.

When moving outward, reverse deliberately: lines return, then center deactivates, then layer 3, layer 2, and layer 1.

Additional direction:

- larger centered square
- compact right-side text field
- animated technical connector line
- short upper-left text field
- subtle lower-left binary scrambling
- no Matrix rain
- no glow

## Contact page note

The Contact page follows the SOHub-inspired direction: large editorial CONTACT typography, full-bleed feeling, floating video, generous whitespace, and a soft integrated form panel. Do not change form submit logic, validation, floating video, or unrelated sections during layout fixes.
