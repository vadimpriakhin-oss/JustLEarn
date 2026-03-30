# App Store Guide — iOS Deployment

Complete guide for packaging **JustLEarn** as an iOS app and publishing it to the Apple App Store.

---

## Prerequisites

| Requirement | Details |
|---|---|
| macOS | Required for Xcode |
| Xcode | Latest stable version (from Mac App Store) |
| Apple Developer Account | [developer.apple.com](https://developer.apple.com) — $99/year |
| Node.js ≥ 18 | [nodejs.org](https://nodejs.org) |
| CocoaPods | `sudo gem install cocoapods` |

---

## 1. First-time iOS Setup

```bash
# Install Capacitor CLI
npm install

# Add iOS platform
npx cap add ios

# Sync web assets
npx cap sync ios
```

This generates an `ios/` folder containing the Xcode project.

---

## 2. Open the Project in Xcode

```bash
npx cap open ios
```

Or open `ios/App/App.xcworkspace` directly in Xcode.

> **Important:** Always open the `.xcworkspace` file, not the `.xcodeproj` file.

---

## 3. Configure App Identity

In Xcode:

1. Select the **App** project in the Navigator.
2. Go to **Signing & Capabilities** tab.
3. Set:
   - **Bundle Identifier:** `com.justlearn.app`
   - **Display Name:** `JustLEarn`
   - **Version:** `1.0.0`
   - **Build:** `1`
4. Select your **Team** (Apple Developer account).
5. Enable **Automatically manage signing** for development.

---

## 4. Add App Icons

1. In Xcode Navigator, open `App/Assets.xcassets/AppIcon`.
2. Drag-and-drop the icons from `assets/icons/` into the corresponding slots.

Required icon sizes:
| Slot | Size |
|---|---|
| iPhone Notification | 20×20, 40×40, 60×60 |
| iPhone Settings | 29×29, 58×58, 87×87 |
| iPhone Spotlight | 40×40, 80×80, 120×120 |
| iPhone App | 60×60, 120×120, 180×180 |
| iPad | Various (see Xcode slots) |
| App Store | 1024×1024 |

Use the provided `assets/icons/icon-1024x1024.png` as the base and resize with Preview or an online tool.

---

## 5. Configure Info.plist

Merge the settings from [`ios-info.plist`](./ios-info.plist) into `ios/App/App/Info.plist`:

- Bundle ID: `com.justlearn.app`
- Display Name: `JustLEarn`
- Minimum iOS version: `14.0`
- Supported orientations: Portrait only

---

## 6. Create a Production Certificate and Provisioning Profile

1. Log in to [Apple Developer Portal](https://developer.apple.com/account).
2. Go to **Certificates, IDs & Profiles**.
3. Create an **App ID** with Bundle ID `com.justlearn.app`.
4. Create a **Distribution Certificate** (iOS Distribution).
5. Create a **Provisioning Profile** → App Store → select your App ID.
6. Download and double-click the profile to install it in Xcode.

---

## 7. Archive for Distribution

1. In Xcode, select **Any iOS Device (arm64)** as the destination.
2. Menu → **Product → Archive**.
3. Wait for the build to complete.
4. In the **Organizer** window, select your archive.
5. Click **Distribute App** → **App Store Connect** → **Upload**.

---

## 8. Submit via App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com).
2. Create a new app: **My Apps → +**.
3. Fill in:
   - **Name:** JustLEarn
   - **Bundle ID:** com.justlearn.app
   - **SKU:** justlearn-001
   - **Primary Language:** English
4. Go to the **App Information** tab and complete all metadata.
5. Under **Pricing and Availability**, set the price.
6. Go to the version page and add:
   - App description
   - Keywords
   - Screenshots (at least iPhone 6.5" and 5.5")
   - Support URL and Privacy Policy URL
7. Select the build uploaded from Xcode.
8. Click **Submit for Review**.

---

## 9. TestFlight Beta Testing

1. After uploading a build, go to **App Store Connect → TestFlight**.
2. Add **Internal Testers** (up to 25 people with Apple Developer roles).
3. Add **External Testers** (up to 10,000) — requires Beta App Review.
4. Share the TestFlight link with testers.

---

## 10. Troubleshooting

| Issue | Solution |
|---|---|
| Code signing error | Ensure correct Team and provisioning profile selected |
| `pod install` fails | Run `sudo gem install cocoapods && pod install` in `ios/App` |
| WebView blank screen | Check `capacitor.config.json` → `webDir` is correct |
| App rejected | Review [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) |

---

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple Developer Portal](https://developer.apple.com/account)
- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
