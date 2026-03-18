
markdown
# Startup Idea Evaluator 🚀

A React Native app that lets users submit, rate, vote on, and view startup ideas with fun AI-generated feedback and social features. Built with Expo for smooth development and deployment.

---

## Table of Contents

- [App Description](#app-description)  
- [Tech Stack](#tech-stack)  
- [Features](#features)  
- [Project Structure](#project-structure)  
- [Installation & Running](#installation--running)  
- [Usage](#usage)  
- [Deployment](#deployment)  
- [Acknowledgments](#acknowledgments)  
- [Author](#author)

---

## App Description

The Startup Idea Evaluator is a mobile app enabling users to share startup ideas with a name, tagline, and description. Each idea is assigned a fun, fake AI-generated rating between 0-100. Users can upvote ideas (one vote per idea), sort ideas by rating or votes, and view a leaderboard highlighting the top 5 ideas. Dark mode, toast notifications, sharing, swipe gestures, and custom fonts make for a polished, engaging user experience.

---

## Tech Stack

- React Native with Expo CLI  
- AsyncStorage for local data persistence  
- React Navigation for seamless multi-screen navigation  
- React Native Paper for UI components and theming  
- React Native Gesture Handler & Reanimated for smooth animations and gestures  
- Expo Clipboard and React Native Share API for sharing functionality  
- Google Fonts (Inter) for clean and modern typography  
- React Native Toast Message for user feedback notifications  

---

## Features

- Submit startup ideas with form validation and fake AI rating  
- List ideas with expandable descriptions, voting capabilities, and sorting by rating or votes  
- View top 5 ideas in a leaderboard with medal badges and elegant card styles  
- Dark mode toggle for personalized visual comfort  
- Toast notifications for idea submission and voting interactions  
- Share ideas through social apps or copy details to the clipboard  
- Swipe gestures on idea cards to reveal upvote actions  
- Custom fonts and icons for professional design  

---

## Project Structure


startup-idea-evaluator/
├── App.js
├── package.json
├── babel.config.js
├── assets/
│   └── fonts/
├── screens/
│   ├── IdeaSubmissionScreen.js
│   ├── IdeaListingScreen.js
│   └── LeaderboardScreen.js
├── utils/
│   └── storageKeys.js
└── README.md


---

## Installation & Running

1. **Clone the repo**  
   
   git clone <your-repo-url>
   cd startup-idea-evaluator
   

2. **Install dependencies**  
   
   npm install
   

3. **Start Expo dev server**  
   
   npx expo start
   

4. **Open the app**  
   Use the Expo Go app on your phone to scan the QR code or run on an emulator.

---

## Usage

- Use the **Submit Idea** screen to enter your startup’s name, tagline, and description.  
- After submission, see your idea listed with a generated AI rating.  
- Upvote other ideas by swiping the card or pressing the Upvote button (one vote per idea).  
- Expand long descriptions with “Read more.”  
- Share and copy idea details using the icons.  
- View the top 5 ideas on the **Leaderboard** screen.  
- Toggle between light and dark mode from the app header.  
- Receive toast messages for confirmations and feedback.

---

## Deployment

- Publish on Expo Go with:  
  
  npx expo publish
  

- Or build an APK for Android and share via Google Drive or similar.

---

## Acknowledgments

Thanks to the open-source React Native and Expo communities and the creators of the libraries that make this project possible.

---

## Author

**Gaurav Khaladkar**

---

Feel free to ask if you want assistance with a video walkthrough script or detailed deployment support!


Citations:
[1] Mobile-App-Internship-Assignment.pdf https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/90315944/5807bf28-e0f2-4820-bf32-b286eec1e996/Mobile-App-Internship-Assignment.pdf