---
title: Bund TPO Builder — Market selector + EuroStoxx (FESX) v1.2.4
type: feat
date: 2026-07-14
topic: bund-tpo-builder
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
parent_plan: docs/plans/2026-07-14-003-feat-open-print-and-clear-period-v1.2.1-plan.md
---

# Bund TPO Builder — Market selector + EuroStoxx (FESX) v1.2.4

## Goal Capsule

**Objective:** Add a **market dropdown** in column 1 (above session timings) so instructors can teach **Bund** or **EuroStoxx 50 (FESX)** on the same keyboard TPO workflow. EuroStoxx uses **1 index point per tick** (EUREX outright spec since Mar 2022). Switching markets mid-session **always resets** the grid and opens the **open-price modal** — **without** the welcome screen. Also **double grid height** (60 visible rows) and **bias the open print lower** in the window so builders have more room above and below before auto-scroll.

**Product authority:** User-confirmed scope (2026-07-14): same session hours; market-switch → reset + open modal (no welcome); Bund decimal required / EuroStoxx integer; taller grid + lower open for **both** markets; corner label reflects selection.

**Branch policy:** All implementation on a **feature branch** (not `main`) until manually reviewed.

**Open blockers:** None.

## Product Contract

**Preservation note:** Product Contract from ce-plan-bootstrap. Session period model (07:00–16:30, 30 min, A–S) unchanged. Keyboard model unchanged except market-aware price ladder.

### Summary

Column 1 gains a `<select>` above `07:00 – 16:30` with **Bund** and **EuroStoxx**. Selecting a market reconfigures tick size and price display, clears prints, and shows the existing onboarding dialog in **open-price mode** (skip welcome). Bund keeps **decimal required** open entry (`125.50`); EuroStoxx accepts **integers only** (`5012`). The split grid shows **60 rows** (was 30) with the open row starting in the **lower third** of the visible ladder. Grid corner label shows **BUND** or **FESX** per selection.

### Problem Frame

v1 is Bund-only (0.01 tick, decimal prices). Instructors who also teach Euro Stoxx 50 need the same kinesthetic builder without a separate app. FESX trades in **whole index points** — the tool must not force decimal formatting on EuroStoxx.

### Key Decisions

- **KD1. Two market profiles.** Registry keyed by `marketId`: `bund` | `eurostoxx`. Each profile defines: display name, corner label, `tickSize`, default `startPrice`, price `format` (`decimal2` | `integer`), open-price validation rules, hint copy.
- **KD2. FESX tick = 1 index point.** Per [EUREX FESX product page](https://www.eurex.com/ex-en/markets/idx/stx/euro-stoxx-50-derivatives/products/EURO-STOXX-50-Index-Futures-160088): minimum price change 1.0 index point for outright futures (Mar 2022+). Teaching examples: 5012 → 5013 → 5014.
- **KD3. Session hours unchanged.** Both markets use existing 07:00–16:30 / 19 periods. EuroStoxx extended EUREX hours are out of scope.
- **KD4. Market switch = full reset + open modal, no welcome.** New trigger `market-switch` in onboarding: `computeModalMode` returns `open` (not `welcome`) when grid empty after switch. Same as post-welcome first load UX.
- **KD5. Grid height 60 rows.** `VISIBLE_ROWS` 30 → 60 for both markets. CSS row height unchanged (`ROW_HEIGHT` 18px); panel scrolls as today.
- **KD6. Open row biased low.** On new session / applyStartPrice / market switch, set `visibleTickStart` so tick index `0` (open) appears near **row 75%** from top of the 60-row window (~45 rows below top). Gives ~45 ticks visible above open and ~14 below before scroll. Constant `OPEN_ROW_FRACTION = 0.75` (or equivalent) in config; tune in implementation if projector feel is off.
- **KD7. Corner label dynamic.** `split-corner` text from `market.cornerLabel` (`BUND` | `FESX`).
- **KD8. Feature branch first.** Branch name `feat/v1.2.4-market-selector` from `main`; merge after user review.
- **KD9. Version v1.2.4** — sidebar, changelog, AGENTS.md, share standalone rebuild.

### Actors

- **A1. Instructor** — picks market, enters open, builds profile with market-appropriate ticks.
- **A2. Student** — sees correct price ladder format (decimals vs integers).

### Requirements

**Market selector**

- R1. Dropdown in col 1 **above** session progress title (`07:00 – 16:30`).
- R2. Options: **Bund**, **EuroStoxx** (UI label); internal ids `bund`, `eurostoxx`.
- R3. Default on fresh load: **Bund** (unless deferred persistence added later).
- R4. Changing selection while prints exist: clear grid, hide full profile, set market profile, show open-price modal (**no welcome**).
- R5. Changing selection when grid already empty: still apply market profile + open modal (consistent path).

**EuroStoxx price model**

- R6. `tickSize = 1` for EuroStoxx; arrow ↑/↓ moves one index point; one letter per tick as today.
- R7. Price column displays **integers** (no `.00`) for EuroStoxx; Bund keeps **two decimals**.
- R8. Open price input: EuroStoxx accepts positive integers only (e.g. `5012`); rejects decimals (`5012.5`) and Bund-style errors are market-specific.
- R9. Bund: decimal point **required** (existing rule preserved).

**Shared grid / layout**

- R10. Visible ladder **60 rows** for both markets.
- R11. After open price set, open print row appears in **lower portion** of visible window (both markets).
- R12. Auto-scroll edge behavior unchanged (`SCROLL_EDGE = 3`), scaled to 60 rows.

**Modal / onboarding**

- R13. Market switch uses modal mode **`open`** — title “Set session open price”, market-appropriate hints (decimal vs integer examples).
- R14. First-ever visit welcome flow **unchanged** when user has not seen welcome (`welcome` mode still fires on initial app load only).
- R15. `hasPrints(state)` still gates keyboard build and sidebar tutorial.

**Labels & ship**

- R16. Split grid corner shows **BUND** or **FESX** per market.
- R17. Version strings updated to **v1.2.4**; changelog entry; rebuild `share/Bund-TPO-Builder.html`.

### Key Flows

- F1. First load (Bund default)
  - **Given:** New visitor, no prints
  - **When:** App loads
  - **Then:** Welcome modal (if unseen) → Bund decimal open → 60-row grid, open row low.

- F2. Switch to EuroStoxx mid-session
  - **Given:** Bund session with prints
  - **When:** Select EuroStoxx in dropdown
  - **Then:** Grid cleared; no welcome; open modal with integer hint; ladder shows integer prices; corner **FESX**.

- F3. Build EuroStoxx profile
  - **Given:** Open at 5012
  - **When:** ↑ three times in period A
  - **Then:** Prints at 5012, 5013, 5014 with letters A.

- F4. Switch back to Bund
  - **Given:** EuroStoxx session
  - **When:** Select Bund
  - **Then:** Reset + open modal (decimal hint); 0.01 tick ladder returns.

### Acceptance Examples

- AE1. EuroStoxx parse accepts `5012`, rejects `5012.5` and `125.50` format when market is eurostoxx.
- AE2. Bund parse accepts `125.50`, rejects `12550`.
- AE3. `computeModalMode(false)` with trigger `market-switch` returns `open` even when welcome not seen.
- AE4. After `applyStartPrice` on 60-row grid, tick 0 row index in rendered output is ≥ 40 (lower third).
- AE5. `renderSplitView` corner text is `FESX` when `state.marketId === 'eurostoxx'`.

### Success Criteria

- SC1. Instructor can teach Bund or FESX in one app without code changes.
- SC2. Market switch never shows welcome; always open-price entry.
- SC3. All existing Vitest tests pass (updated for 60 rows / market-aware defaults).
- SC4. Work lands on feature branch; user reviews before merge to `main`.

### Scope Boundaries

**In scope:** Market registry, state, parsing, dropdown UI, modal copy, split-view labels/formatting, session-status, config constants, tests, changelog, share rebuild, feature branch.

**Out of scope:** Extended EuroStoxx session hours, localStorage market persistence, third markets, full-profile price column, changing period count.

### Deferred to Follow-Up Work

- Persist last selected market in `localStorage`.
- EuroStoxx-specific session time template.
- Market name in page `<title>` / onboarding welcome copy mentioning both instruments.

---

## Planning Contract

### Summary

Introduce `src/markets.js` (or extend `config.js`) with market profiles. `state.marketId` drives `parseStartPrice`, `priceAtTickIndex`, price formatting helpers, and split-view corner. `onboarding.js` adds trigger `market-switch`. `main.js` wires dropdown `change` → `switchMarket()`. Increase `VISIBLE_ROWS` to 60 and centralize initial `visibleTickStart` computation.

### Key Technical Decisions

- **KTD1. Market profile shape.**

```text
{ id, label, cornerLabel, tickSize, defaultStartPrice, priceFormat, parseOpenPrice(raw) }
```

- **KTD2. `formatPrice(value, market)`** — Bund: `toFixed(2)`; EuroStoxx: `String(Math.round(value))`.
- **KTD3. `initialVisibleTickStart()`** — `-(Math.floor(VISIBLE_ROWS * OPEN_ROW_FRACTION) - 1)` so tick 0 maps to lower window (verify with split-view row formula).
- **KTD4. Dropdown handler** — if `newMarketId === state.marketId`, no-op; else `switchMarket(state, newMarketId)` → clear grid state, update market, `fullProfileRevealed = false`, `setOpenPriceTrigger('market-switch')`, `render()`.
- **KTD5. Tests without jsdom** — export pure helpers (`formatPrice`, `parseStartPrice` with market, `initialVisibleTickStart`, `computeModalMode` with new trigger); follow `docs/solutions/best-practices/render-function-regression-without-dom.md`.
- **KTD6. Analytics unchanged structurally** — POC/VA/IB use tick indices; `computeClose` formats via market helper when displayed (sidebar already uses `priceAtTickIndex`).

### Assumptions

- EuroStoxx default prefilled open in modal: **5012** (teaching example; profile `defaultStartPrice`).
- Bund default remains **125.50**.
- Feature branch created at start of `ce-work`, not committed to `main`.

### Sources & Research

- EUREX FESX: 1 index point tick (outright), EUR 10 per point — [product page](https://www.eurex.com/ex-en/markets/idx/stx/euro-stoxx-50-derivatives/products/EURO-STOXX-50-Index-Futures-160088).
- Repo patterns: `onboarding.js` triggers, `applyStartPrice`, `docs/solutions/ui-bugs/profile-overlay-lanes-and-sidebar-input.md` (modal/input guards).

---

## Implementation Units

### U1. Feature branch + market registry

**Requirements:** R8–R9, R16, KD1, SC4

**Dependencies:** None (first)

**Files:** `src/markets.js` (new), `src/config.js`, `src/state.js`, `tests/markets.test.js` (new)

**Approach:** Create branch `feat/v1.2.4-market-selector` from `main`. Add `MARKETS` map and `getMarket(id)`, `DEFAULT_MARKET_ID = 'bund'`. Move Bund constants into `bund` profile; add `eurostoxx` with `tickSize: 1`, `defaultStartPrice: 5012`, integer parsing. Add `state.marketId` to `createInitialState()`.

**Execution note:** Branch creation is first shell action in `ce-work` before edits.

**Test scenarios:**

- `getMarket('eurostoxx').tickSize === 1`.
- Bund profile `tickSize === 0.01`.
- Unknown market id throws or returns null (pick one; document in code).

**Verification:** Branch exists; Vitest passes.

---

### U2. Market-aware price math and parsing

**Requirements:** R6–R9, AE1, AE2

**Dependencies:** U1

**Files:** `src/state.js`, `src/markets.js`, `tests/state.test.js`, `tests/markets.test.js`

**Approach:** Refactor `parseStartPrice(raw, marketId)` and `applyStartPrice(state, raw)` to use active market. EuroStoxx: `/^\d+$/`, integer > 0. Bund: existing decimal rule. `priceAtTickIndex(tick, startPrice, marketId)` uses market `tickSize`; formatting via exported `formatPrice`. Update tests that assume single tick size.

**Test scenarios:**

- Bund: `125.50` ok; `12550` fail.
- EuroStoxx: `5012` ok; `5012.5` fail; `125.50` fail.
- `priceAtTickIndex(1, 5012, 'eurostoxx') === 5013`.
- `priceAtTickIndex(1, 125.5, 'bund') === 125.51`.

**Verification:** Vitest.

---

### U3. Taller grid + low open window

**Requirements:** R10–R12, R11, KD5–KD6, AE4

**Dependencies:** U1

**Files:** `src/config.js`, `src/state.js`, `tests/split-view.test.js` (or new `tests/grid-window.test.js`)

**Approach:** Set `VISIBLE_ROWS = 60`. Add `OPEN_ROW_FRACTION` (~0.75). Export `computeInitialVisibleTickStart()` used by `createInitialState`, `applyStartPrice`, and `switchMarket`. Ensure `ensureVisibleWindow` still works with 60 rows.

**Test scenarios:**

- `VISIBLE_ROWS === 60`.
- After initial state / applyStartPrice, `visibleTickStart` places tick 0 in lower third (assert row index via split-view row helper or exported `tickIndexToRow`).

**Verification:** Vitest + manual smoke: open appears low on projector.

---

### U4. Market-switch onboarding trigger

**Requirements:** R13–R14, KD4, AE3

**Dependencies:** U1

**Files:** `src/onboarding.js`, `src/render/onboarding-modal.js`, `tests/onboarding.test.js`, `tests/onboarding-modal.test.js`

**Approach:** Add trigger `market-switch`. `computeModalMode(false)` priority: `market-switch` → `open` (skip welcome). Modal hints/examples branch on `marketId` passed from `main.js` render props.

**Test scenarios:**

- Trigger `market-switch`, welcome not seen → mode `open` (not `welcome`).
- EuroStoxx modal copy mentions integer example (`5012`); Bund mentions decimal.
- Prefill uses market `defaultStartPrice` formatted correctly.

**Verification:** Vitest.

---

### U5. Sidebar dropdown + switch handler

**Requirements:** R1–R5, F2, F4

**Dependencies:** U2, U3, U4

**Files:** `src/render/session-status.js`, `src/styles/app.css`, `src/main.js`, `src/state.js`, `tests/session-status.test.js`

**Approach:** Render `<select class="market-select">` above progress title. Bind once in `main.js` (mirror `data-bound` pattern from open-price input). `switchMarket(state, id)` clears grid, resets cursor, applies market defaults, triggers modal. Re-bind dropdown after render if needed (prefer stable sidebar mount outside innerHTML wipe — if status rewrites whole sidebar, bind in `render()` with guard).

**Test scenarios:**

- Session status HTML contains `market-select` with Bund and EuroStoxx options.
- Switching market clears `hasPrints` and sets `marketId`.

**Verification:** Vitest for HTML; manual F2/F4.

---

### U6. Split view corner + price column formatting

**Requirements:** R7, R16, AE5, F3

**Dependencies:** U2, U5

**Files:** `src/render/split-view.js`, `src/render/session-status.js`, `tests/split-view.test.js`

**Approach:** Corner text from market profile. Price labels use `formatPrice(priceAtTickIndex(...), market)`. Status price line same formatter.

**Test scenarios:**

- Corner `FESX` when market eurostoxx (export render helper or DOM-less class test).
- Price label for EuroStoxx has no decimal point in output string.

**Verification:** Vitest.

---

### U7. Ship v1.2.4 + standalone bundle

**Requirements:** R17, SC3

**Dependencies:** U1–U6

**Files:** `CHANGELOG.md`, `changelog.html`, `share/changelog.html`, `AGENTS.md`, `src/render/session-status.js`, `tools/make-standalone.ps1` output → `share/Bund-TPO-Builder.html`

**Approach:** Add v1.2.4 changelog bullets (market selector, EuroStoxx, taller grid). Run `npm test`. Run standalone script; copy to `share/`.

**Test scenarios:**

- Test expectation: none — version/changelog strings; test suite green from prior units.

**Verification:** `npm test` all pass; manual load on feature branch.

---

## Verification Contract

| Gate | Command / action |
|------|------------------|
| Unit tests | `npm test` — all pass |
| Standalone | `powershell -ExecutionPolicy Bypass -File tools\make-standalone.ps1` then verify `share/Bund-TPO-Builder.html` |
| Branch | `git branch --show-current` shows `feat/v1.2.4-market-selector` during development |
| Manual smoke | Feature branch: welcome once → Bund build → switch EuroStoxx → integer open → build → Enter full profile → switch Bund → decimal open |

## Definition of Done

- [ ] Feature branch contains all changes; **not merged to `main`** until user approves
- [ ] Dropdown works; market switch resets without welcome
- [ ] Bund decimal / EuroStoxx integer validation enforced
- [ ] 60-row grid; open row visibly low on load
- [ ] Corner label BUND / FESX correct
- [ ] v1.2.4 in sidebar + changelog; share bundle rebuilt
- [ ] `npm test` green
- [ ] No regression to onboarding welcome on true first visit

---

## Open Questions

| Question | Status |
|----------|--------|
| Exact `OPEN_ROW_FRACTION` for “feels right” on projector | Deferred to implementation (tune 0.70–0.80) |
| Default EuroStoxx prefilled open (5012 vs other) | Assumed 5012; user can change in modal |
