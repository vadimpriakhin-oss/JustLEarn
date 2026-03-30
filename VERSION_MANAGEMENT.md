# Version Management

Guidelines for versioning **JustLEarn** before each release to the App Store or Google Play.

---

## Semantic Versioning

We use [Semantic Versioning](https://semver.org): **MAJOR.MINOR.PATCH**

| Segment | When to increment | Example |
|---|---|---|
| MAJOR | Breaking changes or complete redesign | `2.0.0` |
| MINOR | New features, backward-compatible | `1.1.0` |
| PATCH | Bug fixes and small improvements | `1.0.1` |

---

## Files to Update Before a Release

### 1. `package.json`

```json
{
  "version": "1.1.0"
}
```

### 2. `android/app/build.gradle`

```gradle
defaultConfig {
    versionCode 2          // Integer — must be higher than the previous upload
    versionName "1.1.0"   // Human-readable version
}
```

> **Rule:** `versionCode` must increase with every upload to Google Play, even for the same `versionName`.

### 3. `ios/App/App.xcodeproj/project.pbxproj` (via Xcode)

In Xcode, select the **App** target → **General** tab:

- **Version:** `1.1.0`
- **Build:** `2`  *(must increase with every TestFlight/App Store upload)*

---

## Release Checklist

Run through these steps every time you cut a release:

1. Update version in `package.json`.
2. Update `versionCode` / `versionName` in `android/app/build.gradle`.
3. Update **Version** and **Build** numbers in Xcode.
4. Commit: `git commit -m "chore: bump version to 1.1.0"`.
5. Create a git tag: `git tag v1.1.0`.
6. Push: `git push && git push --tags`.
7. Build and upload to both stores.

---

## Release Notes Template

```
Version 1.1.0

What's new:
- [Feature] Brief description of new feature
- [Fix] Brief description of bug fix
- [Improvement] Brief description of improvement

Bug fixes:
- Fixed issue where ...
- Resolved crash when ...
```

---

## Automation Script

You can bump the patch version automatically:

```bash
npm version patch     # 1.0.0 → 1.0.1
npm version minor     # 1.0.0 → 1.1.0
npm version major     # 1.0.0 → 2.0.0
```

This updates `package.json` and creates a git tag automatically.
