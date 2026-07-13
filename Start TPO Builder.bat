@echo off
cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel%==0 (
  node server.js
  goto :done
)

if exist "%ProgramFiles%\nodejs\node.exe" (
  "%ProgramFiles%\nodejs\node.exe" server.js
  goto :done
)

echo.
echo Node.js is not installed.
echo Install from https://nodejs.org  then run this file again.
echo.
pause
exit /b 1

:done
pause