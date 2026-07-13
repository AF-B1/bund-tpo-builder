---
module: delivery
tags: [zip, standalone-html, changelog, releases, teaching]
problem_type: workflow_practice
track: knowledge
date: 2026-07-13
repo: AF-B1/bund-tpo-builder
---

# Sharing a local browser teaching app (zip + link + changelog)

## Context

Instructors may not have Node or Git. The app must work for **non-developers** (zip) and **link sharers** (GitHub Pages).

## Guidance

### Two delivery paths

| Audience | Artifact | Steps |
|----------|----------|-------|
| Non-technical | `share/` zip | Unzip → `START HERE.bat` OR open `Bund-TPO-Builder.html` via local server |
| Everyone with internet | GitHub Pages URL | Open link in browser |

### Standalone single-file build

`tools/make-standalone.ps1` bundles all `src/` into one HTML for zip users. Re-run after feature changes, then refresh `share/Bund-TPO-Builder.html`.

### Changelog discipline

- `CHANGELOG.md` — repo history
- `changelog.html` — readable on-site page
- Sidebar link `Changelog · vX.Y.Z` — instructors see version
- Tag releases (`v1.0.0`, `v1.1.0`) on meaningful milestones, not every commit

### Git first-time flow (Windows)

```text
git init → commit → gh auth login → gh repo create → push
Make repo public → enable Pages → add .nojekyll
```

## Why this matters

Compound Engineering `/ce-work` ends at ship. Without zip + link + changelog, “shipped” only exists on the author's machine.

## When to apply

- Local-first teaching tools
- No backend in v1
- Instructor-led demos

## Examples

- v1.0.0 — first public release + Pages
- v1.1.0 — custom open price (announce in changelog, not every push)

## Related files

- `share/START HERE.bat`
- `share/SETUP.txt`
- `changelog.html`
- `CHANGELOG.md`