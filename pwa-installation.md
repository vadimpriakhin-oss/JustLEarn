# JustLEarn — PWA Installation Guide

## Installing on iOS (iPhone / iPad)

1. Open **Safari** and navigate to the JustLEarn website.
2. Tap the **Share** button (rectangle with an arrow pointing up) in the bottom toolbar.
3. Scroll down in the share sheet and tap **"Add to Home Screen"**.
4. Edit the name if desired, then tap **"Add"** in the top-right corner.
5. JustLEarn will appear on your Home Screen like a native app.

> **Note:** The app must be added through Safari. Chrome and other browsers on iOS do not support "Add to Home Screen" for PWAs.

---

## Installing on Android (Chrome)

1. Open **Chrome** and navigate to the JustLEarn website.
2. Tap the **three-dot menu** (⋮) in the top-right corner.
3. Tap **"Add to Home screen"** or **"Install app"**.
4. Confirm by tapping **"Add"** or **"Install"**.
5. JustLEarn will appear on your Home Screen and in the App Drawer.

> **Tip:** Chrome may also show an **"Install"** banner at the bottom of the screen automatically.

---

## Submitting to App Stores

### Apple App Store (via PWABuilder / Xcode)

1. Visit [PWABuilder.com](https://www.pwabuilder.com/) and enter your site URL.
2. Select **iOS** and click **"Package For Store"**.
3. Download the generated Xcode project.
4. Open the project in Xcode (macOS + Apple Developer Account required).
5. Set your Bundle Identifier and version number.
6. Archive the app (**Product → Archive**) and upload via **Xcode Organizer**.
7. Complete the App Store Connect listing (screenshots, description, category).
8. Submit for review.

**Requirements:**
- Apple Developer Program membership (~$99/year)
- Mac running macOS with Xcode installed
- App Store Connect account

### Google Play Store (via PWABuilder / Bubblewrap)

1. Visit [PWABuilder.com](https://www.pwabuilder.com/) and enter your site URL.
2. Select **Android** and click **"Package For Store"**.
3. Download the generated Android package (APK/AAB).
4. Sign the package with your keystore (`keytool` / Android Studio).
5. Upload the AAB to [Google Play Console](https://play.google.com/console).
6. Fill in store listing (screenshots, description, category: Education).
7. Submit for review.

**Requirements:**
- Google Play Developer account (~$25 one-time)
- Java + Android SDK (or use PWABuilder's online build)

---

## Offline Support

JustLEarn uses a **Service Worker** to cache all assets locally. Once you have visited the app online at least once, it will work completely **offline**:

- All quiz modes are available offline
- Custom terms you have added are saved in `localStorage`
- A friendly offline page is shown if navigation fails

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Add to Home Screen" not visible | Make sure you are using Safari on iOS or Chrome on Android |
| App not updating after deployment | Clear site data in Settings → Safari/Chrome → Advanced → Website Data, then reload |
| Offline page shows instead of app | Visit the app once while online to populate the cache |
| Icon looks blurry | Ensure `icons/icon-192.png` and `icons/icon-512.png` exist and are correct size |
| Service Worker not registering | Check that the site is served over **HTTPS** (required for Service Workers) |
