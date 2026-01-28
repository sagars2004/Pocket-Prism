import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import { useRoute } from '@react-navigation/native';

interface FooterProps {
  onHomePress?: () => void;
  onPlanPress?: () => void;
  onTipsPress?: () => void;
  onSettingsPress?: () => void;
  navigation?: any; // For navigation to settings and tips
}

export function Footer({ onHomePress, onPlanPress, onTipsPress, onSettingsPress, navigation }: FooterProps) {
  const { currentColors, isDark } = useTheme();
  const { clearUserData } = useUser();
  const { resetOnboarding } = useOnboarding();

  // Get current route to handle navigation history intelligently
  // If we are already on a "Tab" screen, we replace it.
  // If we are on a "Base" screen (Dashboard, Onboarding), we navigate (push).
  let routeName = '';
  try {
    const route = useRoute();
    routeName = route.name;
  } catch (e) {
    // Fallback if used outside navigation context
    console.log('Footer used outside navigation context');
  }

  const isTabScreen = (name: string) => ['Plan', 'Settings', 'Tips'].includes(name);

  const handleNavigation = (targetScreen: string, localHandler?: () => void) => {
    if (navigation) {
      if (routeName === targetScreen) return; // Already on screen

      if (isTabScreen(routeName)) {
        // Replace current tab with new tab to prevent stack buildup
        navigation.replace(targetScreen);
      } else {
        // Push tab on top of base screen
        navigation.navigate(targetScreen);
      }
    } else if (localHandler) {
      localHandler();
    }
  };

  const handleSettingsPress = () => handleNavigation('Settings', onSettingsPress);
  const handlePlanPress = () => handleNavigation('Plan', onPlanPress);
  const handleTipsPress = () => handleNavigation('Tips', onTipsPress);

  const handleHomePress = async () => {
    // Check if we're already on Welcome screen
    const currentRoute = navigation?.getState()?.routes[navigation?.getState()?.index || 0]?.name;

    if (currentRoute === 'Welcome') {
      // Already on Welcome screen, no action needed
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      'Return to Homepage?',
      'Do you want to return to the homepage? Your progress will not be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data
              await clearUserData();
              // Reset onboarding data (clears all input fields)
              resetOnboarding();
              // Navigate to Welcome screen
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              } else if (onHomePress) {
                onHomePress();
              }
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getActiveTab = () => {
    if (routeName === 'Settings') return 'Settings';
    if (routeName === 'Plan') return 'Plan';
    if (routeName === 'Tips') return 'Tips';
    return 'Home';
  };
  const activeTab = getActiveTab();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderTopWidth: 4,
      borderTopColor: currentColors.borderLight,
      backgroundColor: currentColors.surface,
      minHeight: spacing.touchTarget,
    },
    iconButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      minWidth: 60,
    },
    icon: {
      marginBottom: 2,
    },
    label: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontSize: 12,
      fontWeight: '500',
    },
    activeLine: {
      height: 3,
      width: 20,
      backgroundColor: isDark ? '#FFFFFF' : '#000000',
      marginTop: 4,
      borderRadius: 2,
    }
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="home-variant-outline"
          size={26}
          color={activeTab === 'Home' ? currentColors.text : currentColors.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.label, activeTab === 'Home' && { color: currentColors.text, fontWeight: '700' }]}>Home</Text>
        {activeTab === 'Home' && <View style={styles.activeLine} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={handlePlanPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="chart-timeline-variant"
          size={26}
          color={activeTab === 'Plan' ? currentColors.text : currentColors.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.label, activeTab === 'Plan' && { color: currentColors.text, fontWeight: '700' }]}>Plan</Text>
        {activeTab === 'Plan' && <View style={styles.activeLine} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleTipsPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="lightbulb-on-outline"
          size={26}
          color={activeTab === 'Tips' ? currentColors.text : currentColors.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.label, activeTab === 'Tips' && { color: currentColors.text, fontWeight: '700' }]}>Tips</Text>
        {activeTab === 'Tips' && <View style={styles.activeLine} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleSettingsPress}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={26}
          color={activeTab === 'Settings' ? currentColors.text : currentColors.textSecondary}
          style={styles.icon}
        />
        <Text style={[styles.label, activeTab === 'Settings' && { color: currentColors.text, fontWeight: '700' }]}>Settings</Text>
        {activeTab === 'Settings' && <View style={styles.activeLine} />}
      </TouchableOpacity>
    </View>
  );
}
