import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '../../types/user';

const USER_DATA_KEY = '@pocketprism:userData';

/**
 * Save user data to AsyncStorage
 */
export async function saveUserData(userData: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}

/**
 * Load user data from AsyncStorage
 */
export async function loadUserData(): Promise<UserData | null> {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    
    const parsed: any = JSON.parse(data);
    
    // Ensure onboardingComplete is a boolean (not a string from corrupted data)
    if (parsed && typeof parsed.onboardingComplete !== 'boolean') {
      parsed.onboardingComplete = parsed.onboardingComplete === true || parsed.onboardingComplete === 'true';
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
}

/**
 * Clear user data from AsyncStorage
 */
export async function clearUserData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
}
