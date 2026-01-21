import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const { currentColors } = useTheme();
  const progress = (currentStep - 1) / (totalSteps - 1);

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    text: {
      ...typography.caption,
      color: currentColors.textSecondary,
      marginBottom: spacing.sm,
    },
    progressBar: {
      height: 4,
      borderRadius: 2,
      backgroundColor: currentColors.borderLight,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Step {currentStep - 1} of {totalSteps - 1}
      </Text>
      <ProgressBar
        progress={progress}
        color={currentColors.text}
        style={styles.progressBar}
      />
    </View>
  );
}
