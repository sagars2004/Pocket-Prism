import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface GreetingProps {
  name?: string;
}

export function Greeting({ name }: GreetingProps) {
  const { currentColors } = useTheme();
  const greeting = name ? `Hi ${name}!` : 'Hi there!';

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.xl,
    },
    greeting: {
      ...typography.h2,
      color: currentColors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      ...typography.bodyLarge,
      color: currentColors.textSecondary,
      lineHeight: 24,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subtitle}>Here's a snapshot of your paycheck...</Text>
    </View>
  );
}
