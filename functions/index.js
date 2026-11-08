const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize Firebase Admin once
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Gemini API key is stored server-side only (Firebase Functions config or environment secret).
// NEVER expose this key to the browser via VITE_ prefix.
// To set: firebase functions:config:set gemini.api_key="YOUR_KEY"
// Or set environment variable GEMINI_API_KEY in Cloud Run secrets (2nd gen).
function getGeminiKey() {
  // 2nd-gen Cloud Run env var (set via firebase functions:secrets:set GEMINI_API_KEY)
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  // 1st-gen Firebase Functions config
  try {
    const config = functions.config();
    if (config.gemini && config.gemini.api_key) return config.gemini.api_key;
  } catch { /* no config in emulator */ }
  return null;
}

/**
 * Verify the Firebase ID token from the Authorization header.
 * Returns the decoded token or throws if invalid.
 */
async function verifyIdToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const err = new Error('Missing or malformed Authorization header');
    err.status = 401;
    throw err;
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    return await admin.auth().verifyIdToken(idToken);
  } catch {
    const err = new Error('Invalid or expired Firebase ID token');
    err.status = 401;
    throw err;
  }
}

app.all('*', async (req, res) => {
  try {
    // 1. Verify Firebase ID token (real verification via Firebase Admin)
    await verifyIdToken(req.headers.authorization);

    // 2. Get Gemini API key (server-side only)
    const GEMINI_API_KEY = getGeminiKey();
    if (!GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Gemini API key not configured on server. ' +
               'Run: firebase functions:config:set gemini.api_key="YOUR_KEY"'
      });
    }

    // 3. Construct Gemini URL
    // req.path for the proxy is everything after /geminiProxy
    // e.g. /v1beta/models/gemini-1.5-flash:generateContent
    const geminiPath = req.path.replace(/^\/geminiProxy/, '');
    const url = `https://generativelanguage.googleapis.com${geminiPath}?key=${GEMINI_API_KEY}`;

    // 4. Proxy the request to Google's Generative Language API
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD'
        ? JSON.stringify(req.body)
        : undefined,
    });

    // 5. Stream response back to client
    res.status(response.status);
    response.headers.forEach((val, key) => {
      // Don't forward headers that would conflict
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        res.setHeader(key, val);
      }
    });

    if (response.body) {
      for await (const chunk of response.body) {
        res.write(chunk);
      }
      res.end();
    } else {
      res.send(await response.text());
    }

  } catch (error) {
    const status = error.status || 500;
    if (status === 401) {
      return res.status(401).json({ error: error.message });
    }
    console.error('Gemini proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

exports.geminiProxy = functions.https.onRequest(app);
