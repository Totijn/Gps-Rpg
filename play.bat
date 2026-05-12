@echo off
echo 🎮 Starting GPS MMORPG...

:: Check for Bun
where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo 📦 Bun not found. Please install it from https://bun.sh
    pause
    exit /b
)

echo 🏗️  Setting up game...
call bun run install:all
call bun run build

echo 🚀 Launching Server...
call bun run start.ts
pause
