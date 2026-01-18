/**
 * Storage Service Interface
 * 
 * This interface defines the contract for storage services, allowing
 * easy swapping between different storage backends (AsyncStorage, Convex, WorkOS, etc.)
 */

import { UserData } from '../../types/user';

export interface StorageService {
  /**
   * Save user data to storage
   */
  saveUserData(data: UserData): Promise<void>;

  /**
   * Load user data from storage
   */
  loadUserData(): Promise<UserData | null>;

  /**
   * Clear user data from storage
   */
  clearUserData(): Promise<void>;
}

/**
 * Storage provider type for dependency injection
 */
export type StorageProvider = 'localStorage' | 'convex' | 'workos' | 'replit';
