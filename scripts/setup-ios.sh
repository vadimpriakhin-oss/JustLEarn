#!/usr/bin/env bash
# scripts/setup-ios.sh
# Sets up the iOS development environment for JustLEarn.
# Run this script once before building for iOS.
# Requires macOS and Xcode.
#
# Usage: bash scripts/setup-ios.sh

set -e

echo "=== JustLEarn iOS Setup ==="
echo ""

# Check macOS
if [[ "$(uname)" != "Darwin" ]]; then
    echo "❌ iOS development requires macOS."
    echo "   This script must be run on a Mac."
    exit 1
fi
echo "✅ Running on macOS"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "   Install from: https://nodejs.org/"
    echo "   Or use: brew install node"
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

# Check Xcode
if ! command -v xcode-select &> /dev/null; then
    echo "❌ Xcode command-line tools not installed."
    echo "   Install Xcode from the Mac App Store"
    echo "   Then run: xcode-select --install"
    exit 1
fi
XCODE_PATH=$(xcode-select --print-path)
echo "✅ Xcode tools at: $XCODE_PATH"

# Check Xcode version
if command -v xcodebuild &> /dev/null; then
    XCODE_VERSION=$(xcodebuild -version | head -1)
    echo "✅ $XCODE_VERSION"
else
    echo "⚠️  xcodebuild not found. Install Xcode from the Mac App Store."
    exit 1
fi

# Check CocoaPods
if ! command -v pod &> /dev/null; then
    echo ""
    echo "📦 CocoaPods not found. Installing..."
    sudo gem install cocoapods
    echo "✅ CocoaPods installed"
else
    POD_VERSION=$(pod --version)
    echo "✅ CocoaPods $POD_VERSION"
fi

# Install npm dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install

# Add iOS platform if not present
if [ ! -d "ios" ] || [ ! -f "ios/App/App/Info.plist" ]; then
    echo ""
    echo "📱 Adding iOS platform..."
    npx cap add ios
else
    echo "✅ iOS platform already added"
fi

# Install CocoaPods dependencies
echo ""
echo "🍫 Installing CocoaPods dependencies..."
cd ios/App && pod install --repo-update
cd ../..

# Sync web assets
echo ""
echo "🔄 Syncing web assets..."
npx cap sync ios

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Next steps:"
echo "  1. Open Xcode: npm run deploy:ios"
echo "  2. Configure signing in Xcode (Signing & Capabilities)"
echo "  3. Or build directly: npm run build:ios"
echo ""
echo "To run on a simulator:"
echo "  npx cap run ios"
echo ""
echo "Documentation: APP_STORE_GUIDE.md"
