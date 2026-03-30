#!/usr/bin/env bash
# scripts/setup-android.sh
# Sets up the Android development environment for JustLEarn.
# Run this script once before building for Android.
#
# Usage: bash scripts/setup-android.sh

set -e

echo "=== JustLEarn Android Setup ==="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Install from: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
NPM_VERSION=$(npm --version)
echo "✅ npm $NPM_VERSION"

# Check Java
if ! command -v java &> /dev/null; then
    echo "❌ Java (JDK 17) is not installed."
    echo "   Install from: https://www.oracle.com/java/technologies/downloads/"
    echo "   Or use: brew install openjdk@17"
    exit 1
fi
JAVA_VERSION=$(java -version 2>&1 | head -1)
echo "✅ Java: $JAVA_VERSION"

# Check ANDROID_HOME
if [ -z "$ANDROID_HOME" ]; then
    echo ""
    echo "⚠️  ANDROID_HOME is not set."
    echo "   Install Android Studio from: https://developer.android.com/studio"
    echo "   Then set in ~/.zshrc or ~/.bash_profile:"
    echo ""
    echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/tools:\$ANDROID_HOME/platform-tools"
    echo ""
    echo "   Reload your shell: source ~/.zshrc"
    exit 1
fi
echo "✅ ANDROID_HOME: $ANDROID_HOME"

# Check adb
if ! command -v adb &> /dev/null; then
    echo "⚠️  adb not found in PATH. Add platform-tools to PATH:"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
fi

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Add Android platform if not present
if [ ! -d "android" ] || [ ! -f "android/app/build.gradle" ]; then
    echo ""
    echo "📱 Adding Android platform..."
    npx cap add android
else
    echo "✅ Android platform already added"
fi

# Sync web assets
echo ""
echo "🔄 Syncing web assets..."
npx cap sync android

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "  1. Open Android Studio: npm run deploy:android"
echo "  2. Or build directly:   npm run build:android"
echo ""
echo "To run on a connected device:"
echo "  npx cap run android"
echo ""
echo "Documentation: GOOGLE_PLAY_GUIDE.md"
