import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../shared/Button';
import { Input } from '../shared/Input';
import { Picker } from '../shared/Picker';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { PayFrequency } from '../../types/user';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SalaryInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

export function SalaryInfoScreen({ onNext, onBack }: SalaryInfoScreenProps) {
  const { onboardingData, updateSalary } = useOnboarding();
  const [annualSalary, setAnnualSalary] = useState(
    onboardingData.salary.annualSalary?.toString() || ''
  );
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(
    onboardingData.salary.payFrequency || 'monthly'
  );
  const [state, setState] = useState(onboardingData.salary.state || '');
  const [error, setError] = useState('');

  const handleNext = () => {
    const salaryNum = parseFloat(annualSalary.replace(/[^0-9.]/g, ''));
    
    if (!annualSalary || isNaN(salaryNum) || salaryNum <= 0) {
      setError('Please enter a valid annual salary');
      return;
    }

    if (!state) {
      setError('Please select your state');
      return;
    }

    updateSalary({
      annualSalary: salaryNum,
      payFrequency,
      state,
    });

    onNext();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={2} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about your salary</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate your take-home pay and show you personalized insights.
          </Text>

          <Input
            label="Annual Salary"
            placeholder="$75,000"
            keyboardType="numeric"
            value={annualSalary}
            onChangeText={(text) => {
              setAnnualSalary(text);
              setError('');
            }}
            error={error}
          />

          <Picker
            label="Pay Frequency"
            selectedValue={payFrequency}
            onValueChange={(value) => setPayFrequency(value as PayFrequency)}
            items={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Semi-Monthly', value: 'semimonthly' },
              { label: 'Bi-Weekly', value: 'biweekly' },
              { label: 'Weekly', value: 'weekly' },
            ]}
            placeholder="Select pay frequency"
          />

          <Picker
            label="State"
            selectedValue={state}
            onValueChange={(value) => {
              setState(value);
              setError('');
            }}
            items={[
              { label: 'Select a state', value: '' },
              ...US_STATES.map((s) => ({ label: s, value: s })),
            ]}
            placeholder="Select your state"
            error={error && !state ? error : undefined}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            variant="outline"
            onPress={onBack}
            style={styles.backButton}
          />
          <Button title="Next" onPress={handleNext} />
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
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
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
