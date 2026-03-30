# App Store Deployment Guide (iOS)

This guide walks you through preparing and submitting JustLEarn to the Apple App Store.

---

## Prerequisites

- **Mac computer** with macOS 13 (Ventura) or later
- **Xcode 15+** installed from the Mac App Store
- **Apple Developer Account** ($99/year) at [developer.apple.com](https://developer.apple.com)
- **Node.js 18+** and npm installed
- **CocoaPods** installed (`sudo gem install cocoapods`)

---

## Step 1: Set Up Your Apple Developer Account

1. Enrol at [developer.apple.com/programs](https://developer.apple.com/programs/)
2. After approval, sign in to [App Store Connect](https://appstoreconnect.apple.com)
3. Create a new app:
   - Platform: **iOS**
   - Name: **JustLEarn**
   - Bundle ID: **com.justlearn.app**
   - SKU: **JUSTLEARN001**

---

## Step 2: Install Dependencies and Add iOS Platform

```bash
# Install npm dependencies
npm install

# Add iOS platform (first time only)
npm run cap:add:ios

# Or manually:
npx cap add ios
```

---

## Step 3: Configure Signing in Xcode

1. Open the iOS project:
   ```bash
   npx cap open ios
   ```
2. In Xcode, select the **App** target → **Signing & Capabilities**
3. Enable **Automatically manage signing**
4. Select your **Team** from the dropdown
5. Xcode will create provisioning profiles automatically

---

## Step 4: Add App Icons

App icons must be PNG files (no transparency for App Store icons):

| Size | Usage |
|------|-------|
| 1024×1024 | App Store |
| 180×180 | iPhone @3x |
| 120×120 | iPhone @2x |
| 167×167 | iPad Pro @2x |
| 152×152 | iPad @2x |
| 76×76 | iPad @1x |
| 87×87 | iPhone Settings @3x |
| 58×58 | iPhone Settings @2x |
| 40×40 | iPhone Spotlight @2x |
| 80×80 | iPhone Spotlight @3x |

Use a tool like [App Icon Generator](https://appicon.co/) to convert the SVG icons in `assets/icons/` to all required PNG sizes.

Place generated icons in:
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

---

## Step 5: Build for Release

```bash
# Build and copy web assets to iOS
npm run build:ios
```

In Xcode:
1. Select **Any iOS Device (arm64)** as the target
2. Menu: **Product** → **Archive**
3. Wait for the archive to complete (5–10 minutes)

---

## Step 6: Upload to App Store Connect

After archiving:
1. Xcode Organizer opens automatically
2. Select the archive and click **Distribute App**
3. Choose **App Store Connect** → **Upload**
4. Follow the prompts to validate and upload

---

## Step 7: Submit for Review on TestFlight (Recommended)

1. In App Store Connect → **TestFlight** tab
2. Add internal testers (team members)
3. For external testing: click **+** next to External Groups
4. Submit for **Beta App Review** (1–3 days)
5. Share the TestFlight link with beta testers

---

## Step 8: Submit for Production

1. In App Store Connect → **App Store** tab
2. Fill in all metadata:
   - **Name**: JustLEarn
   - **Subtitle**: Learn English for Exams
   - **Category**: Education
   - **Privacy Policy URL**: link to your privacy policy
   - **Description**: (see below)
   - **Keywords**: english, learn, exam, vocabulary, quiz, education
3. Upload screenshots for all required device sizes:
   - 6.7" iPhone (1290×2796 or 1284×2778)
   - 6.5" iPhone (1242×2688)
   - 5.5" iPhone (1242×2208)
   - 12.9" iPad Pro (2048×2732)
4. Set **Pricing and Availability** (Free)
5. Click **Submit for Review**

### Suggested App Description
```
JustLEarn is an interactive vocabulary learning app designed for English exam preparation.

Features:
• Multiple quiz modes: True/False, Multiple Choice, Fill in the Blank, Drag & Drop
• 500+ vocabulary words with definitions
• Progress tracking and statistics
• Offline support
• Dark mode interface optimised for studying

Perfect for students preparing for IELTS, TOEFL, SAT, GRE, and other English proficiency exams.
```

---

## App Review Requirements

- Privacy Policy URL is **required**
- The app must work on the latest iOS version
- All features described must be functional
- No placeholder content
- Review time: typically **1–3 business days**

---

## Troubleshooting

### "No provisioning profile found"
→ In Xcode: **Preferences** → **Accounts** → Add your Apple ID

### "App icon validation failed"
→ Ensure icons are PNG, no transparency, exact pixel dimensions

### "Binary rejected by App Store"
→ Check App Store Connect for specific rejection reasons in **Resolution Center**

### Build errors after `npx cap sync`
→ Run `cd ios/App && pod install --repo-update`
