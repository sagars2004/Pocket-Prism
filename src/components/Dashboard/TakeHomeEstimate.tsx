import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { PaycheckBreakdown } from '../../types/paycheck';

interface TakeHomeEstimateProps {
  breakdown: PaycheckBreakdown;
  payFrequency: string;
}

export function TakeHomeEstimate({ breakdown, payFrequency }: TakeHomeEstimateProps) {
  const { takeHomePay, grossPay } = breakdown;
  const { currentColors } = useTheme();

  const styles = StyleSheet.create({
    card: {
      marginBottom: spacing.lg,
      backgroundColor: currentColors.surface,
      borderRadius: 12,
    },
    cardContent: {
      padding: spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xs,
    },
    label: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    grossPayLabel: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
    grossPayValue: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      fontWeight: '600',
    },
    amount: {
      ...typography.h1,
      color: currentColors.primary,
      marginBottom: spacing.xs,
      fontWeight: '700',
    },
    frequency: {
      ...typography.body,
      color: currentColors.textSecondary,
      marginBottom: spacing.md,
    },
    noteContainer: {
      marginTop: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    note: {
      ...typography.caption,
      color: currentColors.textTertiary,
      fontStyle: 'italic',
      lineHeight: 18,
    },
  });

  return (
    <Card style={styles.card} elevation={3}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Take-Home Pay</Text>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.grossPayLabel}>Gross Pay</Text>
            <Text style={styles.grossPayValue}>{formatCurrency(grossPay)}</Text>
          </View>
        </View>
        <Text style={styles.amount}>{formatCurrency(takeHomePay)}</Text>
        <Text style={styles.frequency}>Per {payFrequency.toLowerCase()}</Text>
        <View style={styles.noteContainer}>
          <Text style={styles.note}>
            NOTE: This is an estimate. Your actual take-home may vary based on your specific deductions.
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}
