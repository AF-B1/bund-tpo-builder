---
module: session-sidebar
date: 2026-07-13
problem_type: best_practice
component: testing_framework
severity: low
applies_when:
  - Pure render functions write to container.innerHTML
  - Vitest runs in Node without jsdom
tags: [vitest, regression-test, render, session-status, hasPrints]
---

# Regression-test render functions without a DOM

## Context

Bund TPO Builder sidebar hints depend on `hasPrints(state)`. The v1.1.1 fix was small but easy to regress — a future edit could show “show full profile” during open-price mode again.

The project uses Vitest with no jsdom. Full browser tests are heavy for a teaching sidebar.

## Guidance

For render helpers that only assign `container.innerHTML`, pass a minimal stub:

```javascript
function renderInto(state) {
  const container = { innerHTML: '' };
  renderSessionStatus(container, state);
  return container.innerHTML;
}
```

Assert on user-visible strings and control presence:

- Empty grid → `set open price`, `start-price-input`, no `show full profile`
- After `applyStartPrice` → `show full profile`, no `start-price-input`

Pair with state-unit tests on `hasPrints` / `applyStartPrice` — render tests prove the wiring, not the ladder math.

## Why This Matters

Dogfood caught the tutorial bug visually. A two-case render test locks the contract so refactors to `guideBlock` fail in CI instead of in front of a class.

## When to Apply

- Render output is HTML strings with mode-specific copy
- No event listeners or focus behavior under test (those stay manual or integration tests)
- Stub container is enough; skip jsdom unless testing real DOM APIs

## Related

- [ui-bugs/profile-overlay-lanes-and-sidebar-input.md](../ui-bugs/profile-overlay-lanes-and-sidebar-input.md)
- `tests/session-status.test.js`
- `src/render/session-status.js`