<div align="center">

# 🚀 Startup Idea Evaluator

### AI-Assisted Venture Assessment & Community Voting Mobile Application

[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

<p align="center">
  A production-ready mobile platform engineered for founders and venture enthusiasts to pitch startup concepts, receive algorithmic viability scores, participate in real-time community upvoting, and inspect competitive leaderboard rankings.
</p>

</div>

---

## ⚡ Core Features & Capabilities

* **💡 Intelligent Concept Submission**: Form input capturing startup name, tagline, and business model description with instant validation.
* **🧠 Heuristic AI Feasibility Scoring**: Algorithmic assessment scoring venture propositions from 0–100 based on problem-solution clarity.
* **🗳️ Community Consensus & One-Vote Guard**: Built-in vote tracking preventing duplicate upvotes per device via asynchronous persistence.
* **🏆 Real-Time Venture Leaderboard**: Dynamic multi-parameter ranking sorting concepts by highest community vote count or AI evaluation rating.
* **🌓 Dual Theme Architecture**: Smooth, persistent dark/light mode toggle with customized linear gradients and glassmorphism cards.
* **📋 Native OS Integration**: One-touch clipboard copying, native system share sheets, and interactive toast alerts.

---

## 🏗️ Application Architecture

```text
startup-idea-evaluator/
├── App.tsx                     # Application Root & Theme Provider
└── src/
    ├── context/
    │   ├── IdeaContext.tsx     # Global State Management (Ideas, Votes, Sorting)
    │   └── ToastContext.tsx    # Native Feedback & Notification Toasts
    ├── screens/
    │   ├── SubmitIdeaScreen.tsx # Multi-field concept pitch screen
    │   ├── IdeaListScreen.tsx   # Filterable community feeds & upvoting
    │   └── LeaderboardScreen.tsx# Dynamic top-ranked venture podium
    ├── storage/
    │   └── appStorage.ts       # Thread-safe persistent AsyncStore
    ├── types/
    │   ├── idea.ts             # Strongly typed data models
    │   └── navigation.ts       # React Navigation stack & tab types
    ├── theme.ts                # Design system tokens & palette
    └── utils/
        └── rating.ts           # Algorithmic scoring heuristics
```

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js (v18+)](https://nodejs.org/)
* [Expo Go](https://expo.dev/go) app installed on iOS or Android

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Gaurav-Khaladkar/Startup-Idea-Evaluator-AI-Voting-App.git
cd Startup-Idea-Evaluator-AI-Voting-App
npm install
```

### 2. Launch Local Development Server
```bash
npx expo start
```

* Press **`a`** for Android Emulator.
* Press **`w`** for Web Browser testing.
* Or scan the terminal QR code using the **Expo Go** mobile app.

### 3. Generate Android APK (EAS Build)
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

---

## 👨‍💻 Author
**Gaurav Khaladkar**
* 🌐 GitHub: [@Gaurav-Khaladkar](https://github.com/Gaurav-Khaladkar)
* 💼 LinkedIn: [Gaurav Khaladkar](https://www.linkedin.com/in/gaurav-khaladkar/)
* 📧 Email: [gauravkhaldkar2001@gmail.com](mailto:gauravkhaldkar2001@gmail.com)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).