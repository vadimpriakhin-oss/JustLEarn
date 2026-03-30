# Build Guide

Complete instructions for setting up, building, and deploying JustLEarn to iOS App Store and Google Play.

---

## Overview

JustLEarn is a web application packaged as a native mobile app using [Capacitor](https://capacitorjs.com/). The web app runs inside a native WebView shell for both iOS and Android.

```
Web App (HTML/CSS/JS)
        ↓
   Capacitor
        ↓
 ┌──────┴──────┐
 │             │
iOS App    Android App
(Xcode)  (Android Studio)
```

---

## Prerequisites

| Tool | Version | Required for |
|------|---------|-------------|
| [Node.js](https://nodejs.org/) | 18+ | All |
| [npm](https://npmjs.com/) | 9+ | All |
| [Xcode](https://developer.apple.com/xcode/) | 15+ | iOS only (Mac required) |
| [CocoaPods](https://cocoapods.org/) | 1.13+ | iOS only |
| [Android Studio](https://developer.android.com/studio) | Latest | Android only |
| JDK | 17 | Android only |

---

## Initial Setup

```bash
# 1. Clone the repository
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn

# 2. Install dependencies
npm install
```

---

## iOS Build

### First-time setup

```bash
# Add iOS platform (creates ios/ directory)
npm run add:ios

# Install CocoaPods dependencies
cd ios/App && pod install && cd ../..
```

### Sync and open in Xcode

```bash
npm run build:ios
```

This syncs your web app into the native project and opens Xcode.

### In Xcode

1. Select **Any iOS Device (arm64)** as the target
2. Set up **Signing & Capabilities** with your Apple Developer team
3. Click **Product → Archive** to create a release build
4. Use the **Organizer** to upload to App Store Connect

See [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) for the full submission process.

---

## Android Build

### First-time setup

```bash
# Add Android platform (creates android/ directory)
npm run add:android

# Configure signing
cp android/keystore.properties.example android/keystore.properties
# Edit android/keystore.properties with your keystore credentials
```

### Generate keystore (first time only)

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore android/my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

### Sync and open in Android Studio

```bash
npm run build:android
```

This syncs your web app into the native project and opens Android Studio.

### In Android Studio

1. Wait for Gradle sync to complete
2. Select **Build → Generate Signed Bundle / APK**
3. Choose **Android App Bundle (.aab)**
4. Select your keystore and enter credentials
5. Select **release** build variant
6. Click **Finish**

See [GOOGLE_PLAY_GUIDE.md](./GOOGLE_PLAY_GUIDE.md) for the full submission process.

---

## App Icons & Splash Screens

Place source images in the `assets/` directory:
- `assets/icons/icon.svg` (or `icon.png`) — 1024×1024 minimum
- `assets/splash/splash.svg` (or `splash.png`) — 2732×2732

Then generate all required sizes:

```bash
npm run icons:generate
npm run cap:sync
```

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run cap:sync` | Sync web app to iOS and Android |
| `npm run build:ios` | Sync and open iOS in Xcode |
| `npm run build:android` | Sync and open Android in Android Studio |
| `npm run icons:generate` | Generate all icon/splash sizes |
| `npm run version:check` | Print current app version |
| `npm run add:ios` | Add iOS platform (first time) |
| `npm run add:android` | Add Android platform (first time) |

---

## Updating the App

After making changes to the web app:

```bash
# Sync changes to both platforms
npm run cap:sync

# Then rebuild using Xcode / Android Studio
```

---

## CI/CD

The repository includes a GitHub Actions workflow (`.github/workflows/build.yml`) that:
- Validates configuration on every push/PR
- Builds an Android AAB on pushes to `main`
- Builds an iOS archive on pushes to `main` (requires Mac runner)

Required GitHub Secrets for CI builds:
- `ANDROID_KEYSTORE_FILE` — base64-encoded keystore
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

---

## Additional Documentation

- [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) — iOS App Store submission
- [GOOGLE_PLAY_GUIDE.md](./GOOGLE_PLAY_GUIDE.md) — Google Play submission
- [VERSION.md](./VERSION.md) — Version management and changelog
- [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) — Privacy policy
