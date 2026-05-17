# Google Apps Script Email Relay — Setup Guide

This project now uses a **Google Apps Script** as a free, reliable email relay.
It sends emails through your own Gmail account (`thedarkworld.8304@gmail.com`)
with zero third-party dependencies.

---

## One-Time Setup (5 minutes)

### Step 1 — Create the Apps Script

1. Go to **https://script.google.com/**
2. Click **New project**
3. Delete the default `myFunction` code and paste this:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var to      = data.to      || '';
    var subject = data.subject || 'No Subject';
    var message = data.message || '';
    var name    = data.name    || '';

    if (!to) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Missing to' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    MailApp.sendEmail({
      to:      to,
      subject: subject,
      body:    message,
      name:    name,
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 2 — Deploy as a Web App

1. Click **Deploy** → **New deployment**
2. Click the gear ⚙️ next to **Select type** → choose **Web app**
3. Set:
   - **Description:** Email Relay
   - **Execute as:** `Me (thedarkworld.8304@gmail.com)`
   - **Who has access:** `Anyone`  ← important!
4. Click **Deploy**
5. Copy the **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycbx.../exec`)

### Step 3 — Authorize

1. Open the Web App URL in a new browser tab
2. You'll see a Google authorization screen — click **Review permissions**
3. Choose your account → click **Advanced** → **Go to [project name] (unsafe)**
4. Click **Allow**
5. You'll see `{"success":true}` — that means it works!

### Step 4 — Paste the URL into env.js

Open [`env.js`](env.js:1) and replace the `VITE_GAS_WEB_APP_URL` value:

```javascript
VITE_GAS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbx.../exec",
```

---

## How It Works

- The browser `POST`s JSON to your Google Apps Script URL
- The script calls `MailApp.sendEmail()` using **your Gmail account's SMTP**
- Emails arrive from `thedarkworld.8304@gmail.com` — no spam folder issues
- **100% free**, no rate limits for personal use
- No third-party service can go down (it's Google's infrastructure)
