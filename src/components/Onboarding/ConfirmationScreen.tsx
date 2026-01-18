import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../shared/Button';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { useUser } from '../../context/UserContext';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ConfirmationScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function ConfirmationScreen({ onComplete, onBack }: ConfirmationScreenProps) {
  const { onboardingData } = useOnboarding();
  const { setUserData } = useUser();

  const handleComplete = async () => {
    // Combine onboarding data into UserData
    if (
      onboardingData.salary.annualSalary &&
      onboardingData.salary.payFrequency &&
      onboardingData.salary.state &&
      onboardingData.expenses.livingSituation
    ) {
      await setUserData({
        salary: {
          annualSalary: onboardingData.salary.annualSalary,
          payFrequency: onboardingData.salary.payFrequency,
          state: onboardingData.salary.state,
        },
        expenses: {
          livingSituation: onboardingData.expenses.livingSituation,
          majorExpenses: onboardingData.expenses.majorExpenses,
          goals: onboardingData.expenses.goals,
        },
        onboardingComplete: true,
      });

      onComplete();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={4} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✅</Text>
          </View>
          <Text style={styles.title}>You're all set!</Text>
          <Text style={styles.subtitle}>
            Here's a summary of what you've shared:
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Annual Salary:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(onboardingData.salary.annualSalary || 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pay Frequency:</Text>
              <Text style={styles.summaryValue}>
                {onboardingData.salary.payFrequency
                  ? onboardingData.salary.payFrequency.charAt(0).toUpperCase() +
                    onboardingData.salary.payFrequency.slice(1).replace(/([A-Z])/g, ' $1')
                  : 'Not set'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>State:</Text>
              <Text style={styles.summaryValue}>{onboardingData.salary.state || 'Not set'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Living Situation:</Text>
              <Text style={styles.summaryValue}>
                {onboardingData.expenses.livingSituation
                  ? onboardingData.expenses.livingSituation.charAt(0).toUpperCase() +
                    onboardingData.expenses.livingSituation.slice(1)
                  : 'Not set'}
              </Text>
            </View>
          </View>

          <Text style={styles.message}>
            Ready to see your first paycheck breakdown? Let's go!
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={onBack}
            style={styles.backButton}
          />
          <Button title="Go to Dashboard" onPress={handleComplete} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  backButton: {
    flex: 1,
  },
});
