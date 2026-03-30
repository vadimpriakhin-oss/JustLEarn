# App Store (iOS) Submission Guide

Complete guide for submitting JustLEarn to the Apple App Store.

---

## Prerequisites

- Mac computer (required for Xcode)
- [Xcode](https://developer.apple.com/xcode/) 15 or later
- [Apple Developer Account](https://developer.apple.com/programs/) ($99/year)
- Node.js 18+

---

## Step 1 — Set Up Your Apple Developer Account

1. Sign up at https://developer.apple.com/programs/
2. Pay the $99/year membership fee.
3. Wait for approval (usually same day for individuals).

---

## Step 2 — Create App ID in Apple Developer Portal

1. Go to https://developer.apple.com/account/
2. Navigate to **Certificates, Identifiers & Profiles → Identifiers**
3. Click **+** to create a new App ID
4. Select **App** → Continue
5. Enter:
   - **Description**: JustLEarn
   - **Bundle ID**: `com.justlearn.app` (Explicit)
6. Enable capabilities as needed (Push Notifications, etc.)
7. Click **Continue → Register**

---

## Step 3 — Create App in App Store Connect

1. Go to https://appstoreconnect.apple.com/
2. Click **My Apps → +** (New App)
3. Fill in:
   - **Platforms**: iOS
   - **Name**: JustLEarn
   - **Primary Language**: English
   - **Bundle ID**: `com.justlearn.app`
   - **SKU**: `justlearn-ios-001`
4. Click **Create**

---

## Step 4 — Install Dependencies & Add iOS Platform

```bash
# Clone the repository
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn

# Install npm dependencies
npm install

# Add iOS platform (first time only)
npm run add:ios

# Install CocoaPods (first time only)
sudo gem install cocoapods
cd ios/App && pod install && cd ../..
```

---

## Step 5 — Configure Signing in Xcode

```bash
# Open the project in Xcode
npm run open:ios
```

In Xcode:
1. Select the **App** target in the project navigator
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** from the dropdown
5. Ensure **Bundle Identifier** is `com.justlearn.app`

---

## Step 6 — Add App Icons

Place your 1024×1024 PNG icon at `assets/icons/icon-1024.png`, then run:

```bash
npm run icons:generate
npm run cap:sync
```

Alternatively, drag icons manually into Xcode:
- Select **App → Assets.xcassets → AppIcon** in the project navigator
- Drag the correct PNG sizes into each slot

Required sizes: 20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024 px

---

## Step 7 — Configure App Version

In Xcode:
1. Select the **App** target
2. Under **General → Identity**:
   - **Version**: 1.0.0
   - **Build**: 1

Or edit `ios/App/App/Info.plist`:
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

---

## Step 8 — Archive and Upload

In Xcode:
1. Set the scheme to **Any iOS Device (arm64)**
2. Click **Product → Archive**
3. Wait for the build to complete
4. In the Organizer window, select your archive
5. Click **Distribute App → App Store Connect → Upload**
6. Follow the prompts

---

## Step 9 — Submit for Review in App Store Connect

1. Go to https://appstoreconnect.apple.com/ → Your App
2. Under **iOS App**, click the build you just uploaded
3. Fill in all required metadata:
   - **App Description** (up to 4000 characters)
   - **Keywords** (up to 100 characters)
   - **Support URL**: https://github.com/vadimpriakhin-oss/JustLEarn
   - **Marketing URL** (optional): https://just-l-earn.vercel.app
   - **Privacy Policy URL**: link to your PRIVACY_POLICY.md (hosted)
4. Upload **Screenshots** (required sizes):
   - 6.5" iPhone: 1284×2778
   - 5.5" iPhone: 1242×2208
   - 12.9" iPad Pro: 2048×2732
5. Set **Age Rating** → answer the questionnaire
6. Set **Pricing** → Free
7. Click **Submit for Review**

---

## TestFlight (Beta Testing)

To distribute a beta version before App Store release:
1. Upload the build (same as Step 8)
2. In App Store Connect → **TestFlight**
3. Add internal or external testers
4. External testers require a brief review (~1 day)

---

## Useful Links

- [App Store Connect](https://appstoreconnect.apple.com/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
