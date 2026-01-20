import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { useUser } from '../../context/UserContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToHome?: () => void;
  navigation?: any;
}

export function SettingsScreen({ onBack, onNavigateToHome, navigation }: SettingsScreenProps) {
  const { userData, clearUserData } = useUser();
  const { resetOnboarding } = useOnboarding();
  const { themeMode, setThemeMode, currentColors, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);

  const handleThemeChange = async (mode: 'system' | 'light' | 'dark') => {
    await setThemeMode(mode);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your information and reset the app. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserData();
              // Also clear any in-memory onboarding form state
              resetOnboarding();
              Alert.alert('Success', 'All data has been cleared.');
              // Navigate to welcome screen
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Welcome' }],
                });
              } else if (onNavigateToHome) {
                onNavigateToHome();
              } else {
                onBack();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data export feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handleTermsAndConditions = () => {
    Alert.alert(
      'Terms & Conditions',
      'Terms & Conditions content will be displayed here. This feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Privacy Policy content will be displayed here. This feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
      backgroundColor: currentColors.surface,
    },
    backButton: {
      padding: spacing.sm,
    },
    backButtonText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '700',
    },
    title: {
      ...typography.h3,
      color: currentColors.text,
    },
    placeholder: {
      width: 60,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    card: {
      marginBottom: spacing.md,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    settingInfo: {
      flex: 1,
      marginRight: spacing.md,
    },
    settingLabel: {
      ...typography.body,
      fontWeight: '500',
      marginBottom: spacing.xs,
    },
    settingDescription: {
      ...typography.caption,
    },
    arrow: {
      ...typography.h3,
      fontSize: 24,
    },
    sectionHeader: {
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h4,
      fontWeight: '600',
    },
    appearanceOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    appearanceInfo: {
      flex: 1,
    },
    appearanceLabel: {
      ...typography.body,
      fontWeight: '500',
      marginBottom: spacing.xs,
    },
    appearanceDescription: {
      ...typography.caption,
    },
    checkmark: {
      ...typography.h4,
      fontSize: 20,
      fontWeight: '700',
    },
    accountInfo: {
      marginTop: spacing.sm,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
    },
    infoLabel: {
      ...typography.body,
    },
    infoValue: {
      ...typography.body,
      fontWeight: '500',
    },
    dangerRow: {
      paddingVertical: spacing.sm,
    },
    dangerText: {
      // Color set inline
    },
    aboutSection: {
      alignItems: 'center',
    },
    aboutTitle: {
      ...typography.h4,
      marginBottom: spacing.sm,
    },
    aboutText: {
      ...typography.bodySmall,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: spacing.xs,
      marginBottom: spacing.lg,
    },
    logo: {
      width: 280,
      height: 88,
      resizeMode: 'contain',
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
    copyright: {
      ...typography.caption,
      color: currentColors.textSecondary,
      textAlign: 'center',
      fontSize: 11,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={
              isDark
                ? require('../../../assets/finsh_title_inverted.png')
                : require('../../../assets/finsh_title.png')
            }
            style={styles.logo}
            accessible
            accessibilityLabel="Finsh logo"
          />
        </View>

        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Appearance</Text>
            </View>
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={() => handleThemeChange('system')}
              activeOpacity={0.7}
            >
              <View style={styles.appearanceInfo}>
                <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>System</Text>
                <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                  Follow system settings
                </Text>
              </View>
              {themeMode === 'system' && (
                <Text style={[styles.checkmark, { color: currentColors.text }]}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={() => handleThemeChange('light')}
              activeOpacity={0.7}
            >
              <View style={styles.appearanceInfo}>
                <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Light</Text>
                <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                  Always use light mode
                </Text>
              </View>
              {themeMode === 'light' && (
                <Text style={[styles.checkmark, { color: currentColors.text }]}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={() => handleThemeChange('dark')}
              activeOpacity={0.7}
            >
              <View style={styles.appearanceInfo}>
                <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Dark</Text>
                <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                  Always use dark mode
                </Text>
              </View>
              {themeMode === 'dark' && (
                <Text style={[styles.checkmark, { color: currentColors.text }]}>✓</Text>
              )}
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: currentColors.text }]}>Notifications</Text>
                <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>Get reminders and updates</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: '#D1D5DB',
                  true: '#6B7280'
                }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleExportData}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: currentColors.text }]}>Export Data</Text>
                <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>Download your information</Text>
              </View>
              <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Legal</Text>
            </View>
            <TouchableOpacity
              style={styles.appearanceOption}
              onPress={handleTermsAndConditions}
              activeOpacity={0.7}
            >
              <View style={styles.appearanceInfo}>
                <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Terms & Conditions</Text>
                <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                  Read our terms of service
                </Text>
              </View>
              <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.appearanceOption, { borderBottomWidth: 0 }]}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.7}
            >
              <View style={styles.appearanceInfo}>
                <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Privacy Policy</Text>
                <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                  Learn how we protect your data
                </Text>
              </View>
              <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <TouchableOpacity
              style={[styles.settingRow, styles.dangerRow]}
              onPress={handleClearData}
              activeOpacity={0.7}
            >
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, styles.dangerText, { color: currentColors.error }]}>Clear All Data</Text>
                <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>Delete all your information</Text>
              </View>
              <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
          <Card.Content>
            <View style={styles.aboutSection}>
              <Text style={[styles.aboutTitle, { color: currentColors.text }]}>About Finsh</Text>
              <Text style={[styles.aboutText, { color: currentColors.textSecondary }]}>Version 1.0.0</Text>
              <Text style={[styles.aboutText, { color: currentColors.textSecondary }]}>
                Helping you understand your paycheck and make smarter financial decisions.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.copyright}>
          © 2026 Sagar Sahu. All Rights Reserved.
        </Text>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer
          navigation={navigation}
          onHomePress={onNavigateToHome}
          onSettingsPress={() => {}} // Already on settings
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}
