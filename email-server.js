// ============================================================
// THE DARK WORLD — Local Email Server (Node.js + Nodemailer)
// ============================================================
// Reads SMTP settings from .env and exposes a REST API at
//   POST /api/send-email  { to, subject, message, name }
// Run with:  node email-server.js
// ============================================================

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

// ── Configuration ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

const smtpConfig = {
  host:     process.env.SMTP_HOST     || 'smtp.gmail.com',
  port:     parseInt(process.env.SMTP_PORT)     || 587,
  secure:   process.env.SMTP_SECURE === 'true',  // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const fromName  = process.env.VITE_EMAIL_FROM_NAME || 'The Dark World';
const fromEmail = process.env.VITE_ADMIN_EMAIL      || process.env.SMTP_USER || 'noreply@thedarkworld.com';
const adminEmail = process.env.VITE_ADMIN_EMAIL     || fromEmail;

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'The Dark World Email Server', timestamp: new Date().toISOString() });
});

// Send-email endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, message, name } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, error: 'Missing "to" field.' });
  }
  if (!subject) {
    return res.status(400).json({ success: false, error: 'Missing "subject" field.' });
  }
  if (!message) {
    return res.status(400).json({ success: false, error: 'Missing "message" field.' });
  }

  console.log(`[EmailServer] → to: ${to} | subject: ${subject}`);

  try {
    // Create a transporter (reuse across requests)
    if (!global._transporter) {
      global._transporter = nodemailer.createTransport(smtpConfig);
      // Verify connection on first use
      await global._transporter.verify();
      console.log('[EmailServer] SMTP connection verified.');
    }

    const mailOptions = {
      from:    `"${fromName}" <${fromEmail}>`,
      to:      to,
      subject: subject,
      text:    message,
    };

    const info = await global._transporter.sendMail(mailOptions);
    console.log('[EmailServer] Sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('[EmailServer] Send failed:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('============================================================');
  console.log('  THE DARK WORLD — Email Server');
  console.log('  Port       :', PORT);
  console.log('  SMTP Host  :', smtpConfig.host + ':' + smtpConfig.port);
  console.log('  SMTP User  :', smtpConfig.auth.user);
  console.log('  From Name  :', fromName);
  console.log('  From Email :', fromEmail);
  console.log('  Admin Email:', adminEmail);
  console.log('  Health     : http://localhost:' + PORT + '/api/health');
  console.log('  Send API   : POST http://localhost:' + PORT + '/api/send-email');
  console.log('============================================================');
});
