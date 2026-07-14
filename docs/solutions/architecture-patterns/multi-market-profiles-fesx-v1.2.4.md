---
module: market-selector
date: 2026-07-14
problem_type: architecture_pattern
component: development_workflow
severity: medium
applies_when:
  - Adding a second futures instrument with different tick size and price format
  - Market switch must reset session without replaying welcome onboarding
tags:
  - multi-market
  - eurostoxx
  - fesx
  - market-profile
  - onboarding-trigger
  - visible-grid
repo: AF-B1/bund-tpo-builder
release: v1.2.4
---

# Multi-market profiles (Bund + EuroStoxx FESX)

## Context

v1 was Bund-only: `TICK_SIZE = 0.01`, decimal open prices (`125.50`), fixed `START_PRICE`. v1.2.4 adds a **market dropdown** so instructors can teach **Euro Stoxx 50 (FESX)** on EUREX alongside Bund without a separate app. FESX outright futures use **1 index point per tick** (EUREX spec since Mar 2022), so integer prices (`5012` → `5013`) replace two-decimal formatting.

Switching markets mid-session must **clear prints** and show the **open-price modal** — but **not** the first-visit welcome screen.

## Guidance

### 1. Market profile registry (`src/markets.js`)

Keep instrument-specific rules in one map, not scattered constants:

```text
{ id, label, cornerLabel, tickSize, defaultStartPrice, priceFormat, openHint, parseOpenPrice }
```

- **Bund:** `tickSize 0.01`, decimal regex, `formatPrice` → `toFixed(2)`
- **EuroStoxx:** `tickSize 1`, integer regex, `formatPrice` → rounded string

`state.marketId` drives parsing, ladder math, and display. `priceAtTickIndex(tick, startPrice, marketId)` uses the profile's `tickSize`.

### 2. Market switch without welcome

Add onboarding trigger `market-switch` in `src/onboarding.js`:

```javascript
if (openPriceTrigger === 'market-switch') return 'open';
```

Priority: `reset` → `market-switch` → `welcome` → `open`. First visit still gets welcome; instrument change always skips it.

`switchMarket(state, marketId)` in `src/state.js`:

- No-op if same market
- Else: set `marketId`, reset `startPrice` to profile default, clear grid/cursor/full profile, recompute `visibleTickStart`
- Caller sets `setOpenPriceTrigger('market-switch')` and re-renders

Wire dropdown in `src/main.js` with `data-bound="true"` on `.market-select` (same guard pattern as open-price input — see `docs/solutions/ui-bugs/profile-overlay-lanes-and-sidebar-input.md`).

### 3. Taller grid, open centered

- `VISIBLE_ROWS = 60` in `src/config.js`
- `computeInitialVisibleTickStart(openTickIndex)` places tick `0` at **vertical center**:

```javascript
const targetRow = Math.floor((VISIBLE_ROWS - 1) / 2); // row 29 of 60
return openTickIndex - (VISIBLE_ROWS - 1 - targetRow);
```

Use on `createInitialState`, `applyStartPrice`, and `switchMarket`. Do **not** use a fixed lower-third fraction — user feedback preferred equal room above/below.

### 4. Render surfaces to update together

| Surface | Market-aware change |
|---------|---------------------|
| `render/split-view.js` | `cornerLabel`, `formatPrice` on price column |
| `render/session-status.js` | Dropdown above progress, cursor price format |
| `render/onboarding-modal.js` | Integer vs decimal hints, `inputmode` |
| `tests/markets.test.js`, `tests/state.test.js` | Parsing, tick math, window position |

Analytics (`profile/analytics.js`) stays tick-index based — no change to POC/VA math.

### 5. Ship checklist (v1.2.x)

Per `docs/solutions/workflow-issues/teaching-app-local-and-link-sharing.md`:

1. `npm test`
2. `CHANGELOG.md` + `changelog.html` + `share/changelog.html`
3. Sidebar version string in `render/session-status.js`
4. `tools/make-standalone.ps1` → copy to `share/Bund-TPO-Builder.html`
5. Feature branch → merge `main` → `gh release create v1.2.x`

## Why This Matters

Without a profile registry, a second instrument invites copy-paste `if (eurostoxx)` across state, render, and tests. The `market-switch` trigger prevents a jarring welcome replay when an instructor toggles FESX mid-demo. Centering the open row in a 60-row window gives symmetric build room without constant auto-scroll on a projector.

## When to Apply

- Adding a third market (e.g. another index future with different tick conventions)
- Changing default visible rows or open-row placement — adjust `computeInitialVisibleTickStart` only
- Persisting last market in `localStorage` (deferred v1.2.4) — still call `switchMarket` semantics on restore

## Examples

**EuroStoxx open + build:**

```text
Select EuroStoxx → modal (open mode) → enter 5012 → A at 5012
↑ → 5013 with letter A, ↑ → 5014
Corner label: FESX
```

**Switch mid-session:**

```text
Bund session with prints → select EuroStoxx
→ grid cleared, full profile hidden, open modal (no welcome)
→ integer hint, default 5012 prefilled
```

## Related

- [ui-bugs/profile-overlay-lanes-and-sidebar-input.md](../ui-bugs/profile-overlay-lanes-and-sidebar-input.md) — `data-bound` listener guard, contextual tutorial vs modal
- [best-practices/render-function-regression-without-dom.md](../best-practices/render-function-regression-without-dom.md) — test renderers without jsdom
- [workflow-issues/teaching-app-local-and-link-sharing.md](../workflow-issues/teaching-app-local-and-link-sharing.md) — changelog + release discipline
- Plan: `docs/plans/2026-07-14-004-feat-market-selector-eurostoxx-v1.2.4-plan.md`
