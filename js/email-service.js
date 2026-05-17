// ========================================
// THE DARK WORLD - Email Service Module
// Primary: Google Apps Script relay (free, uses your Gmail, no passwords)
// Fallback: Local email server (email-server.js) if available
// ========================================

(function () {
    'use strict';

    // ── Configuration ──────────────────────────────────────────────────────────
    var CFG = {
        // Google Apps Script web-app URL (primary relay — public URL, works from any browser)
        gasUrl:     window.env?.VITE_GAS_WEB_APP_URL     || '',

        // Local Nodemailer email server (dev/testing fallback — see email-server.js)
        serverUrl:  window.env?.VITE_EMAIL_SERVER_URL    || 'http://localhost:3001',

        adminEmail: window.env?.VITE_ADMIN_EMAIL          || 'thedarkworld.8304@gmail.com',
        fromName:   window.env?.VITE_EMAIL_FROM_NAME      || 'The Dark World',
        fromEmail:  window.env?.VITE_ADMIN_EMAIL          || 'thedarkworld.8304@gmail.com',
    };

    console.info('[EmailService] Config loaded:', {
        gasUrl:     CFG.gasUrl     ? CFG.gasUrl.replace(/\/exec.*/, '/exec') : '(not set)',
        serverUrl:  CFG.serverUrl,
        adminEmail: CFG.adminEmail,
        fromName:   CFG.fromName,
        fromEmail:  CFG.fromEmail,
    });

    // ── Internal helpers ───────────────────────────────────────────────────────

    function encode(str) { return encodeURIComponent(str || ''); }

    function formatTimestamp(ts) {
        var d = ts instanceof Date ? ts : new Date(ts);
        return d.toLocaleString('en-US', {
            timeZone: 'Asia/Karachi',
            year:    'numeric',
            month:   'long',
            day:     'numeric',
            hour:    '2-digit',
            minute:  '2-digit',
            second:  '2-digit',
        });
    }

    // ── Google Apps Script relay ────────────────────────────────────────────────

    /**
     * Send via Google Apps Script web-app.
     * The GAS script calls MailApp.sendEmail() using your Gmail account.
     * Uses mode: 'no-cors' because GAS doesn't send CORS headers.
     */
    async function sendViaGAS(to, subject, message, name) {
        if (!CFG.gasUrl || CFG.gasUrl.indexOf('YOUR_SCRIPT_ID') !== -1) {
            throw new Error(
                'VITE_GAS_WEB_APP_URL is not set in env.js. ' +
                'Follow the setup guide in GOOGLE_APPS_SCRIPT_SETUP.md'
            );
        }

        var payload = { to, subject, message, name: name || '' };
        console.info('[EmailService] Sending via Google Apps Script →', to);

        await fetch(CFG.gasUrl, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
            mode:    'no-cors',
        });

        // no-cors gives an opaque response — treat any response as success
        console.info('[EmailService] GAS request completed (check GAS execution log for details).');
        return { success: true, relay: 'GAS' };
    }

    // ── Local email server relay ────────────────────────────────────────────────

    async function sendViaServer(to, subject, message, name) {
        var url = CFG.serverUrl.replace(/\/$/, '') + '/api/send-email';
        console.info('[EmailService] POST → local server →', to);

        var controller = new AbortController();
        var timeoutId = setTimeout(function () { controller.abort(); }, 10000);

        try {
            var response = await fetch(url, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ to, subject, message, name: name || '' }),
                signal:  controller.signal,
            });
            clearTimeout(timeoutId);

            var data = {};
            try { data = await response.json(); } catch (_) {}

            if (data.success) {
                console.info('[EmailService] Sent via local server →', to);
                return { success: true, relay: 'local-server' };
            } else {
                throw new Error(data.error || 'Server error');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn('[EmailService] Local server failed:', err.message);
            throw err;
        }
    }

    // ── Unified send helper ────────────────────────────────────────────────────

    /**
     * Try Google Apps Script first (public URL, works from any browser),
     * then local Nodemailer server (dev/testing), then mailto: fallback.
     * Each step logs exactly what happened so failures are visible in the console.
     */
    async function sendEmail(to, subject, message, name) {
        // 1️⃣ Try Google Apps Script (works from any browser — primary for production)
        if (CFG.gasUrl && CFG.gasUrl.indexOf('YOUR_SCRIPT_ID') === -1) {
            try {
                console.info('[EmailService] Relay 1/3 → GAS →', to);
                var gasResult = await sendViaGAS(to, subject, message, name);
                console.info('[EmailService] Relay 1/3 → GAS → success:', to);
                return gasResult;
            } catch (err) {
                console.warn('[EmailService] Relay 1/3 → GAS FAILED:', err.message, '→ trying local server…');
            }
        } else {
            console.info('[EmailService] Relay 1/3 → GAS skipped (URL not set or placeholder)');
        }

        // 2️⃣ Try local Nodemailer server (dev/testing only — localhost is not reachable from other machines)
        try {
            console.info('[EmailService] Relay 2/3 → Local server →', to);
            var serverResult = await sendViaServer(to, subject, message, name);
            console.info('[EmailService] Relay 2/3 → Local server → success:', to);
            return serverResult;
        } catch (err) {
            console.warn('[EmailService] Relay 2/3 → Local server FAILED:', err.message, '→ falling back to mailto:…');
        }

        // 3️⃣ Fall back to mailto: (opens user's email client — NOT a real send)
        console.warn('[EmailService] Relay 3/3 → mailto: fallback (no real email sent) →', to);
        var mailto = 'mailto:' + encode(to) +
            '?subject=' + encode(subject) +
            '&body=' + encode(message);
        var a = document.createElement('a');
        a.href = mailto;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return { success: false, fallback: true, error: 'No email relay available. mailto: fallback opened — no email was sent.' };
    }

    // ── Public API ─────────────────────────────────────────────────────────────

    var _serverAlive = false;   // cached health-check result

    /**
     * Probe the local email server /api/health endpoint once and cache the result.
     * Returns a promise that resolves to true if the server is reachable.
     */
    async function probeServer() {
        if (_serverAlive) return true;
        if (!CFG.serverUrl) return false;
        try {
            var ctrl = new AbortController();
            var tid  = setTimeout(function () { ctrl.abort(); }, 3000);
            var resp = await fetch(CFG.serverUrl.replace(/\/$/, '') + '/api/health', {
                method:  'GET',
                signal:  ctrl.signal,
                mode:   'cors',
            });
            clearTimeout(tid);
            _serverAlive = resp.ok;
        } catch (_) {
            _serverAlive = false;
        }
        return _serverAlive;
    }

    var EmailService = {

        get ready() {
            return (!!CFG.gasUrl && CFG.gasUrl.indexOf('YOUR_SCRIPT_ID') === -1) || _serverAlive;
        },

        get initError() {
            if (this.ready) return null;
            return 'No email relay reachable. ' +
                   'Set VITE_GAS_WEB_APP_URL in env.js (see GOOGLE_APPS_SCRIPT_SETUP.md) ' +
                   'or start the local server (node email-server.js).';
        },

        async sendUserConfirmation(userEmail, username, timestamp) {
            console.info('[EmailService] ── sendUserConfirmation() ──');
            if (!userEmail) {
                console.error('[EmailService] userEmail is empty – aborting.');
                return { success: false, error: 'userEmail is required.' };
            }
            var subject = 'Welcome to The Dark World – Registration Confirmed';
            var body =
                'You have successfully registered for The Dark World.\n\n' +
                'We are thrilled to have you join our community of survivors.\n' +
                'Keep an eye on your inbox for upcoming game updates and exclusive content.\n\n' +
                'Stay vigilant,\n' +
                'The Dark World Team';
            return await sendEmail(userEmail, subject, body, username || userEmail);
        },

        async sendAdminNotification(userEmail, username, timestamp) {
            console.info('[EmailService] ── sendAdminNotification() ──');
            var subject = 'New Player Registration – The Dark World';
            var body =
                'A new player has registered for The Dark World.\n\n' +
                'Registration Details:\n' +
                '─────────────────────────────\n' +
                'Username  : ' + (username || 'N/A') + '\n' +
                'Email     : ' + userEmail + '\n' +
                'Timestamp : ' + formatTimestamp(timestamp || Date.now()) + '\n' +
                '─────────────────────────────\n\n' +
                'Please review this registration in the admin dashboard.\n';
            return await sendEmail(CFG.adminEmail, subject, body, 'Admin');
        },

        async sendLoginNotification(userEmail, username, timestamp) {
            console.info('[EmailService] ── sendLoginNotification() ──');
            var subject = 'User Login Notification – The Dark World';
            var body =
                'A user has logged into The Dark World.\n\n' +
                'User Details:\n' +
                '─────────────────────────────\n' +
                'Username  : ' + (username || 'N/A') + '\n' +
                'Email     : ' + userEmail + '\n' +
                'Timestamp : ' + formatTimestamp(timestamp || Date.now()) + '\n' +
                '─────────────────────────────\n\n' +
                'This is an automated notification.\n';
            return await sendEmail(CFG.adminEmail, subject, body, 'Admin');
        },

        async sendRegistrationEmails(userEmail, username, timestamp) {
            console.info('[EmailService] ── sendRegistrationEmails() ──');
            var userPromise  = this.sendUserConfirmation(userEmail, username, timestamp);
            var adminPromise = this.sendAdminNotification(userEmail, username, timestamp);
            var userResult   = await userPromise;
            var adminResult  = await adminPromise;

            console.info('[EmailService] ── Results ──');
            console.info('[EmailService]   User confirmation  :',
                userResult.success ? 'SENT'  : 'FAILED →',
                userResult.success  ? '' : userResult.error,
                '| relay:', userResult.relay || '?');
            console.info('[EmailService]   Admin notification :',
                adminResult.success ? 'SENT' : 'FAILED →',
                adminResult.success ? '' : adminResult.error,
                '| relay:', adminResult.relay || '?');

            if (userResult.success && adminResult.success) {
                console.info('[EmailService] Both emails sent.');
            } else if (userResult.success) {
                console.warn('[EmailService] User sent but admin FAILED.');
            } else if (adminResult.success) {
                console.warn('[EmailService] Admin sent but user FAILED.');
            } else {
                console.error('[EmailService] Both emails FAILED.');
            }

            return { user: userResult, admin: adminResult };
        },

        async sendTestEmail(testRecipient) {
            console.info('[EmailService] ── sendTestEmail() ──');
            var to = testRecipient || CFG.adminEmail;
            var subject = 'Test Email – The Dark World';
            var body =
                'This is a test email sent from The Dark World email service.\n\n' +
                'If you received this, the email pipeline is working correctly.\n\n' +
                'Sent at: ' + formatTimestamp(Date.now()) + '\n';

            var result = await sendEmail(to, subject, body, 'Test User');
            if (result.success) {
                console.info('[EmailService] Test email sent to:', to, '| relay:', result.relay || '?');
            } else {
                console.error('[EmailService] Test email FAILED:', result.error, '| relay:', result.relay || '?');
            }
            return result;
        },

        getStatus() {
            return {
                ready:       this.ready,
                initError:   this.initError,
                serverAlive: _serverAlive,
                config: {
                    gasUrl:     CFG.gasUrl     ? CFG.gasUrl.replace(/\/exec.*/, '/exec') : '(not set)',
                    serverUrl:  CFG.serverUrl,
                    adminEmail: CFG.adminEmail,
                    fromName:   CFG.fromName,
                    fromEmail:  CFG.fromEmail,
                },
            };
        },
    };

    window.EmailService = EmailService;

    if (!window.EmailService) {
        console.warn('[EmailService] Stub installed.');
        window.EmailService = {
            get ready() { return false; },
            get initError() { return 'Email service unavailable.'; },
            async sendUserConfirmation() { return { success: false, error: 'Email service unavailable.' }; },
            async sendAdminNotification() { return { success: false, error: 'Email service unavailable.' }; },
            async sendLoginNotification() { return { success: false, error: 'Email service unavailable.' }; },
            async sendRegistrationEmails() {
                return { user: { success: false, error: 'Email service unavailable.' }, admin: { success: false, error: 'Email service unavailable.' } };
            },
            async sendTestEmail() { return { success: false, error: 'Email service unavailable.' }; },
            getStatus() { return { ready: false, initError: 'Email service unavailable.', config: {} }; },
        };
    }

    console.info('[EmailService] Service ready:', EmailService.ready);
    console.info('[EmailService] Priority: 1) GAS (public URL)  →  2) Local server  →  3) mailto: fallback');

    // Probe the local email server in the background
    probeServer().then(function (alive) {
        console.info('[EmailService] Local server health:', alive ? '✅ reachable' : '❌ not reachable');
        console.info('[EmailService] Service ready:', EmailService.ready);
        if (!alive) {
            console.warn('[EmailService] Start the server with: node email-server.js');
        }
    });

    if (window.location.search.includes('test-email')) {
        console.info('[EmailService] ?test-email detected – sending…');
        EmailService.sendTestEmail().then(function (res) {
            if (res.success) {
                console.info('[EmailService] Test email sent.');
            } else {
                console.error('[EmailService] Test email FAILED:', res.error);
            }
        });
    }
})();
