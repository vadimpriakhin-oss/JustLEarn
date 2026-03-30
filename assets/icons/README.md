# App Icons

This directory contains source icon files for the JustLEarn app.

## Source Files

- `icon.svg` — Master icon (1024×1024). Use this to generate all required sizes.

## Required iOS Icon Sizes

| File | Size | Usage |
|------|------|-------|
| icon-20.png | 20×20 | Notification (1x) |
| icon-29.png | 29×29 | Settings (1x) |
| icon-40.png | 40×40 | Spotlight (2x) |
| icon-58.png | 58×58 | Settings (2x) |
| icon-60.png | 60×60 | iPhone app (1x) |
| icon-76.png | 76×76 | iPad app (1x) |
| icon-80.png | 80×80 | Spotlight (2x) |
| icon-87.png | 87×87 | Settings (3x) |
| icon-120.png | 120×120 | iPhone app (2x/3x) |
| icon-152.png | 152×152 | iPad app (2x) |
| icon-167.png | 167×167 | iPad Pro app (2x) |
| icon-180.png | 180×180 | iPhone app (3x) |
| icon-1024.png | 1024×1024 | App Store |

## Required Android Icon Sizes

| File | Size | DPI | Usage |
|------|------|-----|-------|
| icon-48.png | 48×48 | mdpi | Launcher |
| icon-72.png | 72×72 | hdpi | Launcher |
| icon-96.png | 96×96 | xhdpi | Launcher |
| icon-128.png | 128×128 | xxhdpi | Launcher |
| icon-192.png | 192×192 | xxxhdpi | Launcher |
| icon-512.png | 512×512 | — | Google Play Store |

## Generating Icons

Run the following command after placing `icon.svg` in this directory:

```bash
npm run icons:generate
```

This uses `@capacitor/assets` to auto-generate all required sizes for both platforms.
