# Homepage Context

Read `MASTER.md` first.

## Existing homepage elements

- hero background video
- large logo animation
- navbar
- custom cursor
- scroll interactions
- rolling partner-logo strip

Do not alter hero design, text, CTA, overlay, or layout when fixing video playback.

## Hero video ping-pong playback

Required behavior:

1. Play forward for approximately six seconds.
2. Immediately play the same video backward at the same perceived frame rate.
3. At the beginning, play forward again.
4. Repeat without a visible cut.

There must be no jump to the first frame, black frame, flash, pause, or native loop discontinuity.

If negative `playbackRate` is not stable in target browsers, use a `requestAnimationFrame`-controlled ping-pong implementation. Keep work isolated to the playback behavior.

## Rolling partner logos

Required logos:

- VMware
- Veeam
- Dell Technologies
- Trend Micro
- Microsoft
- Smart Cloud Solutions
- Microsoft Azure
- AWS

Use correct official SVG or transparent assets.

The Smart Cloud Solutions logo must be clickable, open the company's verified official website in a new tab, and use:

- `target="_blank"`
- `rel="noopener noreferrer"`

Do not implement an unverified URL. Report the missing verification instead.

## About page note

The About page should follow an editorial structure inspired by Gustaf Furusten's About page while preserving JUIT NetSec's own branding, copy, and assets.
