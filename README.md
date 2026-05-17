# 🌑 The Dark World - Official Website

A fully animated 3D website with Firebase authentication system, featuring your sword with dynamic animations.

## ✨ Features

- **3D Animated Sword**: Your sword with glowing effects and animations
- **Custom Background Images**: Use your theme images for the background
- **Firebase Authentication**: Complete registration and login system
- **Registration Fields**: Email and WhatsApp number for registration
- **Dark Theme**: Beautiful dark theme with purple/cyan accent colors
- **Responsive Design**: Fully responsive for all devices
- **Authors Section**: Meet the creators Waleed Manzoor and Adeeba Arif

## 📁 Project Structure

```
the-dark-world/
├── index.html            # Main HTML file
├── styles.css           # All styles and animations
├── main.js             # JavaScript functionality
├── assets-config.js    # Asset configuration
├── firebase-config.js  # Firebase configuration template
├── assets/             # Image assets folder
│   ├── background.jpg  # Main background image (your theme)
│   ├── sword.png       # Sword image for 3D element
│   └── ...             # Other theme images
└── README.md          # This file
```

## 🗡️ 3D Sword Element

The website now features your sword as the main 3D animated element:

- **Sword Float Animation**: Sword gently floats up and down
- **Glow Effect**: Cyan glowing sword blade
- **Energy Particles**: Particles floating around the sword
- **Shine Effect**: Dynamic lighting on the blade

### Sword Image Requirements:
- **Format**: PNG with transparent background
- **Recommended Size**: 200x400 pixels
- **Position**: Sword should be vertical, centered

## 🖼️ Setting Up Your Assets

### Required Images:
1. **background.jpg** - Your theme background image (1920x1080 recommended)
2. **sword.png** - Your sword image (200x400 with transparent background)

### To Add Your Images:
1. Create an `assets` folder in the project directory
2. Add your images to the assets folder
3. The website will automatically load your images!

The website uses your theme images for the background and displays the sword as the main 3D animated element with glowing cyan effects.

## 🚀 Quick Start

### Demo Mode (No Configuration)
Simply open `index.html` in a browser. The website works in demo mode without Firebase configuration.

### Full Firebase Setup

1. Create a Firebase Project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your config to `main.js`
5. Open `index.html` in your browser

## 📧 Contact

- **Waleed Manzoor** - Lead Creator & Visionary
- **Adeeba Arif** - Creative Director & Writer

## 📧 Email Service

This project uses a **local Express + Nodemailer server** to send emails silently and automatically through your Gmail account. No third-party email API keys required.

### Architecture

```
Browser (email-service.js)
    │  POST /api/send-email  (JSON)
    ▼
Local Server (email-server.js + Nodemailer)
    │  SMTP
    ▼
Gmail (thedarkworld.8304@gmail.com)
```

### One-Time Setup (5 minutes)

1. **Get a Gmail App Password** (this is a 16-character code, NOT your regular Gmail password):
   - Open https://myaccount.google.com/security
   - Turn **ON** 2-Step Verification (if not already on)
   - Scroll to **"How you sign in to Google"** → click **App passwords**
   - Choose: **App = Mail**, **Device = Other (Custom name)**
   - Type a name (e.g. `The Dark World Website`) → click **Generate**
   - Google shows a **16-character code** like `abcd efgh ijkl mnop`
   - Copy it (without spaces) and paste it into [`.env`](.env) as `SMTP_PASS`

2. **Start the email server** (keep this terminal open while using the site):
   ```
   npm run start:email
   ```
   You should see: `[EmailServer] Running on http://localhost:3001`

3. **Open the website** in your browser — emails now send automatically on registration and login.

### How It Works

- **Registration** → user gets a welcome email + admin gets a new-player notification (both sent in parallel, silently)
- **Login** → admin gets a login notification email (silent)
- **Profile page** → "Test Email" button sends a test email instantly
- If the server is not running, it gracefully falls back to opening the user's email client via `mailto:`

### Testing

- Click the **Test Email** button on the Profile page
- Register a new account — both confirmation emails fire automatically
- Check the browser console for `[EmailService]` logs and the server terminal for `[EmailServer]` logs

## 📄 License

Copyright © 2026 The Dark World. All rights reserved.

---

*Embrace the darkness, discover your power.*
