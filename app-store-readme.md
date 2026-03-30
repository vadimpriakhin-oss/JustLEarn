# JustLEarn — App Store Submission Guide

## App Information

| Field | Value |
|-------|-------|
| **App Name** | JustLEarn |
| **Short Description** | Interactive quiz app — learn your way |
| **Category** | Education |
| **Rating** | 4+ (no objectionable content) |
| **Languages** | English |
| **Version** | 1.0.0 |

---

## Full Description

**JustLEarn** is an interactive learning application that makes studying fun and effective.

Choose from four engaging quiz modes:
- **True or False** — quick knowledge checks
- **Multiple Choice** — test understanding with options
- **Fill in the Blank** — reinforce memory recall
- **Drag & Drop** — match terms interactively

You can also add your own custom terms and study them in any mode.

**Key features:**
✓ Works completely offline after first load  
✓ Dark neon theme — easy on the eyes  
✓ Mobile-first, responsive design  
✓ No account or registration required  
✓ Progress tracking with score counter  

---

## Required Assets for Store Submission

### Apple App Store

| Asset | Size | Notes |
|-------|------|-------|
| App Icon | 1024×1024 px PNG | No alpha channel, no rounded corners |
| iPhone 6.7" Screenshot | 1290×2796 px | Required (at least 3) |
| iPhone 6.5" Screenshot | 1242×2688 px | Recommended |
| iPhone 5.5" Screenshot | 1242×2208 px | Recommended |
| iPad Pro 12.9" Screenshot | 2048×2732 px | Required if supporting iPad |

> **Generate screenshots:** Run the app in the iOS Simulator, resize to the required dimensions, and take screenshots.

### Google Play Store

| Asset | Size | Notes |
|-------|------|-------|
| High-res Icon | 512×512 px PNG | Transparency allowed |
| Feature Graphic | 1024×500 px | Shown in Play Store listing |
| Phone Screenshot | 1080×1920 px | Minimum 2, maximum 8 |
| Tablet Screenshot (optional) | 1200×1920 px | Recommended |

---

## Tools for Wrapping PWA into Native App

### Option 1 — PWABuilder (Recommended, Free)
- Website: [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
- Supports both iOS (Xcode) and Android (AAB) packages
- No coding required

### Option 2 — Bubblewrap (Android, CLI)
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://your-site.com/manifest.json
bubblewrap build
```

### Option 3 — Capacitor (Advanced)
Convert the PWA to a full native wrapper using [Capacitor](https://capacitorjs.com/):
```bash
npm install @capacitor/core @capacitor/cli
npx cap init JustLEarn com.justlearn.app
npx cap add ios
npx cap add android
```

---

## Checklist Before Submission

- [ ] `manifest.json` has `name`, `short_name`, `icons`, `start_url`, `display: standalone`
- [ ] All icon sizes are present (`192×192`, `512×512`, `1024×1024`)
- [ ] App works fully offline (test with network disabled)
- [ ] HTTPS is enabled on the hosting domain
- [ ] App has been tested on both iOS Safari and Android Chrome
- [ ] Screenshots captured at required resolutions
- [ ] App Store / Play Console listing is complete
- [ ] Privacy Policy URL provided (required by both stores)

---

## Privacy Policy Notes

Both stores require a Privacy Policy URL. Since JustLEarn:
- Does **not** collect personal data
- Does **not** use analytics or tracking
- Does **not** require an account

You can use a simple "no data collected" privacy policy hosted on your domain (e.g., `/privacy.html`).
