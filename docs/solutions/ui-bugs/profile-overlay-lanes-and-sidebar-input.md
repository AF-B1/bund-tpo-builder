---
module: full-profile
tags: [initial-balance, layout, overflow, custom-open-price, event-listeners]
problem_type: ui_bug
track: bug
date: 2026-07-13
symptoms: [ibr-bar-invisible, wide-gap-between-columns, duplicate-enter-handler]
---

# Full profile overlays clipped; layout gaps; sidebar input listeners

## Symptoms

1. **Initial Balance orange bar** calculated correctly but **not visible** in column 3.
2. **Large empty gap** between split builder and full profile when side-by-side.
3. After **reset**, open-price **Enter** could fire multiple times (stacked listeners).

## What didn't work

- **Negative `left` CSS** (`left: -14px`) for IB bar and close marker — parent `overflow: auto` clipped overlays.
- **Flex grow on split panel** (`flex: 1 1 auto`) — grid is `max-content` wide but panel stretched full width, pushing profile far right.
- **`addEventListener` on every render** for price input without guard — duplicate handlers after `R` reset.

## Solution

### Overlay lanes (not negative positioning)

```text
[ left lane: IB bar ] [ letters ] [ right lane: close ▶ ]
```

Flex row inside `.full-profile-wrap`; each lane `position: relative`, overlays at `left: 0` inside lane.

### Three-column workspace

```text
Col1 sidebar | Col2 builder (flex 0 0 auto) | Col3 profile (flex 0 0 auto)
```

Session progress + tutorial live only in col 1; builder and profile get **full height**.

### Price input mode (v1.1)

- Empty grid → sidebar shows price input (decimal required, e.g. `125.50`)
- `state.startPrice` drives ladder via `priceAtTickIndex(tick, state.startPrice)`
- `data-bound="true"` on input before attaching `keydown` listener

## Why this works

Overlays stay inside scroll containers. Columns pack to content width. Listener guard survives re-render on reset.

## Prevention

- Never position teaching markers outside flex lanes with `overflow: auto` parents
- Use `hasPrints(state)` for sidebar mode switching
- Guard DOM listeners when re-rendering innerHTML

## Related files

- `src/render/full-profile.js`
- `src/styles/app.css` (`.full-profile-lane`, `.ibr-bar`)
- `src/main.js` (`bindStartPriceInput`)
- `src/state.js` (`applyStartPrice`, `hasPrints`)