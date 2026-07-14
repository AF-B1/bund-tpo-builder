# Changelog

All notable changes to Bund TPO Builder.

## [1.2.3] — 2026-07-14

### Fixed
- Full profile (column 3): session open `A` uses green **text only** — no green background fill

### Changed
- Rebuilt standalone share bundle (`share/Bund-TPO-Builder.html`)

## [1.2.2] — 2026-07-14

### Added
- Full profile (column 3) highlights the session open `A` with the same light-green style as Split View

### Fixed
- `X` clear period restores the cursor to the price/period you were on before advancing into the cleared bracket (e.g. back to B @ 125.32 after clearing C)

### Changed
- Rebuilt standalone share bundle (`share/Bund-TPO-Builder.html`)

## [1.2.1] — 2026-07-14

### Added
- Light-green highlight on the session open print (first `A` at open price)
- `X` clears all letters in the current period column — redo one bracket without full reset

### Changed
- Sidebar guide documents `X` clear period vs `Delete` single cell
- Rebuilt standalone share bundle (`share/Bund-TPO-Builder.html`)

## [1.2.0] — 2026-07-14

### Added
- Onboarding modal on load, reset, and delete-all: welcome message on first visit, open-price entry, inline validation
- Sidebar shows session progress only until the first print; build shortcuts appear after open price is set

### Changed
- Open price input moved from sidebar to modal; reset shows a minimal “set open price” prompt
- Rebuilt standalone share bundle (`share/Bund-TPO-Builder.html`)

## [1.1.2] — 2026-07-13

### Added
- Regression tests for contextual sidebar tutorial hints (`tests/session-status.test.js`)
- Compound docs for v1.1.1 tutorial fix and render testing pattern

### Changed
- Rebuilt standalone share bundle (`share/Bund-TPO-Builder.html`)

## [1.1.1] — 2026-07-13

### Fixed
- Sidebar tutorial shows “Enter to set open price” while price input is visible; build shortcuts appear after session starts

## [1.1.0] — 2026-07-13

### Added
- Custom session open price: type a price in column 1 when the grid is empty, press Enter to start building from that level (0.01 tick steps unchanged)

### Changed
- Fresh load and reset show a price input instead of auto-placing A at 125.50
- Deleting all prints returns to the open-price input (keeps last chosen price as default)

## [1.0.0] — 2026-07-13

First public release.

### Added
- Keyboard-driven TPO builder for Bund futures (125.50 start, 0.01 tick)
- Split view with 19 periods (A–S), 07:00–16:30 session
- Full profile view: merged letters, POC highlight, 68.8% value area, Initial Balance bar, close marker
- Three-column layout: session sidebar, builder, full profile
- Vertical session progress bar (07:00 → 16:30) with period indicators
- Live status: current print, time bracket, and price
- Teaching hints and keyboard guide in sidebar

### Layout & visuals
- Orange Initial Balance bar (A + B range) left of profile letters
- Red close triangle right of letters, pointing inward
- POC row: magenta background with white letters (no strikethrough line)
- Slightly larger monospace text for teaching visibility

### Delivery
- GitHub Pages live link
- Standalone zip for local use (`START HERE.bat`)

[1.2.3]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.2.3
[1.2.2]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.2.2
[1.2.1]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.2.1
[1.2.0]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.2.0
[1.1.2]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.1.2
[1.1.1]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.1.1
[1.1.0]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.1.0
[1.0.0]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.0.0