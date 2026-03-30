# BUILD_GUIDE.md — Deploying JustLEarn to iOS and Android

This guide walks you through building and publishing **JustLEarn** as a native mobile app using [Capacitor](https://capacitorjs.com/).

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 18 | https://nodejs.org |
| npm | ≥ 9 | Included with Node.js |
| Xcode | ≥ 15 | macOS only — required for iOS builds |
| Android Studio | ≥ Hedgehog | Required for Android builds |
| CocoaPods | latest | `sudo gem install cocoapods` |

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Initialise Capacitor (first time only)

```bash
npx cap init JustLEarn com.justlearn.app --web-dir .
```

---

## 3. Add Mobile Platforms

```bash
npx cap add ios
npx cap add android
```

---

## 4. Sync Web Assets to Native Projects

Run this command every time you change the web source files:

```bash
npx cap sync
```

---

## 5. Build and Run on iOS

```bash
npx cap open ios
```

This opens Xcode. From there:

1. Select your signing team under **Signing & Capabilities**.
2. Choose a simulator or a connected device.
3. Press **Run** (▶).

To publish to the App Store:
1. Set the version and build number in Xcode.
2. Select **Any iOS Device (arm64)** as the target.
3. Go to **Product → Archive**.
4. Open **Organizer**, then click **Distribute App** and follow the wizard.

---

## 6. Build and Run on Android

```bash
npx cap open android
```

This opens Android Studio. From there:

1. Wait for Gradle sync to finish.
2. Click **Run** (▶) to launch on an emulator or device.

To publish to Google Play:
1. Go to **Build → Generate Signed Bundle / APK**.
2. Choose **Android App Bundle (AAB)** — required for Play Store.
3. Create or select a keystore, fill in the details, and build.
4. Upload the `.aab` file in Google Play Console under **Production**.

---

## 7. App Icons

Place your app icon files in `assets/icons/`. The manifest references these sizes:

| File | Size |
|------|------|
| `icon-72x72.png` | 72 × 72 |
| `icon-96x96.png` | 96 × 96 |
| `icon-128x128.png` | 128 × 128 |
| `icon-144x144.png` | 144 × 144 |
| `icon-152x152.png` | 152 × 152 (iOS touch icon) |
| `icon-192x192.png` | 192 × 192 |
| `icon-384x384.png` | 384 × 384 |
| `icon-512x512.png` | 512 × 512 |

You can generate all sizes from a single 1024 × 1024 source image using [PWABuilder](https://www.pwabuilder.com/) or the Capacitor Assets CLI:

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate
```

---

## 8. PWA (Progressive Web App)

The app can also be installed directly from a browser without app stores:

1. Host the project on any static web server (e.g. GitHub Pages, Netlify, Vercel).
2. Visit the URL in Chrome/Edge/Safari.
3. Use **Add to Home Screen** from the browser menu.

---

## Useful Links

- [Capacitor documentation](https://capacitorjs.com/docs)
- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
- [PWABuilder](https://www.pwabuilder.com/)
