# Build Guide — JustLEarn Mobile App

This guide walks through setting up [Capacitor](https://capacitorjs.com/) to package the JustLEarn web application for iOS (App Store) and Android (Google Play).

---

## Prerequisites

| Tool | Required for | Link |
|------|-------------|------|
| Node.js ≥ 16 | All platforms | https://nodejs.org/ |
| Xcode ≥ 15 | iOS only (macOS required) | https://developer.apple.com/xcode/ |
| Android Studio | Android only | https://developer.android.com/studio |
| CocoaPods | iOS only | `sudo gem install cocoapods` |

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Add Native Platforms

Run these commands once to create the `ios/` and `android/` project directories:

```bash
npm run cap:add:ios      # creates ios/ directory
npm run cap:add:android  # creates android/ directory
```

> **Note:** The `ios/` and `android/` directories are listed in `.gitignore` and are not committed to Git. Each developer or CI environment must run these commands locally.

---

## 3. Sync Web Assets to Native Projects

After any change to the web source files, sync them into the native projects:

```bash
npm run cap:sync
```

---

## 4. Open in Native IDE

```bash
npm run cap:open:ios      # opens Xcode
npm run cap:open:android  # opens Android Studio
```

---

## 5. App Icons and Splash Screens

Use the [@capacitor/assets](https://capacitorjs.com/docs/guides/splash-screens-and-icons) tool to generate all required icon and splash screen sizes from a single source image:

```bash
npm install --save-dev @capacitor/assets

# Place your source files:
#   assets/icon.png       (1024×1024 px, no transparency)
#   assets/splash.png     (2732×2732 px)

npx capacitor-assets generate
```

---

## 6. Build Release Versions

```bash
npm run build:ios      # builds iOS release via Xcode
npm run build:android  # builds Android release via Android Studio
```

---

## 7. Deploying to the App Store (iOS)

1. Enrol in the [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
2. In Xcode, set your **Team** under *Signing & Capabilities*.
3. Choose *Product → Archive* to create an archive.
4. In the Organizer window, click **Distribute App** and follow the upload wizard.
5. Complete the submission in [App Store Connect](https://appstoreconnect.apple.com/).

Reference: [Distributing your app — Apple Documentation](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)

---

## 8. Deploying to Google Play (Android)

1. Create a [Google Play Developer Account](https://play.google.com/console/) ($25 one-time fee).
2. In Android Studio, generate a signed App Bundle (*Build → Generate Signed Bundle / APK*).
3. Upload the `.aab` file in the Google Play Console under *Production → Create new release*.
4. Fill in the store listing and submit for review.

Reference: [Publish your app — Android Documentation](https://developer.android.com/studio/publish)

---

## Helpful Links

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [App Store Connect Help](https://appstoreconnect.apple.com/)
- [Google Play Console Help](https://play.google.com/console/about/)
