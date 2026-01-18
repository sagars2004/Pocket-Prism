import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import * as Location from 'expo-location';
import { Picker } from '../shared/Picker';
import { Footer } from '../shared/Footer';
import { ProgressIndicator } from './ProgressIndicator';
import { useOnboarding } from '../../context/OnboardingContext';
import { PayFrequency } from '../../types/user';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface SalaryInfoScreenProps {
  onNext: () => void;
  onBack: () => void;
  navigation?: any;
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

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Consulting',
  'Marketing',
  'Retail',
  'Manufacturing',
  'Non-profit',
  'Government',
  'Other',
];

const EXPERIENCE_LEVELS = [
  { label: 'Entry Level (0-1 years)', value: '0-1' },
  { label: 'Early Career (2-3 years)', value: '2-3' },
  { label: 'Mid-Level (4-6 years)', value: '4-6' },
  { label: 'Senior (7+ years)', value: '7+' },
];

export function SalaryInfoScreen({ onNext, onBack, navigation }: SalaryInfoScreenProps) {
  const { onboardingData, updateSalary } = useOnboarding();
  const { currentColors } = useTheme();
  const [payFrequency, setPayFrequency] = useState<PayFrequency>(
    onboardingData.salary.payFrequency || 'monthly'
  );
  const [payAmount, setPayAmount] = useState(
    onboardingData.salary.annualSalary 
      ? (onboardingData.salary.annualSalary / getPayPeriodsPerYear(onboardingData.salary.payFrequency || 'monthly')).toFixed(2)
      : ''
  );
  const [state, setState] = useState(onboardingData.salary.state || '');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  
  // Helper to get pay periods per year based on frequency
  function getPayPeriodsPerYear(frequency: PayFrequency): number {
    switch (frequency) {
      case 'weekly': return 52;
      case 'biweekly': return 26;
      case 'semimonthly': return 24;
      case 'monthly': return 12;
      default: return 12;
    }
  }

  // Reset local state when onboarding context is cleared
  useEffect(() => {
    if (!onboardingData.salary.annualSalary && !onboardingData.salary.state) {
      setPayAmount('');
      setPayFrequency('monthly');
      setState('');
      setCity('');
      setError('');
    }
  }, [onboardingData.salary]);
  
  // Update pay amount when frequency changes to recalculate annual equivalent
  useEffect(() => {
    if (payAmount && onboardingData.salary.annualSalary) {
      const currentAnnual = onboardingData.salary.annualSalary;
      const newPayPerPeriod = currentAnnual / getPayPeriodsPerYear(payFrequency);
      setPayAmount(newPayPerPeriod.toFixed(2));
    }
  }, [payFrequency]);

  const handleLocateMe = async () => {
    try {
      setIsLocating(true);
      setError('');

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to automatically detect your city and state. Please enable it in your device settings or enter your location manually.'
        );
        setIsLocating(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        
        // Extract city and state
        if (address.city) {
          setCity(address.city);
        }
        
        if (address.region) {
          // Convert state abbreviation to full name if needed
          const stateName = address.region;
          // Check if it's an abbreviation (2 characters)
          if (stateName.length === 2) {
            // Try to find matching state in our list
            // Note: expo-location returns ISO 3166-2 codes, we may need to map them
            // For now, use the region as-is since it might be full name or abbreviation
            const foundState = US_STATES.find(
              s => s.toLowerCase().startsWith(stateName.toLowerCase()) || 
              s.substring(0, 2).toLowerCase() === stateName.toLowerCase()
            );
            if (foundState) {
              setState(foundState);
            } else {
              // If not found, use the region as-is (might be abbreviation)
              // Try to find state by abbreviation
              const stateAbbrevMap: { [key: string]: string } = {
                'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
                'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
                'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
                'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
                'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
                'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
                'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
                'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
                'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
                'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
                'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
                'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
                'WI': 'Wisconsin', 'WY': 'Wyoming',
              };
              const fullStateName = stateAbbrevMap[stateName.toUpperCase()];
              if (fullStateName) {
                setState(fullStateName);
              } else {
                // Last resort: use as-is
                setState(stateName);
              }
            }
          } else {
            // Full state name
            const foundState = US_STATES.find(
              s => s.toLowerCase() === stateName.toLowerCase()
            );
            if (foundState) {
              setState(foundState);
            } else {
              setState(stateName);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to detect your location. Please enter your city and state manually.'
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleNext = () => {
    const payAmountNum = parseFloat(payAmount.replace(/[^0-9.]/g, ''));
    
    if (!payAmount || isNaN(payAmountNum) || payAmountNum <= 0) {
      setError('Please enter a valid paycheck amount');
      return;
    }

    if (!state) {
      setError('Please select your state');
      return;
    }

    if (!payFrequency) {
      setError('Please select your pay frequency');
      return;
    }

    // Calculate annual salary from paycheck amount and frequency
    const annualSalary = payAmountNum * getPayPeriodsPerYear(payFrequency);

    updateSalary({
      annualSalary,
      payFrequency,
      state,
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
    input: {
      marginBottom: spacing.md,
    },
    errorText: {
      ...typography.caption,
      color: currentColors.error,
      marginTop: spacing.xs * -1,
      marginBottom: spacing.md,
      marginLeft: spacing.sm,
    },
    locationContainer: {
      marginBottom: spacing.md,
    },
    locationInputContainer: {
      marginBottom: spacing.sm,
    },
    locationInput: {
      marginBottom: spacing.md,
    },
    locateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      backgroundColor: currentColors.surface,
      borderWidth: 1,
      borderColor: currentColors.border,
      borderStyle: 'dashed',
    },
    locateButtonIcon: {
      fontSize: 18,
      marginRight: spacing.sm,
    },
    locateButtonText: {
      ...typography.body,
      color: currentColors.primary,
      fontWeight: '500',
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressIndicator currentStep={2} totalSteps={4} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about your paycheck</Text>
          <Text style={styles.subtitle}>
            We'll use this to calculate your take-home pay and show you personalized insights.
          </Text>

          <Picker
            label="Pay Frequency"
            selectedValue={payFrequency}
            onValueChange={(value) => {
              setPayFrequency(value as PayFrequency);
              setError('');
            }}
            items={[
              { label: 'Monthly', value: 'monthly' },
              { label: 'Semi-Monthly', value: 'semimonthly' },
              { label: 'Bi-Weekly', value: 'biweekly' },
              { label: 'Weekly', value: 'weekly' },
            ]}
            placeholder="Select pay frequency"
            error={!!error && !payFrequency}
          />

          <TextInput
            label={`Paycheck Amount (${payFrequency === 'weekly' ? 'per week' : payFrequency === 'biweekly' ? 'every 2 weeks' : payFrequency === 'semimonthly' ? 'twice per month' : 'per month'})`}
            placeholder="$3000.00"
            mode="outlined"
            keyboardType="numeric"
            value={payAmount}
            onChangeText={(text) => {
              setPayAmount(text);
              setError('');
            }}
            error={!!error && !payAmount}
            style={styles.input}
            left={<TextInput.Affix text="$" />}
          />

          <View style={styles.locationContainer}>
            <View style={styles.locationInputContainer}>
              <TextInput
                label="City (optional)"
                placeholder="San Francisco"
                mode="outlined"
                value={city}
                onChangeText={setCity}
                style={[styles.input, styles.locationInput]}
                autoCapitalize="words"
              />
              <Picker
                label="State"
                selectedValue={state}
                onValueChange={(value) => {
                  setState(value);
                  setError('');
                }}
                items={[
                  { label: 'Select your state', value: '' },
                  ...US_STATES.map((s) => ({ label: s, value: s })),
                ]}
                placeholder="Select your state"
                error={error && !state ? error : undefined}
              />
            </View>
            <TouchableOpacity
              style={styles.locateButton}
              onPress={handleLocateMe}
              disabled={isLocating}
              activeOpacity={0.7}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={currentColors.primary} />
              ) : (
                <Text style={styles.locateButtonIcon}>📍</Text>
              )}
              <Text style={styles.locateButtonText}>
                {isLocating ? 'Locating...' : 'Locate Me'}
              </Text>
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onBack}
            buttonColor={currentColors.surface}
            textColor={currentColors.primary}
            style={[styles.backButton, styles.button]}
            contentStyle={styles.buttonContent}
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={handleNext}
            buttonColor={currentColors.primary}
            textColor={currentColors.surface}
            style={styles.button}
            contentStyle={styles.buttonContent}
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
