#!/bin/bash
echo "🎮 Starting GPS MMORPG..."

# 1. Check for Bun
if ! command -v bun &> /dev/null
then
    echo "📦 Bun not found. Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
fi

# 2. Install and Build
echo "🏗️  Setting up game (this may take a minute)..."
bun run install:all
bun run build

# 3. Launch
echo "🚀 Launching Server..."
bun run start.ts
