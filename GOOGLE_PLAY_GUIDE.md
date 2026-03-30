# Google Play (Android) Submission Guide

Complete guide for submitting JustLEarn to the Google Play Store.

---

## Prerequisites

- [Android Studio](https://developer.android.com/studio) (latest version)
- [Google Play Developer Account](https://play.google.com/console/) ($25 one-time fee)
- Node.js 18+
- JDK 17

---

## Step 1 — Register a Google Play Developer Account

1. Go to https://play.google.com/console/
2. Sign in with your Google account
3. Pay the $25 registration fee (one-time)
4. Complete identity verification

---

## Step 2 — Create App in Google Play Console

1. In the Play Console, click **Create app**
2. Fill in:
   - **App name**: JustLEarn
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free
3. Accept the declarations
4. Click **Create app**

---

## Step 3 — Install Dependencies & Add Android Platform

```bash
# Clone the repository
git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
cd JustLEarn

# Install npm dependencies
npm install

# Add Android platform (first time only)
npm run add:android
```

---

## Step 4 — Generate a Signing Keystore

A keystore is required to sign your app. **Keep this file safe — you'll need it for every future update.**

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore android/my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

You'll be prompted to enter:
- Keystore password
- First and last name
- Organization unit, organization, city, state, country

---

## Step 5 — Configure Signing in keystore.properties

```bash
# Copy the example file
cp config-templates/android/keystore.properties.example android/keystore.properties
```

Edit `android/keystore.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_STORE_PASSWORD=your_actual_store_password
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_KEY_PASSWORD=your_actual_key_password
```

> ⚠️ **IMPORTANT**: Never commit `keystore.properties` or `*.keystore` files to Git.  
> These files are already listed in `.gitignore`.

---

## Step 6 — Sync and Build

```bash
# Sync web app with Android project
npm run build:android
```

This opens Android Studio. In Android Studio:
1. Wait for Gradle sync to complete
2. Select **Build → Generate Signed Bundle / APK**
3. Choose **Android App Bundle** (recommended for Play Store)
4. Select your keystore file and enter passwords
5. Select **release** build variant
6. Click **Finish**

The AAB file will be in: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Step 7 — Upload to Google Play Console

1. In Play Console, go to your app
2. Navigate to **Release → Production** (or **Internal testing** for initial upload)
3. Click **Create new release**
4. Click **Upload** and select your `.aab` file
5. Fill in release notes
6. Click **Save → Review release → Start rollout**

---

## Step 8 — Complete Store Listing

In Play Console → **Store presence → Main store listing**:

**App details:**
- **App name**: JustLEarn
- **Short description** (max 80 chars): Learn English for exam preparation
- **Full description** (max 4000 chars): Detailed app description

**Graphics (required):**
- **App icon**: 512×512 PNG (high-res)
- **Feature graphic**: 1024×500 PNG
- **Screenshots** (at least 2): phone screenshots (16:9 or 9:16)

**Contact details:**
- **Email**: your contact email
- **Website**: https://just-l-earn.vercel.app
- **Privacy policy URL**: (required — link to hosted PRIVACY_POLICY.md)

---

## Step 9 — Content Rating

1. Go to **Policy → App content → Content rating**
2. Click **Start questionnaire**
3. Select **Education** category
4. Answer all questions
5. Click **Calculate rating → Apply rating**

---

## Step 10 — App Access

If your app has login-protected features, provide test credentials:
1. Go to **Policy → App content → App access**
2. Add testing instructions and credentials

---

## Recommended Release Flow

1. **Internal testing** → share with your team (instant publishing)
2. **Closed testing (Alpha)** → up to 100 testers
3. **Open testing (Beta)** → unlimited testers
4. **Production** → staged rollout (10% → 50% → 100%)

---

## App Bundle vs APK

| | AAB (App Bundle) | APK |
|---|---|---|
| Google Play | ✅ Required | ✅ Accepted |
| File size | Smaller (optimized) | Larger |
| Direct install | ❌ | ✅ |

Use **AAB** for Play Store submissions. Generate APK only for direct distribution.

---

## Useful Links

- [Google Play Console](https://play.google.com/console/)
- [Android Developer Documentation](https://developer.android.com/)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [App Signing by Google Play](https://support.google.com/googleplay/android-developer/answer/9842756)
