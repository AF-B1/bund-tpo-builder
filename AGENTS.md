# Bund TPO Builder — agent context

Teaching tool for keyboard-built Market Profile / TPO sessions (Bund futures).

## Paths

- **Project:** `C:\Users\Guest-B\Documents\tpo-builder`
- **Desktop handoff:** `%USERPROFILE%\Desktop\continue tpo builder\`
- **Learnings:** `docs/solutions/` (read before implementing or debugging)
- **Plan:** `docs/plans/2026-07-13-001-feat-bund-tpo-builder-plan.md`

## Links

- **Live:** https://af-b1.github.io/bund-tpo-builder/
- **GitHub:** https://github.com/AF-B1/bund-tpo-builder
- **Release:** v1.2.3

## Commands

```powershell
npm test
powershell -ExecutionPolicy Bypass -File tools\make-standalone.ps1
```

Rebuild standalone after changes; copy `dist\Bund-TPO-Builder.html` to `share\`.

## Product (v1)

- Empty grid → price input in col 1; Enter sets open, seeds A
- Arrow keys build; Enter reveals full profile (col 3)
- IB bar left, close marker right, POC magenta/white, VA 68.8%
- `hasPrints(state)` gates sidebar tutorial and keyboard input

## CE workflow

Compound Engineering plugin is enabled. Use `/ce-work`, `/ce-compound`, `/ce-brainstorm` as needed.

## Resume old session (optional)

`grok --resume 019f5c96-dc2a-7f63-918a-db4b36b6436d` — prefer fresh session + this file + `docs/solutions/` instead.