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
  'Mortgage/Rent',
  'Childcare',
  'Medical Bills',
  'Tuition',
  'Insurance',
  'Other',
];

const GOAL_OPTIONS = [
  'Build Emergency Fund',
  'Save for Vacation',
  'Start Investing',
  'Pay Off Debt',
  'Buy a Car',
  'Buy a House',
  'Retire Early',
  'Start a Business',
  'Wedding Planning',
  'Generational Wealth',
  'Other',
];

const PRIORITY_OPTIONS = [
  'Paying Down Debt',
  'Building Safety Net',
  'Maximizing Lifestyle',
  'Investing for Future',
  'Career Growth',
  'Travel & Experiences',
  'Supporting a Family',
  'Financial Independence',
  'Other',
];

const CONFIDENCE_OPTIONS = [
  { value: 'very_low', label: '1' },
  { value: 'low', label: '2' },
  { value: 'medium', label: '3' },
  { value: 'high', label: '4' },
  { value: 'very_high', label: '5' },
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
  const [priorityFocus, setPriorityFocus] = useState<string[]>(
    onboardingData.expenses.priorityFocus || []
  );
  const [confidenceLevel, setConfidenceLevel] = useState<'very_low' | 'low' | 'medium' | 'high' | 'very_high'>(
    onboardingData.expenses.confidenceLevel || 'medium'
  );

  const getFinancialPosture = () => {
    if (!livingSituation) return null;

    const base = livingSituation === 'family' ? 'Strategic Base' : (livingSituation === 'alone' ? 'Independent' : 'Shared-Living');

    let focusMode = 'Stability';
    if (selectedGoals.some(g => ['Pay Off Debt', 'Credit Card Debt', 'Student Loans'].some(d => g.includes(d))) || priorityFocus.includes('Paying down debt')) {
      focusMode = 'Rebuilding';
    } else if (selectedGoals.some(g => ['Start Investing', 'Generational Wealth', 'Start a Business'].includes(g)) || priorityFocus.includes('Investing for future')) {
      focusMode = 'Growth';
    } else if (priorityFocus.includes('Maximizing lifestyle') || priorityFocus.includes('Travel & Experiences')) {
      focusMode = 'Lifestyle';
    }

    let insight = "This setup gives you unique leverage options.";
    if (livingSituation === 'family') {
      insight = "You have a golden window to stack cash aggressively while overhead is low.";
    } else if (livingSituation === 'alone') {
      if (focusMode === 'Growth') insight = "Full control means full upside. Your efficiency directly fuels your growth.";
      else insight = "You're paying for freedom—customizing your budget is critical to calm.";
    } else {
      insight = "Splitting costs is smart; focus on keeping your personal variable costs lean.";
    }

    if (confidenceLevel === 'very_low' || confidenceLevel === 'low' || confidenceLevel === 'very_high') {
      // Add nuance based on confidence
      if (confidenceLevel === 'very_low') insight += " We'll start small to build your confidence.";
      if (confidenceLevel === 'very_high') insight += " Let's optimize your surplus for maximum impact.";
    }

    return {
      title: `${base} • ${focusMode} Mode`,
      insight
    };
  };

  const posture = getFinancialPosture();

  // Reset local state when onboarding context is cleared
  useEffect(() => {
    if (!onboardingData.expenses.livingSituation &&
      !onboardingData.expenses.majorExpenses?.length &&
      !onboardingData.expenses.goals?.length) {
      setLivingSituation(null);
      setSelectedExpenses([]);
      setSelectedGoals([]);
      setPriorityFocus([]);
      setConfidenceLevel('medium');
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

  const togglePriority = (priority: string) => {
    setPriorityFocus((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  const handleNext = () => {
    updateExpenses({
      livingSituation: livingSituation || 'alone',
      majorExpenses: selectedExpenses,
      goals: selectedGoals,
      priorityFocus,
      confidenceLevel,
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
            This helps us accurately gauge your financial posture and provide the right response.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Living Situation <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>
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
            <Text style={styles.sectionTitle}>Major Expenses <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>
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
            <Text style={styles.sectionTitle}>Financial Goals <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What matters most right now? <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {PRIORITY_OPTIONS.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.chipButton,
                    priorityFocus.includes(priority) && styles.chipButtonSelected,
                  ]}
                  onPress={() => togglePriority(priority)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      priorityFocus.includes(priority) && styles.chipTextSelected,
                    ]}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How confident do you feel about money? <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {CONFIDENCE_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    { flex: 1, padding: spacing.sm, alignItems: 'center' },
                    confidenceLevel === option.value && styles.optionButtonSelected,
                  ]}
                  onPress={() => setConfidenceLevel(option.value as any)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      confidenceLevel === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {posture && (
            <View style={{
              marginTop: spacing.sm,
              marginBottom: spacing.lg,
              padding: spacing.md,
              backgroundColor: isDark ? '#3a3a3aff' : '#e8e8e8ff',
              borderRadius: 12,
              borderLeftWidth: 4,
              borderLeftColor: '#626262ff'
            }}>
              <Text style={{ ...typography.h4, fontSize: 16, marginBottom: 4, color: currentColors.text }}>
                {posture.title}
              </Text>
              <Text style={{ ...typography.bodySmall, color: currentColors.textSecondary }}>
                {posture.insight}
              </Text>
            </View>
          )}

          <Text style={{
            ...typography.caption,
            textAlign: 'center',
            color: currentColors.textSecondary,
            marginBottom: spacing.xs,
            fontStyle: 'italic'
          }}>
            (Don't sweat it—you can change these answers later!)
          </Text>
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
            disabled={!livingSituation || selectedExpenses.length === 0 || selectedGoals.length === 0 || priorityFocus.length === 0 || !confidenceLevel}
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
