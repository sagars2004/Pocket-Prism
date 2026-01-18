/**
 * WorkOS AuthKit Service
 * 
 * Handles authentication with WorkOS AuthKit (hosted authentication flow).
 * 
 * Architecture:
 * - Backend API generates authorization URLs using WorkOS SDK
 * - React Native app opens OAuth flow in WebBrowser
 * - Callback handled via deep linking
 * - Session stored securely in AsyncStorage
 * 
 * Note: You need a backend API endpoint to handle WorkOS API calls
 * (API keys must be kept server-side for security).
 */

import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get environment variables from Expo config or environment
const getConfigValue = (key: string, fallback: string = ''): string => {
  if (Constants.expoConfig?.extra) {
    return Constants.expoConfig.extra[key] || fallback;
  }
  // Fallback to process.env for non-Expo environments
  return (process.env as any)[`EXPO_PUBLIC_${key}`] || fallback;
};

const API_URL = getConfigValue('apiUrl', 'https://your-api.com');
const REDIRECT_URI = Linking.createURL('/auth/callback');
const STORAGE_KEY = '@finsh:workos_session';

WebBrowser.maybeCompleteAuthSession();

export interface WorkOSUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  createdAt: string;
}

export interface WorkOSSession {
  accessToken: string;
  refreshToken?: string;
  user: WorkOSUser;
  expiresAt?: number;
}

/**
 * Get the authorization URL for WorkOS AuthKit
 * Uses WorkOS's hosted AuthKit which supports multiple providers (Google, GitHub, etc.)
 * Calls your backend API which handles WorkOS OAuth flow
 */
export async function getAuthorizationUrl(type: 'signIn' | 'signUp' = 'signIn'): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/auth/${type === 'signUp' ? 'sign-up' : 'sign-in'}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get authorization URL');
    }
    
    const { authorizationUrl } = await response.json();
    return authorizationUrl;
  } catch (error) {
    console.error('Error getting authorization URL:', error);
    throw error;
  }
}

/**
 * Exchange authorization code for access token
 * This is handled by your backend API endpoint
 */
export async function exchangeCodeForToken(code: string): Promise<WorkOSSession> {
  try {
    const response = await fetch(`${API_URL}/api/auth/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }
    
    const data = await response.json();
    
    // Backend should return: { accessToken, user, refreshToken?, expiresAt? }
    const session: WorkOSSession = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
      expiresAt: data.expiresAt,
    };
    
    // Store session
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    
    return session;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
}

/**
 * Initiate WorkOS AuthKit sign-in flow
 */
export async function signIn(): Promise<WorkOSSession> {
  try {
    // Get authorization URL from backend (uses WorkOS hosted AuthKit)
    const authUrl = await getAuthorizationUrl('signIn');
    
    // Open AuthKit flow in browser
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    
    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      
      if (!code) {
        // If no code, check if token is in URL (if backend handles redirect directly)
        const token = url.searchParams.get('token');
        if (token) {
          // Token was provided directly in callback
          const userId = url.searchParams.get('userId');
          const session: WorkOSSession = {
            accessToken: token,
            user: {
              id: userId || 'unknown',
              email: '',
              createdAt: new Date().toISOString(),
            },
          };
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          return session;
        }
        throw new Error('No authorization code or token received');
      }
      
      // Exchange code for token via backend
      const session = await exchangeCodeForToken(code);
      
      return session;
    } else {
      throw new Error('OAuth flow was cancelled or failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Initiate WorkOS AuthKit sign-up flow
 */
export async function signUp(): Promise<WorkOSSession> {
  try {
    // Get authorization URL from backend (uses WorkOS hosted AuthKit)
    const authUrl = await getAuthorizationUrl('signUp');
    
    // Open AuthKit flow in browser
    const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
    
    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      
      if (!code) {
        throw new Error('No authorization code received');
      }
      
      // Exchange code for token via backend
      const session = await exchangeCodeForToken(code);
      
      return session;
    } else {
      throw new Error('OAuth flow was cancelled or failed');
    }
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

/**
 * Get stored session
 */
export async function getStoredSession(): Promise<WorkOSSession | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const session: WorkOSSession = JSON.parse(stored);
    
    // Check if session is expired
    if (session.expiresAt && session.expiresAt < Date.now()) {
      // Try to refresh token if available
      if (session.refreshToken) {
        return await refreshSession(session.refreshToken);
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error getting stored session:', error);
    return null;
  }
}

/**
 * Refresh access token (if refresh token is available)
 */
async function refreshSession(refreshToken: string): Promise<WorkOSSession | null> {
  try {
    // Call your backend to refresh token
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }
    
    const session = await response.json();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
}

/**
 * Get current user information
 */
export async function getCurrentUser(accessToken: string): Promise<WorkOSUser> {
  try {
    // Call your backend to get user info (WorkOS API key is server-side only)
    const response = await fetch(`${API_URL}/api/auth/user`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    const { user } = await response.json();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    // Optionally call backend to invalidate token
    const session = await getStoredSession();
    if (session?.accessToken) {
      await fetch(`${API_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
      });
    }
    
    // Clear local storage
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error signing out:', error);
    // Still clear local storage even if backend call fails
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getStoredSession();
  return session !== null;
}
