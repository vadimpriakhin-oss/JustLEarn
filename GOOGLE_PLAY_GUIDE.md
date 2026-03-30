# Google Play Deployment Guide (Android)

This guide walks you through preparing and submitting JustLEarn to the Google Play Store.

---

## Prerequisites

- **Android Studio Hedgehog (2023.1.1)** or later
- **Java Development Kit (JDK 17)**
- **Google Play Developer Account** ($25 one-time) at [play.google.com/console](https://play.google.com/console)
- **Node.js 18+** and npm installed
- **Android SDK** (installed via Android Studio)

---

## Step 1: Set Up Your Google Play Developer Account

1. Register at [play.google.com/console/signup](https://play.google.com/console/signup)
2. Pay the $25 one-time registration fee
3. Complete identity verification
4. Create a new app:
   - App name: **JustLEarn**
   - Default language: **English (United States)**
   - App or game: **App**
   - Free or paid: **Free**

---

## Step 2: Install Dependencies and Add Android Platform

```bash
# Install npm dependencies
npm install

# Add Android platform (first time only)
npm run cap:add:android

# Or manually:
npx cap add android
```

---

## Step 3: Generate a Signing Keystore

**⚠️ IMPORTANT: Keep your keystore file safe. If you lose it, you cannot update your app on Google Play.**

```bash
# Generate a new keystore
keytool -genkey -v \
  -keystore justlearn-release.keystore \
  -alias justlearn \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# You will be prompted for:
# - Keystore password (save this securely!)
# - Key alias password (save this securely!)
# - Your name, organisation, city, country
```

Store the keystore file securely — **never commit it to Git**.

---

## Step 4: Configure Signing in build.gradle

Create a `keystore.properties` file in `android/` (not committed to Git):

```properties
KEYSTORE_PATH=../justlearn-release.keystore
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=justlearn
KEY_PASSWORD=your_key_password
```

The `android/app/build.gradle` already has the signing configuration set up to read from these properties.

---

## Step 5: Add App Icons

Android requires adaptive icons and legacy icons:

| Directory | Size | Usage |
|-----------|------|-------|
| `mipmap-mdpi` | 48×48 | Legacy icon |
| `mipmap-hdpi` | 72×72 | Legacy icon |
| `mipmap-xhdpi` | 96×96 | Legacy icon |
| `mipmap-xxhdpi` | 144×144 | Legacy icon |
| `mipmap-xxxhdpi` | 192×192 | Legacy icon |
| Play Store | 512×512 | Store listing |

Use the SVG icons from `assets/icons/` to generate PNGs and place them in:
```
android/app/src/main/res/mipmap-*/ic_launcher.png
```

---

## Step 6: Build for Release

```bash
# Build and copy web assets to Android
npm run build:android
```

### Option A: Build AAB (recommended for Play Store)

In Android Studio:
1. Open `android/` folder
2. Menu: **Build** → **Generate Signed Bundle / APK**
3. Select **Android App Bundle**
4. Select your keystore file and enter passwords
5. Choose **release** build variant
6. Click **Finish** — the AAB will be in `android/app/release/app-release.aab`

### Option B: Build APK (for direct distribution)

```bash
cd android
./gradlew assembleRelease \
  -PKEYSTORE_PATH=../justlearn-release.keystore \
  -PKEYSTORE_PASSWORD=your_password \
  -PKEY_ALIAS=justlearn \
  -PKEY_PASSWORD=your_key_password
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Step 7: Upload to Google Play Console

### Internal Testing Track (Recommended First)

1. In Google Play Console → **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload your `.aab` file
4. Enter release notes
5. Click **Save** and **Review release**
6. Click **Start rollout to internal testing**
7. Add testers via **Testers** tab (up to 100 email addresses)

### Production Track

1. Complete the **Store listing**:
   - Short description (80 chars): "Interactive vocabulary learning for English exams"
   - Full description (4000 chars max): (use the description from APP_STORE_GUIDE.md)
   - App icon: 512×512 PNG
   - Feature graphic: 1024×500 PNG
   - Screenshots: at least 2 for phones (1080×1920 recommended)

2. Complete **Content rating** questionnaire (typically "Everyone")

3. Complete **App content** section:
   - Privacy policy URL
   - Ads declaration (Free, no ads)
   - Target audience: 13+

4. Go to **Production** → **Create new release** → Upload AAB

5. Review and **Roll out to production**

---

## Version Management

Each release must have a **unique `versionCode`** (integer, must increase):

In `android/app/build.gradle`:
```gradle
versionCode 2        # Increment for each release
versionName "1.1.0"  # Human-readable version
```

---

## Managing APK vs AAB

- **AAB (Android App Bundle)**: Required for new apps on Google Play since August 2021. Google generates optimised APKs for each device.
- **APK**: Still accepted for updates to existing apps and for direct distribution.

---

## Troubleshooting

### "App not signed" error
→ Verify keystore path and passwords in `keystore.properties`

### "Version code already used"
→ Increment `versionCode` in `build.gradle`

### "Upload failed: APK/AAB is invalid"
→ Ensure you built with the **release** variant, not debug

### "Insufficient target API level"
→ Update `targetSdkVersion` to the latest Android API level in `build.gradle`

### Build fails with Gradle errors
→ Run `cd android && ./gradlew clean` then retry
