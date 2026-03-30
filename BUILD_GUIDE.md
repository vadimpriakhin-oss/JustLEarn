# JustLEarn – Build & Deployment Guide

This guide explains how to build JustLEarn as a native iOS and Android app using [Capacitor](https://capacitorjs.com/) and publish it to the Apple App Store and Google Play Store.

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or later | https://nodejs.org |
| npm | 9 or later | bundled with Node.js |
| Xcode | 15 or later | Mac App Store (iOS only) |
| Android Studio | Hedgehog or later | https://developer.android.com/studio |
| CocoaPods | 1.14 or later | `sudo gem install cocoapods` (iOS only) |

## 1. Install dependencies

```bash
npm install
```

## 2. Add mobile platforms

```bash
npx cap add ios
npx cap add android
```

## 3. Sync web assets into native projects

Run this command every time you change web files:

```bash
npx cap sync
```

## 4. Build for iOS

```bash
npx cap open ios
```

This opens Xcode. In Xcode:

1. Select your development team under **Signing & Capabilities**.
2. Choose **Any iOS Device** as the build target.
3. Go to **Product → Archive** to create a distributable build.
4. Use **Xcode Organizer** (Window → Organizer) to upload the archive to App Store Connect.

### App Store submission checklist

- [ ] Bundle ID matches `appId` in `capacitor.config.json` (`com.justlearn.app`)
- [ ] App icons added to `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- [ ] Privacy usage descriptions added in `Info.plist` (if applicable)
- [ ] App reviewed in App Store Connect

## 5. Build for Android

```bash
npx cap open android
```

This opens Android Studio. In Android Studio:

1. Wait for Gradle sync to complete.
2. Go to **Build → Generate Signed Bundle / APK**.
3. Choose **Android App Bundle** (recommended for Play Store).
4. Create or select a keystore, then build the release bundle.
5. Upload the `.aab` file to Google Play Console.

### Play Store submission checklist

- [ ] Application ID matches `appId` in `capacitor.config.json` (`com.justlearn.app`)
- [ ] App icons added to `android/app/src/main/res/mipmap-*/`
- [ ] `minSdkVersion` and `targetSdkVersion` set in `android/app/build.gradle`
- [ ] Release keystore stored securely (never commit to version control)
- [ ] App reviewed in Google Play Console

## 6. PWA (no native build required)

The app is already configured as a PWA. Simply host the files on any HTTPS server. Users can install the app directly from the browser via the browser's "Add to Home Screen" prompt.

```
index.html
app.js
data.js
styles.css
manifest.json
service-worker.js
assets/icon-192.png
assets/icon-512.png
```

## Project structure

```
JustLEarn/
├── assets/
│   ├── icon-192.png      # PWA / Android icon
│   └── icon-512.png      # PWA / App Store icon
├── app.js                # Application logic
├── data.js               # Quiz data
├── index.html            # Entry point
├── manifest.json         # PWA manifest
├── service-worker.js     # Offline caching
├── styles.css            # Styling
├── package.json          # Node dependencies
├── capacitor.config.json # Capacitor configuration
└── BUILD_GUIDE.md        # This file
```

## Useful Capacitor commands

```bash
npx cap sync          # Copy web files to native projects
npx cap update        # Update Capacitor plugins
npx cap doctor        # Check environment setup
npx cap ls            # List installed platforms
```
