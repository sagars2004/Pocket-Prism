import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Image, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { useUser } from '../../context/UserContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

import Constants from 'expo-constants';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateToHome?: () => void;
  navigation?: any;
}

// Replace with your valid Resend API Key
const RESEND_API_KEY = Constants.expoConfig?.extra?.PRIVATE_RESEND_API_KEY || '';
const FEEDBACK_EMAIL_TO = Constants.expoConfig?.extra?.PRIVATE_EMAIL || '';

export function SettingsScreen({ onBack, onNavigateToHome, navigation }: SettingsScreenProps) {
  const { userData, clearUserData } = useUser();
  const { resetOnboarding } = useOnboarding();
  const { themeMode, setThemeMode, currentColors, isDark } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const [feedbackText, setFeedbackText] = useState('');
  const [sendingFeedback, setSendingFeedback] = useState(false);
  const [inCooldown, setInCooldown] = useState(false);

  useEffect(() => {
    checkCooldown();
  }, []);

  const checkCooldown = async () => {
    try {
      const lastTime = await AsyncStorage.getItem('LAST_FEEDBACK_TIME');
      if (lastTime) {
        const timeSince = Date.now() - parseInt(lastTime, 10);
        if (timeSince < 5 * 60 * 1000) {
          setInCooldown(true);
          const remaining = 5 * 60 * 1000 - timeSince;
          setTimeout(() => setInCooldown(false), remaining);
        }
      }
    } catch (e) {
      console.error('Error checking cooldownx', e);
    }
  };

  const handleThemeChange = async (mode: 'light' | 'dark') => {
    await setThemeMode(mode);
  };



  const handleSendFeedback = async () => {
    if (inCooldown) {
      Alert.alert(
        "Hold up!",
        "To prevent spam and frivolent requests, please wait 5 minutes before sending another message."
      );
      return;
    }

    if (!feedbackText.trim()) {
      Alert.alert('Empty Message Body', 'Please enter some feedback before sending.');
      return;
    }

    if (!RESEND_API_KEY || RESEND_API_KEY === 're_123456789') {
      Alert.alert('Configuration Required', 'Please set a valid Resend API Key in SettingsScreen.tsx to send feedback.');
      return;
    }

    setSendingFeedback(true);
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: FEEDBACK_EMAIL_TO,
          subject: 'Finsh App Feedback',
          html: `<p>${feedbackText}</p>`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Thank You!', 'Your feedback has been sent.');
        setFeedbackText('');

        await AsyncStorage.setItem('LAST_FEEDBACK_TIME', Date.now().toString());
        setInCooldown(true);
        setTimeout(() => setInCooldown(false), 5 * 60 * 1000);
      } else {
        console.error('Resend API Error:', data);
        Alert.alert('Error', 'Failed to send feedback. Please try again later.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'An error occurred while sending feedback.');
    } finally {
      setSendingFeedback(false);
    }
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
      backgroundColor: currentColors.background,
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
    feedbackInput: {
      backgroundColor: isDark ? '#FFFFFF10' : '#e9eaeaff',
      borderRadius: 16,
      padding: spacing.md,
      color: currentColors.text,
      minHeight: 100,
      textAlignVertical: 'top',
      marginBottom: spacing.md,
      ...typography.body,
    },
    submitButton: {
      backgroundColor: isDark ? '#ffffff2e' : '#d9d9d9ff',
      padding: spacing.sm,
      borderRadius: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      borderWidth: inCooldown ? 2 : 0,
      borderColor: inCooldown ? '#EF4444' : 'transparent',
    },
    submitButtonText: {
      ...typography.body,
      color: isDark ? '#FFFFFF' : '#000',
      fontWeight: '600',
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
    copyright: {
      ...typography.caption,
      color: isDark ? '#FFFFFF' : '#000',
      textAlign: 'center',
      fontSize: 11,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    socialLinksContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.md,
      gap: spacing.lg,
    },
    socialIcon: {
      padding: spacing.xs,
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
                onPress={() => handleThemeChange('light')}
                activeOpacity={0.7}
              >
                <View style={styles.appearanceInfo}>
                  <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Light</Text>
                  <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                    A classic, rich feel
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
                    A stealthy, minimal vibe
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
                  <Text style={[styles.settingDescription, { color: currentColors.textSecondary }]}>Allow pop-ups and reminders</Text>
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

          {/* Share Feedback Section */}
          <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Share Feedback</Text>
              </View>
              <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary, marginBottom: spacing.sm }]}>
                Have a suggestion or found a bug? Let us know!
              </Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Type your feedback here. Thanks!"
                placeholderTextColor={currentColors.textSecondary}
                multiline
                numberOfLines={4}
                value={feedbackText}
                onChangeText={setFeedbackText}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSendFeedback}
                disabled={sendingFeedback}
                activeOpacity={0.7}
              >
                {sendingFeedback ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Message</Text>
                )}
              </TouchableOpacity>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
            <Card.Content style={{ paddingVertical: spacing.sm }}>
              <View style={[styles.sectionHeader, { marginBottom: spacing.xs }]}>
                <Text style={[styles.sectionTitle, { color: currentColors.text }]}>Legal & Resources</Text>
              </View>

              <TouchableOpacity
                style={styles.appearanceOption}
                onPress={() => Linking.openURL('https://sagars2004.github.io/Finsh/privacy')}
                activeOpacity={0.7}
              >
                <View style={styles.appearanceInfo}>
                  <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Privacy Policy</Text>
                  <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                    Review our commitment to privacy
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.appearanceOption}
                onPress={() => Linking.openURL('https://sagars2004.github.io/Finsh/support')}
                activeOpacity={0.7}
              >
                <View style={styles.appearanceInfo}>
                  <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Support</Text>
                  <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                    Get help or view FAQs
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.appearanceOption, { borderBottomWidth: 0 }]}
                onPress={() => Linking.openURL('https://sagars2004.github.io/Finsh/')}
                activeOpacity={0.7}
              >
                <View style={styles.appearanceInfo}>
                  <Text style={[styles.appearanceLabel, { color: currentColors.text }]}>Website</Text>
                  <Text style={[styles.appearanceDescription, { color: currentColors.textSecondary }]}>
                    Visit our official page
                  </Text>
                </View>
                <Text style={[styles.arrow, { color: currentColors.textSecondary }]}>›</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>

          <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text style={[styles.aboutTitle, { color: currentColors.text }]}>Data Transparency</Text>
                <Text style={[styles.aboutText, { color: currentColors.textSecondary }]}>
                  We value your privacy and are committed to protecting your personal information. We do not collect or store your information, and none of your data leaves the app.
                </Text>
              </View>
            </Card.Content>
          </Card>



          <Card style={[styles.card, { backgroundColor: currentColors.surface }]}>
            <Card.Content>
              <View style={styles.aboutSection}>
                <Text style={[styles.aboutTitle, { color: currentColors.text }]}>About Finsh</Text>
                <Text style={[styles.aboutText, { color: currentColors.textSecondary }]}>Version 1.0.0</Text>
                <Text style={[styles.aboutText, { color: currentColors.textSecondary }]}>
                  Keep your paycheck swimming in the right direction. Thanks for using Finsh!
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Text style={styles.copyright}>
            © 2026 Sagar Sahu. All Rights Reserved.
          </Text>

          <View style={styles.socialLinksContainer}>
            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(Constants.expoConfig?.extra?.INSTAGRAM || 'https://instagram.com/')}
            >
              <MaterialCommunityIcons name="instagram" size={48} color={currentColors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(Constants.expoConfig?.extra?.LINKEDIN || 'https://linkedin.com/')}
            >
              <MaterialCommunityIcons name="linkedin" size={48} color={currentColors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialIcon}
              onPress={() => Linking.openURL(Constants.expoConfig?.extra?.TIKTOK || 'https://tiktok.com/')}
            >
              <FontAwesome5 name="tiktok" size={40} color={currentColors.text} />
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer
          navigation={navigation}
          onHomePress={onNavigateToHome}
          onSettingsPress={() => { }} // Already on settings
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}
