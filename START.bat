@echo off
cd /d "%~dp0"
echo Laundry Wallah - Starting...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Node.js is not installed or not in PATH.
  echo Please install Node.js from https://nodejs.org and run this script again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %errorlevel% neq 0 (
    echo ERROR: npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting server...
echo.
node server.js
if %errorlevel% neq 0 (
  echo.
  echo Server exited with an error.
  pause
  exit /b 1
)
pause
