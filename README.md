# JustLEarn 📱

A React Native Expo quiz app to help you learn — your way!

## Features

- **True or False** — Decide if a statement is true or false
- **Multiple Choice** — Pick the correct answer from 4 options
- **Fill in the Blank** — Type the missing word or phrase
- **Match Terms** — Match terms with their definitions (Drag & Drop style)
- **Custom Terms** — Add, edit, and delete your own terms that appear in all quiz modes
- **Persistent Storage** — Custom terms are saved locally with AsyncStorage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device

### Install & Run

```bash
# Clone the repository
git clone https://github.com/vadimpriakhin-oss/JustLEarn
cd JustLEarn

# Install dependencies
npm install

# Start the development server
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).

### Run on Emulator

```bash
# Android emulator
npx expo start --android

# iOS simulator (Mac only)
npx expo start --ios
```

## Build for App Stores

Install EAS CLI and build:

```bash
npm install -g eas-cli
eas login
eas build --platform all
```

Submit to stores:

```bash
eas submit --platform ios     # App Store
eas submit --platform android # Google Play
```

## Project Structure

```
JustLEarn/
├── App.js                      # Root navigation setup
├── app.json                    # Expo configuration (iOS & Android)
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── screens/
│   ├── HomeScreen.js           # Main menu with all 5 modes
│   ├── TrueFalseScreen.js      # True/False quiz
│   ├── MultiChoiceScreen.js    # Multiple choice quiz
│   ├── FillBlankScreen.js      # Fill in the blank quiz
│   ├── DragDropScreen.js       # Match terms quiz
│   ├── AddTermScreen.js        # Add custom terms
│   └── TermsListScreen.js      # Manage custom terms
├── components/
│   ├── QuizHeader.js           # Score + progress bar
│   ├── QuestionCard.js         # Question display card
│   └── NavigationButton.js     # Consistent button styling
└── utils/
    ├── quizData.js             # Sample questions for all modes
    ├── storageService.js       # AsyncStorage helpers
    └── styles.js               # Shared colors, fonts, spacing
```

## Tech Stack

- **React Native** + **Expo SDK 51**
- **React Navigation** v6 (Native Stack)
- **AsyncStorage** for persistent data
- Compatible with iOS and Android
