# BUILD_GUIDE.md

## Local Setup and Build Guide for JustLEarn

This guide covers local installation, building web and mobile versions, using Capacitor, and running on emulators.

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **npm 9+** — bundled with Node.js
- **Git** — [git-scm.com](https://git-scm.com/)
- For iOS: **Mac** with Xcode 15+ and CocoaPods
- For Android: **Android Studio** with Android SDK API 34+

---

## 1. Local Installation

```bash
# Clone the repository
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn

# Install dependencies (Capacitor + http-server)
npm install

# Run the web app locally
npm run dev
# Open http://localhost:8000
```

---

## 2. Using Capacitor

[Capacitor](https://capacitorjs.com/) wraps the web app into a native iOS/Android container.

### First-time Platform Setup

```bash
# Add iOS platform (requires Mac + Xcode)
npm run cap:add:ios

# Add Android platform (requires Android Studio)
npm run cap:add:android
```

### Synchronise Web Assets to Native Projects

After making changes to web files, sync them to the native projects:

```bash
npm run sync
# This runs: npx cap sync
```

---

## 3. Building for Mobile

### iOS

```bash
# Build web assets + copy to iOS + open Xcode
npm run deploy:ios

# Or step by step:
npm run build:web          # "Web build complete"
npx cap copy ios           # Copy web assets to iOS project
npx cap build ios          # Build iOS (requires Xcode)
npx cap open ios           # Open in Xcode
```

### Android

```bash
# Build web assets + copy to Android + open Android Studio
npm run deploy:android

# Or step by step:
npm run build:web          # "Web build complete"
npx cap copy android       # Copy web assets to Android project
npx cap build android      # Build Android (requires Android Studio)
npx cap open android       # Open in Android Studio
```

---

## 4. Running on Emulators

### iOS Simulator (Mac only)

1. Open Xcode: `npx cap open ios`
2. Select a simulator from the device menu (e.g. iPhone 15 Pro)
3. Press **▶ Run** (⌘R)

Or via CLI:
```bash
npx cap run ios
```

### Android Emulator

1. In Android Studio: **Tools** → **Device Manager** → **Create Device**
2. Choose a device profile (e.g. Pixel 8)
3. Download a system image (API 34 recommended)
4. Start the emulator

Then run:
```bash
npx cap run android
```

Or open Android Studio: `npx cap open android` → click **▶ Run**

---

## 5. Project Structure

```
JustLEarn/
├── index.html              # Main HTML entry point
├── app.js                  # Application logic
├── data.js                 # Vocabulary data
├── styles.css              # Styles
├── service-worker.js       # PWA service worker
├── manifest.json           # PWA manifest
├── capacitor.config.json   # Capacitor configuration
├── package.json            # npm scripts and dependencies
├── assets/
│   ├── icons/              # App icons (SVG source files)
│   └── splash/             # Splash screens (SVG source files)
├── ios/
│   └── App/
│       └── App/
│           └── Info.plist  # iOS app configuration
├── android/
│   └── app/
│       └── build.gradle    # Android build configuration
├── scripts/
│   ├── setup-ios.sh        # iOS environment setup script
│   └── setup-android.sh    # Android environment setup script
└── .github/
    └── workflows/
        └── build.yml       # CI/CD workflow
```

---

## 6. Available npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local web server on port 8000 |
| `npm run build` | Alias for `build:web` |
| `npm run build:web` | Web build (placeholder) |
| `npm run build:ios` | Build web + copy to iOS |
| `npm run build:android` | Build web + copy to Android |
| `npm run deploy:ios` | Build + open in Xcode |
| `npm run deploy:android` | Build + open in Android Studio |
| `npm run sync` | Sync all platforms |
| `npm run cap:add:ios` | Add iOS platform |
| `npm run cap:add:android` | Add Android platform |

---

## 7. Helpful Links

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Build Guide](./APP_STORE_GUIDE.md)
- [Android Build Guide](./GOOGLE_PLAY_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Version Management](./VERSION_MANAGEMENT.md)
