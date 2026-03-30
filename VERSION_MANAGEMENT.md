# Version Management Guide

This guide explains how to manage versions for JustLEarn across web, iOS, and Android.

---

## Semantic Versioning

JustLEarn follows [Semantic Versioning](https://semver.org/) (SemVer):

```
MAJOR.MINOR.PATCH
  │     │     └── Bug fixes, no breaking changes
  │     └──────── New features, backward compatible
  └────────────── Breaking changes or major rewrites
```

### Examples

| Version | When to use |
|---------|-------------|
| `1.0.0` | Initial release |
| `1.0.1` | Bug fix (typo in word definition) |
| `1.1.0` | New quiz mode added |
| `2.0.0` | Complete UI redesign |

---

## Version Numbers by Platform

Each platform has its own version tracking:

### Web (`package.json`)
```json
{
  "version": "1.0.0"
}
```

### iOS (`ios/App/App/Info.plist`)
```xml
<!-- Human-readable version (shown in App Store) -->
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>

<!-- Build number (must increase with each upload) -->
<key>CFBundleVersion</key>
<string>1</string>
```

### Android (`android/app/build.gradle`)
```gradle
defaultConfig {
    versionName "1.0.0"   // Human-readable version
    versionCode 1          // Must be a unique integer, always increasing
}
```

---

## Release Workflow

### Patch Release (1.0.x — bug fix)

```bash
# 1. Fix the bug in the code
# 2. Update versions

# package.json: "version": "1.0.1"
# ios/App/App/Info.plist: CFBundleShortVersionString -> 1.0.1, CFBundleVersion -> 2
# android/app/build.gradle: versionName "1.0.1", versionCode 2

# 3. Commit
git add .
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1

# 4. Push
git push && git push --tags
```

### Minor Release (1.x.0 — new feature)

```bash
# 1. Implement the feature
# 2. Update versions (increment MINOR, reset PATCH)
# package.json: "version": "1.1.0"
# ios/App/App/Info.plist: CFBundleShortVersionString -> 1.1.0
# android/app/build.gradle: versionName "1.1.0", versionCode 3

# 3. Commit and tag
git add .
git commit -m "feat: add new quiz mode"
git tag v1.1.0

# 4. Push
git push && git push --tags
```

---

## Release Notes

Write release notes for every version. Include:
- **What's new**: new features
- **Improvements**: enhancements to existing features
- **Bug fixes**: issues that were resolved

### Example Release Notes (v1.0.1)

```
Bug Fixes:
• Fixed incorrect answer highlighting in Multiple Choice mode
• Fixed progress not saving on app restart
• Minor UI improvements for small screens
```

### Example Release Notes (v1.1.0)

```
New Features:
• Added Drag & Drop quiz mode
• Added daily study streak tracker

Improvements:
• Faster app startup time
• Better offline support

Bug Fixes:
• Fixed word count display in statistics
```

---

## iOS Build Numbers

Apple requires the **CFBundleVersion** (build number) to increase with every upload to App Store Connect, even for the same version name. Use a sequential integer:

| Release | CFBundleShortVersionString | CFBundleVersion |
|---------|---------------------------|-----------------|
| Initial release | 1.0.0 | 1 |
| Bug fix | 1.0.1 | 2 |
| Re-upload after rejection | 1.0.1 | 3 |
| New feature | 1.1.0 | 4 |

---

## Android Version Codes

The `versionCode` must be a unique integer that **always increases**. Google Play rejects uploads with duplicate or lower version codes.

| Release | versionName | versionCode |
|---------|-------------|-------------|
| Initial release | 1.0.0 | 1 |
| Bug fix | 1.0.1 | 2 |
| New feature | 1.1.0 | 3 |

---

## Automating Version Updates

To update versions consistently, edit these files before each release:

1. `package.json` → `"version"` field
2. `ios/App/App/Info.plist` → `CFBundleShortVersionString` and `CFBundleVersion`
3. `android/app/build.gradle` → `versionName` and `versionCode`
4. `capacitor.config.json` → no version field (uses package.json)
