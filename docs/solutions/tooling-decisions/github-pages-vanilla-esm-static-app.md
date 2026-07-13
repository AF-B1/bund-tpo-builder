---
module: delivery
tags: [github-pages, es-modules, static-site, nojekyll, bund-tpo-builder]
problem_type: tooling_decision
track: knowledge
date: 2026-07-13
repo: AF-B1/bund-tpo-builder
---

# GitHub Pages for a vanilla ES-module teaching app

## Context

Bund TPO Builder is a zero-build-step HTML/JS app (`index.html` + `src/*.js` modules). Instructors need a **shareable HTTPS link**; `file://` fails because browsers block cross-file ES module imports.

## Guidance

### What works

1. **Public repo** — Free GitHub Pages does not serve private repos.
2. **`.nojekyll` at repo root** — Jekyll processing breaks plain static JS/CSS otherwise.
3. **Deploy from branch `main` / root** — Simpler than Actions for this project; trigger rebuild with `POST /repos/{owner}/{repo}/pages/builds` if needed.
4. **Live URL pattern** — `https://{user}.github.io/{repo}/` (username lowercase in URL).

### What failed first

| Attempt | Symptom | Cause |
|---------|---------|-------|
| Double-click `index.html` | Grey screen, CSS only | `file://` blocks ES modules |
| Private repo + Actions deploy | Workflow green, URL 404 | Pages not enabled for private on free plan |
| Workflow deploy before public | `pages/builds` empty | Enable Pages + public repo, then rebuild |

### Working setup (AF-B1)

```text
Repo public
.nojekyll present
Pages: legacy, branch main, path /
```

## Why this matters

Teaching tools must be **one link, zero install**. GitHub Pages is free and updates on `git push` within ~1 minute.

## When to apply

- Local HTML/JS apps with `import` across files
- No bundler in v1
- Solo or small-team sharing

## Prevention

- Add `.nojekyll` in project scaffold
- Document “do not open index.html directly” in README
- Verify with `GET https://user.github.io/repo/src/main.js` after first deploy

## Related files

- `index.html`
- `.nojekyll`
- `SHIP.bat` (first-time GitHub setup helper)
- `README.md`