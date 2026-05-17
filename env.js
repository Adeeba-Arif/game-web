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

    // ── Google Apps Script (primary relay) ─────────────────────────────────────
    // Web-app URL for the GAS email relay (see GOOGLE_APPS_SCRIPT_SETUP.md).
    // This is a public URL — it works from any user's browser.
    VITE_GAS_WEB_APP_URL: "",

    // ── Email Server (dev/testing fallback) ────────────────────────────────────
    // URL of the local Nodemailer email server (email-server.js).
    // Only reachable from the machine running the server — not from other users' browsers.
    VITE_EMAIL_SERVER_URL: "http://localhost:3001",

    // ── Email Settings ──────────────────────────────────────────────────────────
    VITE_ADMIN_EMAIL:      "thedarkworld.8304@gmail.com",
    VITE_EMAIL_FROM_NAME:  "The Dark World",
};
