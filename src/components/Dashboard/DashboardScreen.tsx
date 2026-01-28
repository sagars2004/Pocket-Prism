import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { Greeting } from './Greeting';
import { TakeHomeEstimate } from './TakeHomeEstimate';
import { ActionButtons } from './ActionButtons';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { estimateTakeHome, annualizeTakeHome } from '../../services/calculations/paycheck';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface DashboardScreenProps {
  onViewTradeoffs: () => void;
  onViewBreakdown: () => void;
  navigation?: any;
}

export function DashboardScreen({ onViewTradeoffs, onViewBreakdown, navigation }: DashboardScreenProps) {
  const { userData } = useUser();
  const { currentColors } = useTheme();

  const paycheckData = useMemo(() => {
    if (!userData?.salary) return null;
    return estimateTakeHome(userData.salary);
  }, [userData]);

  const payFrequencyLabel = userData?.salary?.payFrequency
    ? userData.salary.payPeriodsPerYear
      ? `${userData.salary.payPeriodsPerYear} times per year`
      : userData.salary.payFrequency.charAt(0).toUpperCase() +
      userData.salary.payFrequency.slice(1).replace(/([A-Z])/g, ' $1')
    : 'paycheck';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      padding: spacing.lg,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    errorText: {
      ...typography.body,
      color: currentColors.textSecondary,
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
    infoBox: {
      marginTop: spacing.lg,
      backgroundColor: currentColors.surface,
      borderRadius: 12,
      borderWidth: 3,
      borderColor: currentColors.borderLight,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    infoBoxContent: {
      padding: spacing.md,
    },
    infoText: {
      ...typography.body,
      color: currentColors.textSecondary,
      lineHeight: 20,
      textAlign: 'center',
    },
  });

  if (!userData || !paycheckData) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Greeting name={userData.name} />
        <TakeHomeEstimate
          breakdown={paycheckData}
          payFrequency={payFrequencyLabel}
        />

        <ActionButtons
          onViewBreakdown={onViewBreakdown}
          onViewTradeoffs={onViewTradeoffs}
        />
        <View style={styles.infoBox}>
          <View style={styles.infoBoxContent}>
            <Text style={styles.infoText}>
              Don't forget! Click the Plan and Tips icons below to view more insights and plan your long-term future.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView >
  );
}
