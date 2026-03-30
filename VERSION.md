# Version History

## JustLEarn — Version Management

### Current Version: 1.0.0

---

## Versioning Convention

JustLEarn uses [Semantic Versioning](https://semver.org/): **MAJOR.MINOR.PATCH**

| Component | Meaning | Example |
|-----------|---------|---------|
| MAJOR | Breaking changes or full redesign | 2.0.0 |
| MINOR | New features, backwards compatible | 1.1.0 |
| PATCH | Bug fixes, small improvements | 1.0.1 |

### Platform-specific version numbers

- **iOS** — `CFBundleShortVersionString` (e.g. `1.0.0`) + `CFBundleVersion` (build number, e.g. `1`)
- **Android** — `versionName` (e.g. `1.0.0`) + `versionCode` (integer, e.g. `1`)

> ⚠️ The `versionCode` / `CFBundleVersion` must be incremented with every Play Store / App Store upload.

---

## How to Update the Version

### 1. Update package.json
```json
{
  "version": "1.0.1"
}
```

### 2. Update iOS (ios/App/App/Info.plist)
```xml
<key>CFBundleShortVersionString</key>
<string>1.0.1</string>
<key>CFBundleVersion</key>
<string>2</string>
```

### 3. Update Android (android/app/build.gradle)
```gradle
defaultConfig {
    versionCode 2
    versionName "1.0.1"
}
```

### 4. Tag the release in Git
```bash
git tag -a v1.0.1 -m "Release v1.0.1"
git push origin v1.0.1
```

---

## Changelog

### v1.0.0 — Initial Release (2025)
- True/False quiz mode
- Multiple Choice quiz mode
- Fill in the Blank quiz mode
- Drag & Drop quiz mode
- Progress tracking
- Dark theme UI
- PWA support (offline-capable)
- iOS (App Store) and Android (Google Play) support via Capacitor
