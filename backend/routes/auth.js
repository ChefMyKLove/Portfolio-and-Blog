const express = require('express');
const axios = require('axios');
const router = express.Router();
const db = require('../db/db');
const { URLSearchParams } = require('url');

const CLIENT_ID = process.env.PATREON_CLIENT_ID;
const CLIENT_SECRET = process.env.PATREON_CLIENT_SECRET;
const REDIRECT_URI = process.env.PATREON_REDIRECT_URI || 'http://localhost:3002/auth/patreon/callback';
const PATREON_AUTH_URL = 'https://www.patreon.com/oauth2/authorize';
const PATREON_TOKEN_URL = 'https://www.patreon.com/api/oauth2/token';
const PATREON_API_URL = 'https://www.patreon.com/api/oauth2/v2/identity';

// Step 1: Redirect user to Patreon login
router.get('/patreon', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  req.session.oauthState = state;
  
  const authUrl = `${PATREON_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identity%20identity[email]&state=${state}`;
  
  res.redirect(authUrl);
});

// Step 2: Handle callback from Patreon
router.get('/patreon/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code received' });
  }

  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'State mismatch. Possible CSRF attack.' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(PATREON_TOKEN_URL, 
      new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user info from Patreon
    const userResponse = await axios.get(PATREON_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        'include': 'memberships'
      }
    });

    const user = userResponse.data.data;
    const relationships = user.relationships || {};
    const memberships = relationships.memberships?.data || [];

    // Check if user has active membership
    const isPatron = memberships.length > 0;
    const patreonId = user.id;
    const email = user.attributes?.email;
    const firstName = user.attributes?.first_name;
    const lastName = user.attributes?.last_name;

    // Store/update user in database
    await db.saveUser({
      patreon_id: patreonId,
      email,
      first_name: firstName,
      last_name: lastName,
      is_patron: isPatron,
      access_token: accessToken
    });

    // Create session
    req.session.userId = patreonId;
    req.session.isPatron = isPatron;
    req.session.email = email;

    // Redirect to frontend blog with success
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/blog/blook.html?token=${accessToken}&patron=${isPatron}`);

  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Authentication failed',
      details: error.response?.data || error.message
    });
  }
});

// Step 3: Verify current session
router.get('/verify', (req, res) => {
  if (req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId,
      isPatron: req.session.isPatron,
      email: req.session.email
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
