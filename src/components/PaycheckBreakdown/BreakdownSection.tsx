import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Card } from '../shared/Card';
import { formatCurrency } from '../../utils/formatters';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BreakdownSectionProps {
  label: string;
  amount: number;
  description?: string;
  variant?: 'default' | 'primary' | 'emphasis';
}

export function BreakdownSection({
  label,
  amount,
  description,
  variant = 'default',
}: BreakdownSectionProps) {
  const getVariantStyles = (): { container?: ViewStyle; amount?: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: styles.sectionPrimary,
          amount: styles.amountPrimary,
        };
      case 'emphasis':
        return {
          container: styles.sectionEmphasis,
          amount: styles.amountEmphasis,
        };
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();

  const cardStyles: ViewStyle[] = [styles.section];
  if (variantStyles.container) {
    cardStyles.push(variantStyles.container);
  }

  const amountStyles: TextStyle[] = [styles.amount];
  if (variantStyles.amount) {
    amountStyles.push(variantStyles.amount);
  }

  return (
    <Card style={cardStyles}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
        <Text style={amountStyles}>{formatCurrency(amount)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.md,
  },
  sectionPrimary: {
    backgroundColor: colors.primaryLight + '10',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sectionEmphasis: {
    backgroundColor: colors.surfaceSecondary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.h4,
    color: colors.text,
  },
  amountPrimary: {
    color: colors.primary,
  },
  amountEmphasis: {
    ...typography.h3,
    color: colors.text,
  },
});
