// ========================================
// FIREBASE CONFIGURATION
// ========================================
// Using environment variables from env.js

const firebaseConfig = {
    apiKey: window.env?.VITE_FIREBASE_API_KEY || "AIzaSyCejCxYF9ter8nzermqwtqDdB_Sa3jMobs",
    authDomain: window.env?.VITE_FIREBASE_AUTH_DOMAIN || "game-web-9fbda.firebaseapp.com",
    projectId: window.env?.VITE_FIREBASE_PROJECT_ID || "game-web-9fbda",
    storageBucket: window.env?.VITE_FIREBASE_STORAGE_BUCKET || "game-web-9fbda.firebasestorage.app",
    messagingSenderId: window.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "171565764612",
    appId: window.env?.VITE_FIREBASE_APP_ID || "1:171565764612:web:ef4eb637be822615eae551",
    measurementId: window.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-783HTJWQ02"
};
