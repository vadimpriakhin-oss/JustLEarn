# Configuration Templates

This directory contains template configuration files that are used as references when setting up the native iOS and Android projects.

When you run `npx cap add ios` or `npx cap add android`, Capacitor generates the native project directories. Use these templates to configure them correctly.

## iOS Templates

| Template | Copy to | Description |
|----------|---------|-------------|
| `ios/Info.plist` | `ios/App/App/Info.plist` | App permissions, metadata, and ATS config |

**Usage:**
```bash
# After running: npx cap add ios
cp config-templates/ios/Info.plist ios/App/App/Info.plist
```

## Android Templates

| Template | Copy to | Description |
|----------|---------|-------------|
| `android/build.gradle` | `android/app/build.gradle` | Build configuration and signing setup |
| `android/keystore.properties.example` | `android/keystore.properties` | Keystore credentials (fill in your values) |

**Usage:**
```bash
# After running: npx cap add android
cp config-templates/android/build.gradle android/app/build.gradle
cp config-templates/android/keystore.properties.example android/keystore.properties
# Edit android/keystore.properties with your actual keystore credentials
```

> ⚠️ Never commit `android/keystore.properties` or `*.keystore` files. They are in `.gitignore`.
