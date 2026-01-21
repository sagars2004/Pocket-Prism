import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput } from 'react-native-paper';
import * as Location from 'expo-location';
import { Picker } from '../shared/Picker';
import { Footer } from '../shared/Footer';
import { ProgressIndicator } from './ProgressIndicator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
  const { currentColors, isDark } = useTheme();
  const [payFrequency, setPayFrequency] = useState<PayFrequency | '' | 'other'>(
    onboardingData.salary.payFrequency || ''
  );
  const [payAmount, setPayAmount] = useState(
    onboardingData.salary.annualSalary
      ? (onboardingData.salary.annualSalary / getPayPeriodsPerYear(onboardingData.salary.payFrequency || 'monthly')).toFixed(2)
      : ''
  );
  const [state, setState] = useState(onboardingData.salary.state || '');
  const [city, setCity] = useState('');
  const [customPayPeriods, setCustomPayPeriods] = useState('');
  const [error, setError] = useState('');
  const [payAmountError, setPayAmountError] = useState('');
  const [stateError, setStateError] = useState('');
  const [payFrequencyError, setPayFrequencyError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Helper to get pay periods per year based on frequency
  function getPayPeriodsPerYear(frequency: PayFrequency | '' | 'other'): number {
    switch (frequency) {
      case 'weekly': return 52;
      case 'biweekly': return 26;
      case 'semimonthly': return 24;
      case 'monthly': return 12;
      case 'other':
        const periods = parseFloat(customPayPeriods);
        return isNaN(periods) || periods <= 0 ? 12 : periods;
      default: return 12;
    }
  }

  // Reset local state when onboarding context is cleared
  useEffect(() => {
    if (!onboardingData.salary.annualSalary && !onboardingData.salary.state) {
      setPayAmount('');
      setPayFrequency('');
      setState('');
      setCity('');
      setCustomPayPeriods('');
      setError('');
      setPayAmountError('');
      setStateError('');
      setPayFrequencyError('');
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
              setStateError('');
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
                setStateError('');
              } else {
                // Last resort: use as-is
                setState(stateName);
                setStateError('');
              }
            }
          } else {
            // Full state name
            const foundState = US_STATES.find(
              s => s.toLowerCase() === stateName.toLowerCase()
            );
            if (foundState) {
              setState(foundState);
              setStateError('');
            } else {
              setState(stateName);
              setStateError('');
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

  // Validation functions
  const isValidPayFrequency = () => {
    if (!payFrequency) return false;
    if (payFrequency === 'other') {
      const periods = parseFloat(customPayPeriods);
      return customPayPeriods && !isNaN(periods) && periods >= 1;
    }
    return true;
  };

  const isValidPayAmount = () => {
    const payAmountNum = parseFloat(payAmount.replace(/[^0-9.]/g, ''));
    return payAmount && !isNaN(payAmountNum) && payAmountNum >= 0.01;
  };

  const isValidState = () => {
    return !!state;
  };

  const isValidCustomPeriods = () => {
    if (payFrequency !== 'other') return true;
    const periods = parseFloat(customPayPeriods);
    return customPayPeriods && !isNaN(periods) && periods >= 1 && periods >= 0;
  };

  const handleNext = () => {
    // Reset all error messages
    setError('');
    setPayAmountError('');
    setStateError('');
    setPayFrequencyError('');

    let hasErrors = false;
    const payAmountNum = parseFloat(payAmount.replace(/[^0-9.]/g, ''));

    // Validate paycheck amount
    if (!payAmount || isNaN(payAmountNum) || payAmountNum < 0) {
      setPayAmountError('Please enter a valid amount');
      hasErrors = true;
    } else if (payAmountNum < 0.01) {
      setPayAmountError('Value must be at least $0.01');
      hasErrors = true;
    }

    // Validate state
    if (!state) {
      setStateError('Please select your state');
      hasErrors = true;
    }

    // Validate pay frequency
    if (!payFrequency) {
      setPayFrequencyError('Please choose a valid pay frequency');
      hasErrors = true;
    } else if (payFrequency === 'other') {
      // Validate custom pay periods
      const periods = parseFloat(customPayPeriods);
      if (!customPayPeriods || isNaN(periods) || periods < 0) {
        setPayFrequencyError('Pay periods cannot be negative');
        hasErrors = true;
      } else if (periods < 1) {
        setPayFrequencyError('Pay periods must be at least 1');
        hasErrors = true;
      }
    }

    // If there are any errors, stop here
    if (hasErrors) {
      return;
    }

    // Calculate annual salary from paycheck amount and frequency
    const annualSalary = payAmountNum * getPayPeriodsPerYear(payFrequency);

    // For "other" frequency, store as monthly but save the custom payPeriodsPerYear
    const periodsPerYear = payFrequency === 'other' ? parseFloat(customPayPeriods) : undefined;

    updateSalary({
      annualSalary,
      payFrequency: payFrequency === 'other' ? 'monthly' : payFrequency as PayFrequency,
      state,
      payPeriodsPerYear: periodsPerYear,
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
    buttonLabel: {
      fontSize: 18,
      fontWeight: '700',
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
      borderRadius: 12,
      backgroundColor: currentColors.surface,
      borderWidth: 1.5,
      borderColor: currentColors.border,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    locateButtonIcon: {
      marginRight: spacing.sm,
    },
    locateButtonText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
      fontSize: 15,
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
    pickerContainer: {
      position: 'relative',
      marginBottom: spacing.md,
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

          <View style={styles.pickerContainer}>
            <Picker
              label={<Text>Pay Frequency <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>}
              selectedValue={payFrequency}
              onValueChange={(value) => {
                setPayFrequency(value as PayFrequency | 'other' | '');
                setPayFrequencyError('');
              }}
              items={[
                { label: 'Select how often you\'re paid', value: '' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Bi-Weekly', value: 'biweekly' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Other', value: 'other' },
              ]}
              placeholder="Select how often you're paid"
              error={payFrequencyError ? payFrequencyError : undefined}
              isValid={!!isValidPayFrequency()}
            />
          </View>

          {payFrequency === 'other' && (
            <>
              <TextInput
                label="Pay Periods Per Year"
                placeholder="e.g., 13, 24, 26"
                mode="outlined"
                keyboardType="numeric"
                value={customPayPeriods}
                onChangeText={(text) => {
                  // Prevent negative sign
                  const filteredText = text.replace(/[^0-9.]/g, '');
                  setCustomPayPeriods(filteredText);
                  const periods = parseFloat(filteredText);
                  if (filteredText && (!isNaN(periods) && periods >= 1)) {
                    setPayFrequencyError('');
                  } else if (filteredText && (isNaN(periods) || periods < 1)) {
                    setPayFrequencyError('Pay periods must be at least 1');
                  } else {
                    setPayFrequencyError('');
                  }
                }}
                error={!!payFrequencyError && payFrequency === 'other'}
                style={styles.input}
                outlineColor={isValidCustomPeriods() ? '#4CAF50' : (payFrequencyError && payFrequency === 'other' ? currentColors.error : undefined)}
                activeOutlineColor={isValidCustomPeriods() ? '#4CAF50' : (payFrequencyError && payFrequency === 'other' ? currentColors.error : undefined)}
              />
              {payFrequencyError && payFrequency === 'other' && (
                <Text style={styles.errorText}>{payFrequencyError}</Text>
              )}
              {!payFrequencyError && (
                <Text style={[styles.errorText, { color: currentColors.textSecondary, marginTop: -spacing.sm }]}>
                  Enter the number of times you get paid per year
                </Text>
              )}
            </>
          )}

          <TextInput
            label={`Paycheck Amount${payFrequency === 'weekly' ? ' (per week)' : payFrequency === 'biweekly' ? ' (every 2 weeks)' : payFrequency === 'monthly' ? ' (per month)' : payFrequency === 'other' ? (customPayPeriods ? ` (${customPayPeriods} times per year)` : '') : ''} *`}
            placeholder="Enter a value in USD"
            mode="outlined"
            keyboardType="numeric"
            value={payAmount}
            onChangeText={(text) => {
              // Prevent negative sign
              const filteredText = text.replace(/[^0-9.]/g, '');
              setPayAmount(filteredText);
              const payAmountNum = parseFloat(filteredText);
              if (filteredText && (!isNaN(payAmountNum) && payAmountNum >= 0.01)) {
                setPayAmountError('');
              } else if (filteredText && (isNaN(payAmountNum) || payAmountNum < 0.01)) {
                setPayAmountError('Value must be at least $0.01');
              } else {
                setPayAmountError('');
              }
            }}
            error={!!payAmountError}
            style={styles.input}
            outlineColor={isValidPayAmount() ? '#4CAF50' : (payAmountError ? currentColors.error : undefined)}
            activeOutlineColor={isValidPayAmount() ? '#4CAF50' : (payAmountError ? currentColors.error : undefined)}
            left={<TextInput.Affix text="$" />}
          />
          {payAmountError && <Text style={styles.errorText}>{payAmountError}</Text>}

          <View style={styles.locationContainer}>
            <View style={styles.locationInputContainer}>
              <TextInput
                label="City (optional)"
                placeholder="Enter the city you currently reside in"
                mode="outlined"
                value={city}
                onChangeText={setCity}
                style={[styles.input, styles.locationInput]}
                autoCapitalize="words"
              />
              <View style={styles.pickerContainer}>
                <Picker
                  label={<Text>State <Text style={{ color: currentColors.error || '#EF4444' }}>*</Text></Text>}
                  selectedValue={state}
                  onValueChange={(value) => {
                    setState(value);
                    setStateError('');
                  }}
                  items={[
                    { label: 'Select your state', value: '' },
                    ...US_STATES.map((s) => ({ label: s, value: s })),
                  ]}
                  placeholder="Select your state"
                  error={stateError ? stateError : undefined}
                  isValid={isValidState()}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.locateButton}
              onPress={handleLocateMe}
              disabled={isLocating}
              activeOpacity={0.7}
            >
              {isLocating ? (
                <ActivityIndicator size="small" color={currentColors.text} />
              ) : (
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={20}
                  color={currentColors.text}
                  style={styles.locateButtonIcon}
                />
              )}
              <Text style={styles.locateButtonText}>
                {isLocating ? 'Locating...' : 'Use My Location'}
              </Text>
            </TouchableOpacity>
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
