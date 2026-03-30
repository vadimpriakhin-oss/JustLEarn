# Deployment Checklist

Use this checklist before every release to App Store and Google Play.

---

## Pre-Release Checklist

### ✅ Code & Functionality

- [ ] All new features are implemented and tested
- [ ] No console errors or warnings in the browser
- [ ] App works in offline mode (service worker)
- [ ] All quiz modes work correctly (True/False, Multiple Choice, Fill in the Blank, Drag & Drop)
- [ ] Progress saving works across sessions
- [ ] App handles edge cases (empty data, network loss)

### ✅ Version Numbers Updated

- [ ] `package.json` → `"version"` updated
- [ ] `ios/App/App/Info.plist` → `CFBundleShortVersionString` updated
- [ ] `ios/App/App/Info.plist` → `CFBundleVersion` incremented
- [ ] `android/app/build.gradle` → `versionName` updated
- [ ] `android/app/build.gradle` → `versionCode` incremented

### ✅ Web Assets Synced

- [ ] `npm run build:web` completes without errors
- [ ] `npm run sync` completes without errors
- [ ] Web assets visible in `ios/App/App/public/` and `android/app/src/main/assets/public/`

### ✅ Icons Validated

- [ ] App icon is PNG format (no transparency for iOS App Store icon)
- [ ] All required icon sizes are present for iOS
- [ ] All required icon sizes are present for Android (mipmap folders)
- [ ] App Store icon is 1024×1024 PNG
- [ ] Google Play icon is 512×512 PNG
- [ ] Feature graphic created for Google Play (1024×500 PNG)

### ✅ Metadata Complete

- [ ] App name is correct: **JustLEarn**
- [ ] Bundle ID / Application ID: **com.justlearn.app**
- [ ] Short description written (max 80 chars for Google Play)
- [ ] Full description written (max 4000 chars)
- [ ] Keywords / search tags prepared
- [ ] Privacy Policy URL is live and accessible
- [ ] Screenshots prepared for all required device sizes
- [ ] Category set: **Education**

### ✅ Legal & Compliance

- [ ] Privacy Policy is up to date
- [ ] Data collection disclosures are accurate
- [ ] Content rating questionnaire completed
- [ ] Age rating is appropriate (4+ / Everyone)
- [ ] No third-party content without licence

---

## iOS-Specific Checklist

- [ ] Apple Developer Account is active and paid
- [ ] Provisioning profile is valid and not expired
- [ ] App signed with **Distribution** certificate (not Development)
- [ ] Archive created with **Any iOS Device (arm64)** selected
- [ ] App validated in Xcode Organizer before upload
- [ ] TestFlight testing completed with at least 2 testers
- [ ] App Store Connect listing is complete (all required fields)
- [ ] Screenshots uploaded for:
  - [ ] 6.7" iPhone (1290×2796)
  - [ ] 5.5" iPhone (1242×2208)
  - [ ] 12.9" iPad Pro (2048×2732)

---

## Android-Specific Checklist

- [ ] Google Play Developer Account is active
- [ ] Keystore file is stored securely (not in Git)
- [ ] App signed with release keystore
- [ ] Built as **AAB** (Android App Bundle), not just APK
- [ ] Content rating questionnaire completed in Play Console
- [ ] Google Play listing is complete:
  - [ ] Short description (80 chars)
  - [ ] Full description
  - [ ] 512×512 icon
  - [ ] 1024×500 feature graphic
  - [ ] At least 2 phone screenshots
- [ ] Internal testing track tested before production rollout
- [ ] Target SDK is up to date (Android API 34+)

---

## Post-Release Checklist

- [ ] Tag the release in Git: `git tag v1.0.0 && git push --tags`
- [ ] Monitor crash reports in App Store Connect / Play Console
- [ ] Check initial user reviews within 48 hours
- [ ] Update `VERSION_MANAGEMENT.md` with release notes
- [ ] Prepare hotfix branch if critical issues found

---

## Helpful Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
- [iOS Deployment Guide](./APP_STORE_GUIDE.md)
- [Android Deployment Guide](./GOOGLE_PLAY_GUIDE.md)
- [Version Management](./VERSION_MANAGEMENT.md)
- [Build Guide](./BUILD_GUIDE.md)
