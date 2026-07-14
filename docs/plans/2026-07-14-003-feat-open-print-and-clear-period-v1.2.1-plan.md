---
title: Bund TPO Builder — Open print highlight + clear period (v1.2.1)
type: feat
date: 2026-07-14
topic: bund-tpo-builder
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
parent_plan: docs/plans/2026-07-14-002-feat-onboarding-modal-v1.2-plan.md
---

# Bund TPO Builder — Open print highlight + clear period (v1.2.1)

## Goal Capsule

**Objective:** Two small teaching UX improvements: (1) visually distinguish the session open print (first `A` at the open price) with a light-green style, and (2) add a single-key action to wipe all letters in the **current period column** so the instructor can redo period C without resetting A and B.

**Product authority:** Instructor-led correction mid-build — faster than cell-by-cell Delete, less destructive than `R` full reset.

**Concept check:** Yes, this makes sense. Today `Delete` removes one cell at the cursor; `R` clears everything. The gap is “redo this 30-minute bracket” when the shape of C (or any active period) is wrong. Highlighting the open print answers “where did the session start?” on a busy projector.

**Open blockers:** None.

## Product Contract

**Preservation note:** Extends v1.2 keyboard model. Does not change open-price modal, analytics algorithms, or VA/IBR math.

### Summary

The first `A` placed at tick index 0 (open price row, period A column) renders with a dedicated light-green treatment in Split View. Pressing **`X`** clears every letter in the period column where the cursor currently sits (e.g. all `C` prints), recomputes session metadata (`lastPrint`, close marker), and live-syncs Full Profile if visible. A and B columns are untouched.

### Problem Frame

After several periods are built, instructors struggle to spot the open on a gray grid, and fixing a bad period shape means many Delete presses or a full session reset. Students watching a demo lose the narrative when the instructor nukes A and B just to fix C.

### Key Decisions

- **KD1. Open print is one cell.** Only the cell at `tickIndex === 0` and `periodIndex === 0` with letter `A` gets the open style — not every `A` in the profile, not every cell in column A.
- **KD2. Clear period = current cursor column.** `X` removes all grid keys matching `*,{state.cursor.periodIndex}`. Cursor stays in that period; user rebuilds with arrows as today.
- **KD3. Key binding: `X` / `x`.** Mnemonic “clear column”; no modifier; no confirm dialog (less destructive than `R`). Sidebar guide documents it.
- **KD4. `lastPrint` recompute after clear.** Pure helper scans remaining grid: highest `periodIndex`, then highest `tickIndex` within that period (teaching-close heuristic). If grid empty, same path as delete-all (`lastPrint = null`, hide full profile, open-price modal).
- **KD5. Split View styling primary.** Full Profile may tint the open-price row letters green at tick 0 only if trivial; otherwise defer full-profile open tint to avoid clashing with POC magenta — Split View is the teaching surface for open identification.
- **KD6. Green palette.** Background `#8fd694`, text `#0a4d0f`, subtle border `#5cb863` — readable on `#b8b8b8` and distinct from magenta `#c000c0`, orange IB `#e85d04`, red close `#cc0000`.
- **KD7. Version v1.2.1** — changelog + share rebuild.

### Actors

- **A1. Instructor** — spots open print, clears a bad period column, continues teaching.
- **A2. Student** — sees green “session started here” anchor.

### Requirements

**Open print highlight**

- R1. In Split View, the open cell (`tick 0`, period `A`) uses class `open-print` when it contains `A`.
- R2. Green styling meets WCAG-ish contrast on gray grid (implementer verifies visually; automated test asserts class presence only).
- R3. If open cell is cleared (user deletes that cell), green applies again when `A` is re-printed at tick 0, period 0.
- R4. Other `A` cells in column A (tick ≠ 0) keep existing `early-letter` magenta text, no green fill.

**Clear current period**

- R5. `X` / `x` clears all prints in `state.cursor.periodIndex` only.
- R6. Does not change cursor period index or tick index (only removes letters).
- R7. `lastPrint` recomputed via `recomputeLastPrint(state)`; Full Profile syncs if revealed.
- R8. Clearing the only populated period(s) until grid empty triggers existing empty-grid behavior (onboarding modal, `setOpenPriceTrigger('reset')`).
- R9. Clearing period A while B/C remain updates IBR bar correctly (A range may shrink or disappear).
- R10. `X` ignored when modal price input focused or `!hasPrints(state)`.

**Teaching copy**

- R11. Sidebar guide adds: `<kbd>X</kbd> clear current period`.
- R12. One-line teach hint: “Redo this bracket without resetting the whole session.”

### Key Flows

- F1. Spot open
  - **Given:** Session started at 125.50
  - **When:** Instructor views Split View
  - **Then:** Open `A` at 125.50 row is light green.

- F2. Redo period C
  - **Given:** A and B built; cursor in period C with several C letters
  - **When:** Press `X`
  - **Then:** All C letters gone; A and B unchanged; cursor still in C; rebuild with arrows.

- F3. Clear last period empties session
  - **Given:** Only period A has prints; cursor in A
  - **When:** Press `X`
  - **Then:** Grid empty → open-price modal (v1.2 behavior).

### Acceptance Examples

- AE1. Open print class
  - **Given:** `applyStartPrice('125.50')`
  - **When:** `renderSplitView` stub or DOM render
  - **Then:** Cell at tick 0, period 0 has `open-print` class.

- AE2. Clear period C keeps A/B
  - **Given:** Grid with A at ticks 0–2, B at tick 2, C at ticks 1–3; cursor periodIndex 2
  - **When:** `clearPeriod(state, 2)` or `X` handler
  - **Then:** No keys ending in `,2`; A and B keys remain.

- AE3. lastPrint after clear
  - **Given:** lastPrint was in C; clear period C; B still has prints
  - **When:** Clear completes
  - **Then:** `lastPrint` points to a remaining B cell (highest period with prints).

- AE4. IBR after partial A clear
  - **Given:** A and B ranges set; clear all of A
  - **When:** Analytics recompute
  - **Then:** IBR reflects only remaining B prints (or null if B empty).

### Success Criteria

- SC1. Instructor can redo one period in one keystroke.
- SC2. Open price row identifiable at a glance on projector.
- SC3. No regression in existing 26 tests (updated/extended as needed).

### Scope Boundaries

**In scope:** `state.js` helpers, `keyboard.js`, `split-view.js`, `app.css`, sidebar hint, tests, changelog, share bundle.

**Deferred:** Undo stack, clear-with-confirm, full-profile green letter in merged column, configurable key map.

**Outstanding questions:** None blocking. Key is `X` unless user requests otherwise at implementation time.

---

## Planning Contract

### Summary

Pure functions `isOpenPrint(tick, period, letter)` and `clearPeriodColumn(state, periodIndex)` + `recomputeLastPrint(state)` in `state.js`. Keyboard handler calls clear on `X`. Split renderer adds `open-print` class when `isOpenPrint` true. Existing `early-letter` rule: open cell uses `open-print` instead of (or in addition with override) `early-letter` — green wins over magenta for that single cell.

### Key Technical Decisions

- **KTD1. `clearPeriodColumn(grid, periodIndex)`** — iterate `Object.keys(grid)`, delete keys where period matches.
- **KTD2. `recomputeLastPrint(state)`** — if grid empty → `lastPrint = null`; else max `(periodIndex, tickIndex)` lexicographic.
- **KTD3. CSS specificity.** `.split-cell.open-print { background: #8fd694; color: #0a4d0f; }` — listed after `.early-letter` so it overrides magenta on open cell only.
- **KTD4. Test grid construction** — use `setCell` in tests; no jsdom required for state/analytics tests; optional render stub for class assertion.

### Files

| File | Change |
|------|--------|
| `src/state.js` | `isOpenPrint`, `clearPeriodColumn`, `recomputeLastPrint` |
| `src/keyboard.js` | `X` handler |
| `src/render/split-view.js` | `open-print` class |
| `src/styles/app.css` | `.open-print` |
| `src/render/session-status.js` | guide line + v1.2.1 version |
| `tests/state.test.js` or `tests/period-clear.test.js` | clear + recompute |
| `tests/split-view.test.js` (new, optional) | class on open cell via render export |
| `CHANGELOG.md`, changelogs, `share/`, `Agents.md` | ship |

---

## Implementation Units

### U1. State helpers — open print identity, clear column, recompute lastPrint

**Requirements:** R4–R9, AE2, AE3

**Files:** `src/state.js`, `tests/period-clear.test.js`

**Approach:**

```text
isOpenPrint(tick, period, letter) → tick === 0 && period === 0 && letter === 'A'
clearPeriodColumn(state, periodIndex) → delete matching keys; recomputeLastPrint(state)
recomputeLastPrint(state) → scan grid or null
```

**Test scenarios:**

- Clear period 2 removes only `*,2` keys.
- After clear, `lastPrint` is max period/tick among survivors.
- Empty grid → `lastPrint null`, `hasPrints` false.
- `isOpenPrint(0,0,'A')` true; `isOpenPrint(1,0,'A')` false.

**Verification:** Vitest.

---

### U2. Keyboard `X` + sidebar hint

**Requirements:** R5–R7, R10–R12, F2, F3

**Files:** `src/keyboard.js`, `src/render/session-status.js`, `tests/session-status.test.js`

**Approach:** Before arrow handlers, on `x`/`X`: `clearPeriodColumn(state, state.cursor.periodIndex)`; if `!hasPrints` mirror delete-all branch (`fullProfileRevealed = false`, `setOpenPriceTrigger('reset')`); `onChange()`.

**Test scenarios:**

- Session-status HTML contains `clear current period` and `<kbd>X</kbd>`.
- State integration: simulated key path via exported clear function (keyboard unit test optional).

**Verification:** Vitest + manual smoke F2.

---

### U3. Open print green styling in Split View

**Requirements:** R1–R4, F1, AE1

**Files:** `src/render/split-view.js`, `src/styles/app.css`

**Approach:** When rendering cell, if `isOpenPrint(tickIndex, p, letter)` add `open-print`; else keep `early-letter` for A/B.

**Test scenarios:**

- Render helper test: open cell class list includes `open-print`.
- Non-open A at tick 1 has `early-letter`, not `open-print`.

**Verification:** Vitest stub render or manual projector check.

---

### U4. Ship v1.2.1

**Requirements:** KD7

**Files:** `CHANGELOG.md`, `changelog.html`, `share/*`, `Agents.md`, `tools/make-standalone.ps1` (no change if file list unchanged)

**Verification:** `npm.cmd test`; rebuild standalone; copy to `share/`.

---

## Verification Contract

```bash
npm.cmd test
```

Manual:

1. Start session → open `A` at 125.50 is green.
2. Build A, B, messy C → `X` → only C gone.
3. Full profile live-sync after clear.
4. `X` on only period A → open-price modal.

---

## Definition of Done

- R1–R12 satisfied; AE1–AE4 covered by tests or manual smoke.
- v1.2.1 changelog and share bundle updated.
- `/ce-compound` optional after ship for clear-period pattern.

| Unit | Done when |
|------|-----------|
| U1 | clear + recompute tests pass |
| U2 | X wired; sidebar documents key |
| U3 | Green open print visible in split |
| U4 | Changelog + share rebuilt |