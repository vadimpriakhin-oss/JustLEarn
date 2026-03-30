# BUILD_GUIDE.md

## Comprehensive Build Instructions for App Store and Google Play Deployment

This guide provides detailed steps for setting up, building, and deploying your application on both Android and iOS platforms.

---

## Setup
1. **Prerequisites:**  
   - Install [Node.js](https://nodejs.org/) (version X.X.X).
   - Install [Android Studio](https://developer.android.com/studio) for Android development.
   - Install [Xcode](https://developer.apple.com/xcode/) for iOS development.
   - Install [Git](https://git-scm.com/) for version control.

2. **Clone the Repository:**  
   ```bash
   git clone https://github.com/vadimpriakhin-oss/JustLEarn.git
   cd JustLEarn
   ```

3. **Install Dependencies:**  
   ```bash
   npm install
   ```

---

## Android Build Steps
1. **Open Android Studio:**  
   - Import the project as an existing project.

2. **Configure Build Variants:**  
   - Go to the *Build Variants* tab and select the desired variant (release/debug).

3. **Build the APK:**  
   - Click on *Build* in the top menu, then select *Build Bundle(s)/APK(s)* -> *Build APK(s)*.
   - Follow the prompts to complete the build.

4. **Locate the APK:**  
   - Find the built APK in `app/build/outputs/apk/` directory.

5. **Deploy to Google Play:**  
   - Sign up for a Google Play Developer account.
   - Follow the [Google Play Console](https://play.google.com/console/) instructions to upload your APK.

---

## iOS Build Steps
1. **Open Xcode:**  
   - Open the project workspace file (`.xcworkspace`).

2. **Select Device:**  
   - Choose a target device or simulator from the toolbar.

3. **Build the App:**  
   - Click on *Product* in the top menu, then select *Archive*.
   - Wait for the build process to finish.

4. **Locate the Build:**  
   - Open the Organizer window in Xcode to find your archived builds.

5. **Deploy to App Store:**  
   - Use Xcode or [App Store Connect](https://appstoreconnect.apple.com/) to upload your app.
   - Follow the steps for submitting the app for review.

---

## Required Materials
- **For Android:**  
   - Google Play Developer Account.
   - Keystore file for signing APKs.

- **For iOS:**  
   - Apple Developer Account.
   - App Icons and Splash Screens.
   - App Privacy Policy.

---

## Helpful Links
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Building and Running Apps on Android](https://developer.android.com/studio/run)
- [Building and Publishing Your App](https://developer.apple.com/documentation/xcode/distributing-your-app)

---

For any questions or issues, please refer to our GitHub discussions or reach out to the team.