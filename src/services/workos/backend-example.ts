/**
 * Backend API Example for WorkOS AuthKit
 * 
 * This is an example of the backend endpoints you need to implement.
 * Use this as a reference when building your backend API.
 * 
 * You can use any backend framework (Express, Next.js, Flask, etc.)
 */

// ============================================================================
// Example using Express.js / Node.js
// ============================================================================

import express from 'express';
import { WorkOS } from '@workos-inc/node';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(express.json());

const workos = new WorkOS(process.env.WORKOS_API_KEY, {
  clientId: process.env.WORKOS_CLIENT_ID,
});

/**
 * GET /api/auth/sign-in
 * Generates authorization URL for sign-in using WorkOS AuthKit
 */
app.get('/api/auth/sign-in', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    // Use 'authkit' provider to use WorkOS's hosted authentication page
    // This supports multiple sign-in methods (Google, GitHub, email/password, etc.)
    provider: 'authkit',
    
    // Redirect URI that matches what's configured in WorkOS dashboard
    redirectUri: process.env.WORKOS_REDIRECT_URI || 'finsh://auth/callback',
    
    clientId: process.env.WORKOS_CLIENT_ID!,
  });

  res.json({ authorizationUrl });
});

/**
 * GET /api/auth/sign-up
 * Generates authorization URL for sign-up using WorkOS AuthKit
 */
app.get('/api/auth/sign-up', (req, res) => {
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: 'authkit',
    redirectUri: process.env.WORKOS_REDIRECT_URI || 'finsh://auth/callback',
    clientId: process.env.WORKOS_CLIENT_ID!,
    // You can add state to track this is a sign-up flow if needed
    state: JSON.stringify({ flow: 'signup' }),
  });

  res.json({ authorizationUrl });
});

/**
 * POST /api/auth/callback
 * Exchanges authorization code for access token and user info
 */
app.post('/api/auth/callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    const { user, accessToken, refreshToken } = await workos.userManagement.authenticateWithCode({
      code,
      clientId: process.env.WORKOS_CLIENT_ID!,
    });

    // Calculate token expiration (typically 1 hour)
    const expiresAt = Date.now() + (60 * 60 * 1000);

    // Return token and user info to mobile app
    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
      expiresAt,
    });
  } catch (error) {
    console.error('Error authenticating with code:', error);
    res.status(401).json({ error: 'Failed to authenticate' });
  }
});

/**
 * GET /api/auth/user
 * Gets current user information using access token
 */
app.get('/api/auth/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  const accessToken = authHeader.replace('Bearer ', '');

  try {
    const user = await workos.userManagement.getUser({
      accessToken,
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * POST /api/auth/refresh
 * Refreshes an expired access token using refresh token
 */
app.post('/api/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'No refresh token provided' });
  }

  try {
    const { user, accessToken: newAccessToken, refreshToken: newRefreshToken } = 
      await workos.userManagement.authenticateWithRefreshToken({
        refreshToken,
        clientId: process.env.WORKOS_CLIENT_ID!,
      });

    const expiresAt = Date.now() + (60 * 60 * 1000);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
      expiresAt,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

/**
 * POST /api/auth/sign-out
 * Signs out the user (can also invalidate token if needed)
 */
app.post('/api/auth/sign-out', async (req, res) => {
  // For WorkOS AuthKit, sign-out is typically handled client-side
  // by clearing the session. Optionally, you can track sign-out events here.
  
  res.json({ success: true });
});

// ============================================================================
// Environment Variables Needed:
// ============================================================================
/*
WORKOS_API_KEY=sk_example_123456789
WORKOS_CLIENT_ID=client_123456789
WORKOS_REDIRECT_URI=finsh://auth/callback
*/

// ============================================================================
// WorkOS Dashboard Configuration:
// ============================================================================
/*
1. Go to WorkOS Dashboard → Authentication → Redirects
2. Add Redirect URI: finsh://auth/callback
3. Add Sign-in endpoint: (your backend URL)/api/auth/sign-in
4. Add Sign-out redirect: finsh:// (or your app's home route)
5. Enable providers in Authentication → Providers (Google, GitHub, etc.)
*/
