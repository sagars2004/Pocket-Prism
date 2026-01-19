import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import { Footer } from '../shared/Footer';
import { BreakdownSection } from './BreakdownSection';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { estimateTakeHome } from '../../services/calculations/paycheck';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BreakdownScreenProps {
  onBack: () => void;
  navigation?: any;
}

export function BreakdownScreen({ onBack, navigation }: BreakdownScreenProps) {
  const { userData } = useUser();
  const { currentColors } = useTheme();

  const breakdown = useMemo(() => {
    if (!userData?.salary) return null;
    return estimateTakeHome(userData.salary);
  }, [userData]);

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
    infoContainer: {
      marginBottom: spacing.lg,
      backgroundColor: currentColors.surface,
    },
    infoText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
      marginBottom: spacing.xs,
    },
    infoSubtext: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      lineHeight: 20,
    },
    taxSection: {
      marginBottom: spacing.lg,
    },
    benefitsSection: {
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      ...typography.h4,
      color: currentColors.text,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },
    noteContainer: {
      marginTop: spacing.md,
      backgroundColor: currentColors.surface,
    },
    noteText: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontStyle: 'italic',
      lineHeight: 18,
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
  });

  if (!breakdown) {
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
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Paycheck Breakdown</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.infoContainer}>
          <Card.Content>
            <Text style={styles.infoText}>
              You're early- here's how to use this info:
            </Text>
            <Text style={styles.infoSubtext}>
              This breakdown shows where your money goes before it reaches your bank account.
              Understanding these deductions helps you plan your budget accurately.
            </Text>
          </Card.Content>
        </Card>

        <BreakdownSection
          label="Gross Pay"
          amount={breakdown.grossPay}
          description="Your total pay before deductions"
          variant="default"
        />

        <View style={styles.taxSection}>
          <Text style={styles.sectionHeader}>Taxes</Text>
          <BreakdownSection
            label="Federal Tax"
            amount={breakdown.taxes.federal}
            description="Income tax to the federal government"
          />
          <BreakdownSection
            label="State Tax"
            amount={breakdown.taxes.state}
            description="Income tax to your state"
          />
          <BreakdownSection
            label="FICA (Social Security & Medicare)"
            amount={breakdown.taxes.fica}
            description="Social Security and Medicare contributions"
          />
          <BreakdownSection
            label="Total Taxes"
            amount={breakdown.taxes.total}
            variant="emphasis"
          />
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionHeader}>Benefits</Text>
          <BreakdownSection
            label="Health Insurance"
            amount={breakdown.benefits.healthInsurance}
            description="Monthly health insurance premium"
          />
          <BreakdownSection
            label="Retirement (401k)"
            amount={breakdown.benefits.retirement}
            description="Your retirement savings contribution"
          />
          <BreakdownSection
            label="Total Benefits"
            amount={breakdown.benefits.total}
            variant="emphasis"
          />
        </View>

        <BreakdownSection
          label="Take-Home Pay"
          amount={breakdown.takeHomePay}
          description="What you'll actually receive"
          variant="primary"
        />

        <Card style={styles.noteContainer}>
          <Card.Content>
            <Text style={styles.noteText}>
              Note: These are estimates based on standard deductions. Your actual paycheck
              may vary based on your specific benefit elections and tax situation.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
