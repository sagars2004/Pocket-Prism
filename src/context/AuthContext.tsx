/**
 * Authentication Context
 * 
 * Manages user authentication state using WorkOS AuthKit.
 * Integrates with UserContext to sync authenticated user data.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkOSUser, WorkOSSession, signIn, signUp, getStoredSession, signOut as workOSSignOut, getCurrentUser } from '../services/workos/auth';

interface AuthContextType {
  user: WorkOSUser | null;
  session: WorkOSSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<WorkOSSession | null>(null);
  const [user, setUser] = useState<WorkOSUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const storedSession = await getStoredSession();
        if (storedSession) {
          setSession(storedSession);
          // Fetch latest user info
          try {
            const userInfo = await getCurrentUser(storedSession.accessToken);
            setUser(userInfo);
          } catch (error) {
            console.error('Error fetching user info:', error);
            // If token is invalid, clear session
            setSession(null);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  const handleSignIn = async () => {
    try {
      const newSession = await signIn();
      setSession(newSession);
      setUser(newSession.user);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignUp = async () => {
    try {
      const newSession = await signUp();
      setSession(newSession);
      setUser(newSession.user);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await workOSSignOut();
      setSession(null);
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!session) return;
    
    try {
      const userInfo = await getCurrentUser(session.accessToken);
      setUser(userInfo);
      
      // Update session with latest user info
      setSession({
        ...session,
        user: userInfo,
      });
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If token is invalid, sign out
      if (error instanceof Error && error.message.includes('Failed')) {
        await signOut();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: !!session,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
