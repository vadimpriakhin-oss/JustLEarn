# Build Guide

Complete instructions for building **JustLEarn** locally and preparing it for the App Store and Google Play using [Capacitor](https://capacitorjs.com).

---

## Prerequisites

| Tool | Purpose | Install |
|---|---|---|
| Node.js ≥ 18 | JavaScript runtime | [nodejs.org](https://nodejs.org) |
| Git | Version control | [git-scm.com](https://git-scm.com) |
| Android Studio | Android builds | [developer.android.com/studio](https://developer.android.com/studio) |
| Xcode (macOS only) | iOS builds | Mac App Store |
| CocoaPods (macOS only) | iOS dependency manager | `sudo gem install cocoapods` |

---

## Installation

```bash
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn
npm install
```

---

## Adding Platforms (First Time Only)

```bash
npx cap add ios      # Creates the ios/ folder
npx cap add android  # Creates the android/ folder
```

---

## Syncing Web Assets to Native Projects

Run this every time you change the web app:

```bash
npm run sync            # Sync to both platforms
npm run sync:ios        # iOS only
npm run sync:android    # Android only
```

---

## Building for iOS

```bash
npm run build:ios      # Build + sync + compile iOS project
npm run deploy:ios     # Build + sync + compile + open in Xcode
```

After opening Xcode:
1. Select **Any iOS Device (arm64)** as the destination.
2. Click **Product → Archive** to create a distributable build.

See [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) for full deployment instructions.

---

## Building for Android

```bash
npm run build:android      # Build + sync + compile Android project
npm run deploy:android     # Build + sync + compile + open in Android Studio
```

To generate a signed AAB manually:

```bash
cd android
./gradlew bundleRelease
```

See [GOOGLE_PLAY_GUIDE.md](./GOOGLE_PLAY_GUIDE.md) for full deployment instructions.

---

## Running on Emulators / Physical Devices

### iOS Simulator (macOS)

```bash
npx cap run ios
```

### Android Emulator

```bash
npx cap run android
```

Make sure an emulator is running (or a device is connected via USB with USB debugging enabled) before running the command.

---

## Required Materials

- **For Android:** Google Play Developer Account · Keystore file (see [GOOGLE_PLAY_GUIDE.md](./GOOGLE_PLAY_GUIDE.md))
- **For iOS:** Apple Developer Account · App icons · Privacy Policy (see [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md))

---

## Helpful Links

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Docs](https://developer.android.com/studio/run)
- [Apple Developer Docs](https://developer.apple.com/documentation/xcode/distributing-your-app)
- [Quick Start](./QUICK_START.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)