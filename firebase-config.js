// ========================================
// FIREBASE CONFIGURATION TEMPLATE
// ========================================
// 
// To use Firebase Authentication, follow these steps:
// 
// 1. Go to https://console.firebase.google.com/
// 2. Create a new Firebase project
// 3. Enable Authentication:
//    - Go to Authentication > Sign-in method
//    - Enable "Email/Password"
//    - Enable "Google" (optional)
// 4. Enable Firestore Database:
//    - Go to Firestore Database > Create database
//    - Start in test mode (or set appropriate rules)
// 5. Get your configuration:
//    - Go to Project Settings > General
//    - Scroll down to "Your apps" and click the web icon </>.
//    - Copy the firebaseConfig object
// 6. Replace the configuration below with your actual values
// 
// ========================================

const firebaseConfig = {
    // REPLACE WITH YOUR FIREBASE CONFIG
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// ========================================
// ALTERNATIVE: Using Environment Variables
// ========================================
// You can also use environment variables:
// 
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID
// };
// 
// Create a .env file in your project root:
// VITE_FIREBASE_API_KEY=your_api_key
// VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=your-project-id
// VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
// VITE_FIREBASE_APP_ID=1:123456789:web:abc123

// ========================================
// DEMO MODE
// ========================================
// The application works in DEMO MODE without Firebase configuration.
// In demo mode:
// - Registration and login forms work but data is not saved to Firebase
// - Google authentication is not available
// - A demo message is shown to indicate demo mode
// 
// To fully use the authentication features, configure Firebase above.
