# Quick Start

Get **JustLEarn** running as a native iOS or Android app in minutes.

---

## Requirements

- Node.js ≥ 18
- **iOS:** macOS + Xcode + CocoaPods (`sudo gem install cocoapods`)
- **Android:** Android Studio

---

## Setup

```bash
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn
npm install
```

---

## Build Commands

```bash
npm run build:ios       # Build web assets → sync → build iOS project
npm run build:android   # Build web assets → sync → build Android project

npm run deploy:ios      # Build iOS project and open in Xcode
npm run deploy:android  # Build Android project and open in Android Studio

npm run sync            # Sync web assets to both platforms
npm run sync:ios        # Sync web assets to iOS only
npm run sync:android    # Sync web assets to Android only
```

---

## First-time Platform Setup

Before building for the first time, add the platform:

```bash
npx cap add ios      # Generates the ios/ folder
npx cap add android  # Generates the android/ folder
```

---

## Next Steps

| Goal | Guide |
|---|---|
| Publish to App Store | [APP_STORE_GUIDE.md](./APP_STORE_GUIDE.md) |
| Publish to Google Play | [GOOGLE_PLAY_GUIDE.md](./GOOGLE_PLAY_GUIDE.md) |
| Full build instructions | [BUILD_GUIDE.md](./BUILD_GUIDE.md) |
| Manage versions | [VERSION_MANAGEMENT.md](./VERSION_MANAGEMENT.md) |
| Pre-release checklist | [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) |
