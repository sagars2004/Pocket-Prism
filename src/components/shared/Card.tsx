import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: boolean;
}

export function Card({ children, style, padding = true }: CardProps) {
  return (
    <View style={[styles.card, padding ? styles.cardPadding : null, style].filter(Boolean)}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPadding: {
    padding: spacing.lg,
  },
});
