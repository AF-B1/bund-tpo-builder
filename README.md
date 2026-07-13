# Bund TPO Builder

Local browser teaching tool for keyboard-driven Market Profile / TPO construction.

## Run locally (Windows)

**Easiest:** double-click `share/START HERE.bat` (no install).

**Dev version:** double-click `Start TPO Builder.bat` (needs Node.js).

## Development

```bash
npm install
npm test
```

Rebuild the shareable single-file version:

```powershell
powershell -File tools\make-standalone.ps1
```

---

## Ship it (first-time Git + free web link)

### What you get

| Method | Best for |
|--------|----------|
| **GitHub + GitHub Pages** | Share a link — opens in any browser, no zip |
| **Zip file** (`Bund-TPO-Builder.zip`) | Email/WhatsApp — recipient unzips and double-clicks |
| **Git repo only** | Version history, backup, collaboration |

### Step 1 — Install Git (one time)

1. Download: https://git-scm.com/download/win
2. Run installer — keep all defaults, click Next through
3. Close and reopen any terminal

### Step 2 — Create a GitHub account (one time)

1. Go to https://github.com/signup
2. Pick a username (e.g. `yourname`)

### Step 3 — Create the repo on GitHub

1. Log in → click **+** (top right) → **New repository**
2. Name: `bund-tpo-builder`
3. Leave it **Public**
4. Do **not** tick "Add README" (you already have one)
5. Click **Create repository**
6. Copy the URL shown — looks like `https://github.com/YOURNAME/bund-tpo-builder.git`

### Step 4 — Push your code (first commit)

Open **PowerShell** and run (replace `YOURNAME`):

```powershell
cd C:\Users\Guest-B\Documents\tpo-builder

git init
git add .
git commit -m "feat: Bund TPO Builder v1"

git branch -M main
git remote add origin https://github.com/YOURNAME/bund-tpo-builder.git
git push -u origin main
```

GitHub will ask you to sign in the first time — use the browser popup.

### Step 5 — Turn on GitHub Pages (free live link)

1. On your repo page → **Settings** → **Pages** (left sidebar)
2. **Build and deployment** → Source: **Deploy from a branch**
3. Branch: **main** → folder **/ (root)** → **Save**
4. Wait ~1 minute. Your link will be:

   `https://YOURNAME.github.io/bund-tpo-builder/`

Send that link to anyone — it runs in the browser, no install.

### Step 6 — Share the zip (optional backup)

Send `C:\Users\Guest-B\Documents\Bund-TPO-Builder.zip` to people who prefer a local file.

---

## Keyboard controls

| Key | Action |
|-----|--------|
| ↑ / ↓ | Move price ±0.01 and print |
| → | Next period |
| ← | Previous period |
| Enter | Show full profile |
| Delete | Erase letter |
| R | Reset session |

## Project layout

```
index.html          Entry point (works on GitHub Pages)
src/                App source
share/              Zip-friendly standalone copy
tools/              Build standalone HTML
tests/              Unit tests
```