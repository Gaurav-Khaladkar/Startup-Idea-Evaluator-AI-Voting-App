# Startup Idea Evaluator 🚀

Mobile app assignment implementation for: **"The Startup Idea Evaluator – AI + Voting App"**.

## App Description

This app lets users submit startup ideas, get a fake AI-generated rating, vote on ideas, and view a leaderboard of top ideas.

All data is stored locally using AsyncStorage, so ideas and votes persist between app restarts.

## Tech Stack

- React Native + Expo (TypeScript)
- React Navigation (Bottom Tabs)
- AsyncStorage for persistence
- Expo Linear Gradient
- Expo Clipboard

## Features Implemented

### 1) Idea Submission Screen
- Form fields:
  - Startup Name
  - Tagline
  - Description
- On submit:
  - Generates fake AI rating (0-100)
  - Saves idea to local storage
  - Navigates to Idea Listing screen
- Toast feedback on success/error

### 2) Idea Listing Screen
- Displays all submitted ideas with:
  - Name
  - Tagline
  - AI rating
  - Vote count
- Upvote button:
  - One vote per idea (tracked in AsyncStorage)
- Read more / Show less description toggle
- Sort options:
  - By rating
  - By votes
- Share + Copy-to-clipboard actions

### 3) Leaderboard Screen
- Shows top 5 ideas
- Ranking basis toggle:
  - Votes
  - Rating
- Styled cards with:
  - 🥇🥈🥉 badges
  - Gradients
  - Shadows

### 4) Bonus Features
- Dark mode toggle (global in header)
- Toast notifications
- Share and clipboard support

## Project Structure

```text
startup-idea-evaluator/
├── App.tsx
├── src/
│   ├── context/
│   │   ├── IdeaContext.tsx
│   │   └── ToastContext.tsx
│   ├── screens/
│   │   ├── SubmitIdeaScreen.tsx
│   │   ├── IdeaListScreen.tsx
│   │   └── LeaderboardScreen.tsx
│   ├── storage/
│   │   └── appStorage.ts
│   ├── types/
│   │   ├── idea.ts
│   │   └── navigation.ts
│   ├── theme.ts
│   └── utils/
│       └── rating.ts
└── package.json
```

## How to Run Locally

### Prerequisites
- Node.js 18+ recommended
- Expo Go app on Android/iOS (for device testing)

### Install & Run

```bash
npm install
npm run start
```

Then:
- Press `a` for Android emulator/device
- Press `w` for web
- Or scan the QR code using Expo Go

## Build / Share APK (Android)

Use EAS Build:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

After build completes, share the generated APK link.

## Expo Publish / Share

You can also share by publishing an Expo update:

```bash
npx expo login
npx expo publish
```

## Submission Checklist

- [x] App source code
- [ ] Expo link or APK link
- [x] README (description, stack, features, run instructions)
- [ ] 2–3 minute walkthrough video (Loom/YouTube)

