# Google Play Guide — Android Deployment

Complete guide for packaging **JustLEarn** as an Android app and publishing it to the Google Play Store.

---

## Prerequisites

| Requirement | Details |
|---|---|
| Node.js ≥ 18 | [nodejs.org](https://nodejs.org) |
| Android Studio | [developer.android.com/studio](https://developer.android.com/studio) |
| Java JDK 17+ | Bundled with Android Studio |
| Google Play Developer Account | [play.google.com/console](https://play.google.com/console) — one-time $25 fee |

---

## 1. First-time Android Setup

```bash
# Install dependencies
npm install

# Add Android platform
npx cap add android

# Sync web assets
npx cap sync android
```

This generates an `android/` folder containing the Android Studio project.

---

## 2. Open the Project in Android Studio

```bash
npx cap open android
```

Or open the `android/` folder directly in Android Studio.

---

## 3. Generate a Signing Keystore

> Run this command **once**. Store the keystore file in a secure location **outside** the repository.

```bash
keytool -genkey -v \
  -keystore ~/.keystores/justlearn.jks \
  -alias justlearn \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You will be prompted for passwords and your organization details. Keep these credentials safe — they cannot be recovered if lost.

---

## 4. Configure Signing in build.gradle

1. Create `android/keystore.properties` (already in `.gitignore`):

```properties
storeFile=/Users/<you>/.keystores/justlearn.jks
storePassword=<your store password>
keyAlias=justlearn
keyPassword=<your key password>
```

2. Apply the signing block from [`android-build.gradle`](./android-build.gradle) to `android/app/build.gradle`.

---

## 5. Build a Signed AAB (Recommended for Google Play)

```bash
# From the project root
npm run build:android

# Or manually from the android/ folder
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 6. Build a Signed APK (for direct distribution)

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## 7. Publish to Google Play Console

### 7.1 Create an App

1. Go to [Google Play Console](https://play.google.com/console).
2. Click **Create app**.
3. Fill in:
   - **App name:** JustLEarn
   - **Default language:** English
   - **App or Game:** App
   - **Free or Paid:** Free

### 7.2 Fill in Store Listing

- Short description (80 chars max)
- Full description (4000 chars max)
- Screenshots: at least 2 phone screenshots (1080×1920 recommended)
- Feature graphic: 1024×500
- Icon: 512×512 (use `assets/icons/icon-512x512.png`)
- Privacy Policy URL (see `PRIVACY_POLICY.md`)

### 7.3 Upload the AAB

1. Go to **Release → Production → Create new release**.
2. Upload `app-release.aab`.
3. Add release notes.
4. Click **Save → Review release → Start rollout**.

---

## 8. Beta Testing (Internal / Closed / Open)

### Internal Testing (fastest — no review)

1. Go to **Release → Testing → Internal testing**.
2. Create a release and upload the AAB.
3. Add tester email addresses.
4. Share the opt-in link.

### Closed Testing (Alpha)

1. Go to **Release → Testing → Closed testing**.
2. Create a track, upload AAB, invite testers.

### Open Testing (Beta)

1. Go to **Release → Testing → Open testing**.
2. Set a percentage rollout and promote your release.

---

## 9. Version Management

Each release must increment the `versionCode` (integer) in `android/app/build.gradle`:

```gradle
versionCode 2        // Must be higher than the previous release
versionName "1.1.0"  // Human-readable semantic version
```

See [`VERSION_MANAGEMENT.md`](./VERSION_MANAGEMENT.md) for the full versioning workflow.

---

## 10. Troubleshooting

| Issue | Solution |
|---|---|
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Uninstall the debug build from the device first |
| Signing key not found | Verify the path in `keystore.properties` |
| AAB upload rejected | Ensure `versionCode` is higher than the current live version |
| Capacitor plugins missing | Run `npx cap sync android` before building |

---

## Useful Links

- [Google Play Console](https://play.google.com/console)
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android App Bundle guide](https://developer.android.com/guide/app-bundle)
- [Play Core Library](https://developer.android.com/guide/playcore)
