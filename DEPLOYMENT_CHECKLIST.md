# Deployment Checklist

Use this checklist before every release to the App Store or Google Play.

---

## Pre-Release Checklist

### Versioning
- [ ] `package.json` version updated
- [ ] `android/app/build.gradle` — `versionCode` incremented and `versionName` updated
- [ ] Xcode — **Version** and **Build** numbers updated

### Assets
- [ ] App icon ready in all required sizes (see `assets/icons/`)
- [ ] Splash screen ready
- [ ] App Store screenshots ready (iPhone 6.5" and 5.5" at minimum)
- [ ] Google Play screenshots ready (phone and 7" tablet)
- [ ] Feature graphic ready for Google Play (1024×500)

### App Store (iOS)
- [ ] Apple Developer certificate valid and not expiring soon
- [ ] Provisioning profile up to date
- [ ] `Info.plist` reviewed (permissions, Bundle ID, version)
- [ ] App built and archived in Xcode without errors
- [ ] Tested on a real device (not only simulator)

### Google Play (Android)
- [ ] Signing keystore backed up securely
- [ ] `keystore.properties` not committed to git
- [ ] AAB built with `./gradlew bundleRelease` without errors
- [ ] Tested on a real device

### Testing
- [ ] All core learning flows tested (True/False, Multiple Choice, Fill in the Blank, Drag & Drop)
- [ ] App loads correctly on both iOS and Android
- [ ] No JavaScript errors in console
- [ ] Offline behaviour tested (PWA / service worker)
- [ ] Performance acceptable on mid-range devices

### Store Listing
- [ ] App description written and proofread
- [ ] Keywords / search tags updated
- [ ] Privacy Policy URL included (`PRIVACY_POLICY.md` published)
- [ ] Support email / URL added
- [ ] Age rating / content rating completed

### Release Notes
- [ ] Release notes written (see `VERSION_MANAGEMENT.md` for template)

---

## Post-Release
- [ ] Git tag created: `git tag v1.0.0 && git push --tags`
- [ ] GitHub Release created with the same notes
- [ ] Team notified of the new release
- [ ] Monitor crash reports for 48 hours after release
