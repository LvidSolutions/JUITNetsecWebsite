# Footer Context

Read `MASTER.md` first.

The footer is inspired by Flyward and Shinkei while remaining original to JUIT NetSec.

## Required content

- maze graphic, never call it radar
- dashboard/stat graphic
- large JUIT NetSec floor logo
- static/noise background
- full-bleed-to-framed scroll animation
- white margins in the final state

## Flyward-style framing behavior

Reference: `https://www.flyward.com/`

1. Footer begins full-bleed.
2. During the final scroll movement it scales inward.
3. White margins appear around it.
4. Frame-out should complete in approximately one mouse-wheel tick.
5. Top, side, and bottom margins must be measured as viewport-relative proportions rather than arbitrary fixed pixels.
6. The final state must remain balanced across screen sizes.

## Static/noise

Reuse the same Shift5-inspired static/noise animation used on the Services page.

Requirements:

- subtle but visible
- no extra green glow
- no new color
- no heavy television snow
- content remains readable
- reduced motion is respected

## Responsive requirements

Across monitor sizes, preserve:

- full-bleed bottom logo
- proportionally scaled maze graphic
- proportionally scaled dashboard graphic
- proportional white margins
- balanced spacing between graphics

Do not replace the maze graphic with a radar motif. Do not change unrelated footer copy or navigation unless explicitly requested.
