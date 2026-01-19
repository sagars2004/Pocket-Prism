import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TutorialScreenProps {
  navigation: any;
}

export function TutorialScreen({ navigation }: TutorialScreenProps) {
  const handleContinue = () => {
    navigation.navigate('SalaryInfo');
  };
  const { currentColors, isDark } = useTheme();

  const tutorialSteps = [
    {
      icon: 'calculator-variant' as const,
      title: 'Paycheck Breakdown',
      description: 'View a detailed breakdown of your paycheck, including gross pay, taxes, benefits, and your take-home amount.',
    },
    {
      icon: 'swap-horizontal' as const,
      title: 'Smart Tradeoffs',
      description: 'Explore decision tradeoffs for things you may be considering, and see the financial impact of each choice.',
    },
    {
      icon: 'chart-line' as const,
      title: 'Planning Insights',
      description: 'Track your earnings over time, compare scenarios, and see how expenses accumulate month by month.',
    },
    {
      icon: 'cog' as const,
      title: 'Settings',
      description: 'Customize your app experience, adjust your theme, and manage your preferences from the settings page.',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      padding: spacing.lg,
      paddingBottom: spacing.xl,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      ...typography.h1,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
      fontWeight: '800',
    },
    subtitle: {
      ...typography.bodyLarge,
      color: currentColors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h3,
      color: currentColors.text,
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    stepContainer: {
      backgroundColor: currentColors.surface,
      borderRadius: 16,
      padding: spacing.lg,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    stepHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    stepIcon: {
      marginRight: spacing.md,
    },
    stepTitle: {
      ...typography.h4,
      color: currentColors.text,
      fontWeight: '600',
      flex: 1,
    },
    stepDescription: {
      ...typography.body,
      color: currentColors.textSecondary,
      lineHeight: 22,
    },
    footer: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    continueButton: {
      width: '100%',
    },
    continueButtonContent: {
      paddingVertical: spacing.sm,
    },
    continueButtonLabel: {
      ...typography.button,
      fontSize: 18,
      fontWeight: '700',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to Finsh</Text>
          <Text style={styles.subtitle}>
            Learn how to navigate and make the most of your financial journey
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {tutorialSteps.map((step, index) => (
            <View key={index} style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <MaterialCommunityIcons
                  name={step.icon}
                  size={28}
                  color={isDark ? '#FFFFFF' : '#000000'}
                  style={styles.stepIcon}
                />
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building your Finsh Tank</Text>
          <View style={styles.stepContainer}>
            <Text style={styles.stepDescription}>
              1. Complete the onboarding flow to set up your basic profile.{'\n\n'}
              2. Give some context about your situation, e.g. earnings, expenses, goals.{'\n\n'}
              3. Explore the Dashboard to see your estimated take-home pay.{'\n\n'}
              4. Use the Tradeoff cards to compare financial decisions you may be facing.{'\n\n'}
              5. Check the Planning page for long-term analysis and insights.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            buttonColor={isDark ? '#E5E5E5' : '#000000'}
            textColor={isDark ? '#000000' : '#FFFFFF'}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
            labelStyle={styles.continueButtonLabel}
          >
            Continue
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
