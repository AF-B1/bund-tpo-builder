# Changelog

All notable changes to Bund TPO Builder.

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

[1.0.0]: https://github.com/AF-B1/bund-tpo-builder/releases/tag/v1.0.0