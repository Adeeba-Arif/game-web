# Google Apps Script Email Relay — Setup Guide

This project uses a **Google Apps Script** as a free, reliable email relay.
It sends emails through your own Gmail account (`thedarkworld.8304@gmail.com`)
with zero third-party dependencies.

> **If you already deployed the script but get a 302 redirect or no email:**
> The deployment is likely misconfigured. Delete the old deployment and
> re-deploy following the steps below exactly — especially the **"Who has access"**
> and **entry point function** settings.

---

## One-Time Setup (5 minutes)

### Step 1 — Open Your Existing Script (or Create a New One)

If you already have a script deployed:

1. Go to **https://script.google.com/** and open your existing project
2. **Delete the old code** and paste the new CORS-enabled version below
3. Click **💾 Save**

If you don't have a script yet, click **New project** and paste this:

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var to      = data.to      || '';
    var subject = data.subject || 'No Subject';
    var message = data.message || '';
    var name    = data.name    || '';

    if (!to) {
      return jsonResponse({ success: false, error: 'Missing "to" field.' });
    }

    MailApp.sendEmail({
      to:      to,
      subject: subject,
      body:    message,
      name:    name,
    });

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Build a JSON response with CORS headers so browsers can read it.
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
}

/**
 * Handle CORS preflight requests from browsers.
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '3600',
    });
}
```

> **Why the CORS version?** The old script used `no-cors` mode which hides all errors.
> The new version sends CORS headers so the browser can read the actual response
> and show you exactly what went wrong in the console.

4. Click **💾 Save** and name it **"The Dark World Email Relay"**

---

### Step 2 — Deploy as a Web App

1. Click **Deploy** → **New deployment**
2. Click the **⚙️ gear icon** next to "Select type" → choose **Web app**
3. Fill in the deployment form **exactly** as shown:

   | Field | Value |
   |---|---|
   | **Description** | `Email Relay` |
   | **Execute as** | `Me (thedarkworld.8304@gmail.com)` |
   | **Who has access** | `Anyone` |

   > ⚠️ **"Who has access" must be "Anyone"** — if it says "Only myself" or
   > "Anyone with the link", the script will return a 302 redirect instead of
   > executing, and no email will be sent.

4. Click **Deploy**
5. You will be asked to **authorize** the script:
   - Click **Review permissions**
   - Choose your account (`thedarkworld.8304@gmail.com`)
   - Click **Advanced** → **Go to The Dark World Email Relay (unsafe)**
   - Click **Allow**
6. After authorization, copy the **Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

---

### Step 3 — Verify the Deployment

Before pasting the URL into `env.js`, verify it actually executes:

```bash
curl -s -o /dev/null -w "%{http_code}" -X POST \
  "PASTE_YOUR_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{"to":"thedarkworld.8304@gmail.com","subject":"GAS Test","message":"test"}'
```

**Expected output:** `200`  
**If you see `302`:** The deployment is wrong — go back to Step 2 and make sure
"Who has access" is set to **Anyone**, then deploy again.

---

### Step 4 — Paste the URL into `env.js`

Open [`env.js`](env.js:17) and replace the `VITE_GAS_WEB_APP_URL` value:

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

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `302` redirect from GAS URL | Re-deploy — "Who has access" must be **Anyone** |
| `{"success":false,"error":"Bad credentials"}` | Re-authorize the script in GAS |
| No email received, console shows GAS success | Check Gmail Sent folder; email may be in spam |
| `VITE_GAS_WEB_APP_URL is not set` | Paste the URL into `env.js` |
