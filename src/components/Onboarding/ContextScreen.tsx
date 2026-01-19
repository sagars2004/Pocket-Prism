import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ContextScreenProps {
  onNext: () => void;
  onBack: () => void;
  navigation?: any;
}

const LIVING_OPTIONS = [
  { label: 'Living Alone', value: 'alone' as const },
  { label: 'Living with Roommates', value: 'roommates' as const },
  { label: 'Living with Family', value: 'family' as const },
];

const EXPENSE_OPTIONS = [
  'Student Loans',
  'Car Payment',
  'Credit Card Debt',
  'Monthly Subscriptions',
  'Gym Membership',
];

const GOAL_OPTIONS = [
  'Build Emergency Fund',
  'Save for Vacation',
  'Start Investing',
  'Pay Off Debt',
  'Buy a Car',
];

export function ContextScreen({ onNext, onBack, navigation }: ContextScreenProps) {
  const { onboardingData, updateExpenses } = useOnboarding();
  const { currentColors, isDark } = useTheme();
  const [livingSituation, setLivingSituation] = useState(
    onboardingData.expenses.livingSituation || null
  );
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>(
    onboardingData.expenses.majorExpenses || []
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    onboardingData.expenses.goals || []
  );

  // Reset local state when onboarding context is cleared
  useEffect(() => {
    if (!onboardingData.expenses.livingSituation && 
        !onboardingData.expenses.majorExpenses?.length && 
        !onboardingData.expenses.goals?.length) {
      setLivingSituation(null);
      setSelectedExpenses([]);
      setSelectedGoals([]);
    }
  }, [onboardingData.expenses]);

  const toggleExpense = (expense: string) => {
    setSelectedExpenses((prev) =>
      prev.includes(expense)
        ? prev.filter((e) => e !== expense)
        : [...prev, expense]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    updateExpenses({
      livingSituation: livingSituation || 'alone',
      majorExpenses: selectedExpenses,
      goals: selectedGoals,
    });

    onNext();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    content: {
      flex: 1,
    },
    title: {
      ...typography.h2,
      color: currentColors.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginBottom: spacing.xl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h4,
      color: currentColors.text,
      marginBottom: spacing.md,
    },
    optionButton: {
      padding: spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: currentColors.surface,
      marginBottom: spacing.sm,
    },
    optionButtonSelected: {
      borderColor: isDark ? '#9CA3AF' : '#6B7280',
      backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
    },
    optionText: {
      ...typography.body,
      color: currentColors.text,
    },
    optionTextSelected: {
      color: isDark ? '#E5E7EB' : '#374151',
      fontWeight: '600',
    },
    chipButton: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: currentColors.border,
      backgroundColor: currentColors.surface,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
      alignSelf: 'flex-start',
    },
    chipButtonSelected: {
      borderColor: isDark ? '#9CA3AF' : '#6B7280',
      backgroundColor: isDark ? '#4B5563' : '#E5E7EB',
    },
    chipText: {
      ...typography.bodySmall,
      color: currentColors.text,
    },
    chipTextSelected: {
      color: isDark ? '#E5E7EB' : '#374151',
      fontWeight: '600',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      paddingVertical: spacing.lg,
    },
    backButton: {
      flex: 1,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    buttonLabel: {
      fontSize: 18,
      fontWeight: '700',
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={3} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about your situation</Text>
          <Text style={styles.subtitle}>
            This helps us show you relevant tradeoffs and insights.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Living Situation</Text>
            {LIVING_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  livingSituation === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => setLivingSituation(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    livingSituation === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Major Expenses (optional)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {EXPENSE_OPTIONS.map((expense) => (
                <TouchableOpacity
                  key={expense}
                  style={[
                    styles.chipButton,
                    selectedExpenses.includes(expense) && styles.chipButtonSelected,
                  ]}
                  onPress={() => toggleExpense(expense)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedExpenses.includes(expense) && styles.chipTextSelected,
                    ]}
                  >
                    {expense}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Financial Goals (optional)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {GOAL_OPTIONS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.chipButton,
                    selectedGoals.includes(goal) && styles.chipButtonSelected,
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedGoals.includes(goal) && styles.chipTextSelected,
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            buttonColor={currentColors.surface}
            textColor={currentColors.text}
            style={[styles.backButton, styles.button]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            buttonColor={isDark ? '#E5E5E5' : '#000000'}
            textColor={isDark ? '#000000' : '#FFFFFF'}
            disabled={!livingSituation}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Next
          </Button>
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
