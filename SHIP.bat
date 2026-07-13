@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"

echo.
echo === Bund TPO Builder - Ship to GitHub ===
echo.

gh auth status >nul 2>&1
if errorlevel 1 (
  echo Step 1: Sign in to GitHub in your browser...
  gh auth login --hostname github.com --git-protocol https --web
)

echo.
echo Step 2: Create repo and push (if repo already exists, this still pushes)...
gh repo create AF-B1/bund-tpo-builder --public --source=. --remote=origin --push 2>nul
if errorlevel 1 (
  git push -u origin main
)

echo.
echo Step 3: Enable GitHub Pages (Actions)...
gh api repos/AF-B1/bund-tpo-builder/pages -X POST -f build_type=workflow 2>nul

echo.
echo Done! Your live link (may take 1-2 min after first deploy):
echo   https://af-b1.github.io/bund-tpo-builder/
echo.
pause