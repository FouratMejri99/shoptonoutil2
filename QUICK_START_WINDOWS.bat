@echo off
REM Solupedia Dashboard - Quick Start for Windows
REM This script will help you set up and run the application

echo.
echo ========================================
echo Solupedia Dashboard - Windows Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check if npm is installed
echo Checking for npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed!
    echo Please reinstall Node.js
    pause
    exit /b 1
)
echo ✓ npm is installed

echo.
echo Installing dependencies...
echo This may take 2-5 minutes...
echo.

REM Install dependencies
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create a .env.local file in this folder
echo 2. Copy the contents from .env.local.example
echo 3. Update the DATABASE_URL with your PostgreSQL connection
echo 4. Run: npm run db:push
echo 5. Run: npm run dev
echo.
echo For detailed instructions, see WINDOWS_SETUP_GUIDE.md
echo.
pause
