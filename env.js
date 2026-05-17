// Environment Configuration
// This file simulates .env for static HTML (without build tools)

window.env = {
    // ── Firebase ──────────────────────────────────────────────────────────────
    VITE_FIREBASE_API_KEY:        "AIzaSyCejCxYF9ter8nzermqwtqDdB_Sa3jMobs",
    VITE_FIREBASE_AUTH_DOMAIN:    "game-web-9fbda.firebaseapp.com",
    VITE_FIREBASE_PROJECT_ID:     "game-web-9fbda",
    VITE_FIREBASE_STORAGE_BUCKET: "game-web-9fbda.firebasestorage.app",
    VITE_FIREBASE_MESSAGING_SENDER_ID: "171565764612",
    VITE_FIREBASE_APP_ID:         "1:171565764612:web:ef4eb637be822615eae551",
    VITE_FIREBASE_MEASUREMENT_ID: "G-783HTJWQ02",

    // ── Email Server (primary relay) ───────────────────────────────────────────
    // URL of the local Nodemailer email server (email-server.js).
    // Change this if you deploy the server elsewhere.
    VITE_EMAIL_SERVER_URL: "http://localhost:3001",

    // ── Google Apps Script (secondary fallback) ─────────────────────────────────
    // Web-app URL for the GAS email relay (see GOOGLE_APPS_SCRIPT_SETUP.md).
    // Leave empty unless you have deployed a GAS script.
    VITE_GAS_WEB_APP_URL: "",

    // ── Email Settings ──────────────────────────────────────────────────────────
    VITE_ADMIN_EMAIL:      "thedarkworld.8304@gmail.com",
    VITE_EMAIL_FROM_NAME:  "The Dark World",
};
