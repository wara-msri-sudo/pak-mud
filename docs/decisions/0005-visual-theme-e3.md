# 0005. Visual theme: palette E3 · Slate-led

- Status: accepted
- Date: 2026-11-03
- Decided by: project owner (wara-msri-sudo)

## Context
The first screens used a placeholder teal theme. Before more screens arrive (pins, plan, budget), the owner chose
a palette on the design canvas (https://claude.ai/artifact/WGPYD93v5rr9pg61nBnstQ, board "Palette E3 · Slate-led").

## Options considered
- Keep the placeholder teal theme: no work, but it doesn't match the designs.
- E3 · Slate-led: a cool off-white page, a slate header band and buttons, and tan only as a small warm highlight.

## Decision
E3 · Slate-led. Tokens live only in `src/app/globals.css` (light, plus dark via `prefers-color-scheme`), mapped to
Tailwind colours through `@theme inline`. Usage rules:
1. A slate header band (`AppHeader`) sits at the top of every page: the logo, plus an optional title, subtitle, back link and action.
2. There is one filled primary action per area: tan (`.button-band`) on the band, slate (`.button-primary`) on the page.
3. Tan appears only on the band CTA and logo (and later badges and the active-tab underline). It is never used as text on a light background.
4. Links use the accent colour with an underline (`.link`). Cards (`.card`) use the card colour, a 1px border and radius 12.
   Controls use radius 10 and are at least 44px tall.
5. The home page uses a slim band (logo only) with the hero on the page (owner's choice).

Not added yet: `track`, `soft`, `selected-*` and pin category colours. They arrive with the screens that use them
(Slice 2 and later). Food, shopping and stay category colours still need choosing.

## Consequences
- `src/app/theme.test.ts` checks every text/background pair in both themes against WCAG AA (4.5:1, or 3:1
  for the logo and focus ring), checks that light and dark define the same tokens, and fails if any hex colour appears outside `globals.css`.
- New colours must be added to `globals.css` and to the pair list in the test.
