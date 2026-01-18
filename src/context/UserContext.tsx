/**
 * User Context
 * 
 * Manages global user state (salary, expenses, onboarding status).
 * 
 * Future Integration Notes:
 * - Will integrate with WorkOS for authentication (see docs/FUTURE_INTEGRATIONS.md)
 * - Will support Convex database for real-time sync (see docs/FUTURE_INTEGRATIONS.md)
 * - Currently uses Replit DB with AsyncStorage fallback
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../types/user';
import { loadUserDataFromReplit, saveUserDataToReplit } from '../services/replit/database';

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => Promise<void>;
  clearUserData: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await loadUserDataFromReplit();
        setUserDataState(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const setUserData = async (data: UserData) => {
    try {
      await saveUserDataToReplit(data);
      setUserDataState(data);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };

  const clearUserData = async () => {
    try {
      const { clearUserData: clearLocal } = await import('../services/storage/localStorage');
      await clearLocal();
      setUserDataState(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, clearUserData, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
