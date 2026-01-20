import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ActionButtonsProps {
  onViewTradeoffs: () => void;
  onViewBreakdown: () => void;
}

export function ActionButtons({ onViewTradeoffs, onViewBreakdown }: ActionButtonsProps) {
  const { currentColors, isDark } = useTheme();

  const styles = StyleSheet.create({
    container: {
      gap: spacing.md,
    },
    button: {
      width: '100%',
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    buttonContent: {
      paddingVertical: spacing.md,
      minHeight: spacing.touchTarget,
    },
    buttonLabel: {
      ...typography.button,
      fontSize: 19,
    },
  });

  const TradeoffIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="swap-horizontal" size={24} color={color} />
  );

  const BreakdownIcon = ({ color }: { color: string }) => (
    <MaterialCommunityIcons name="calculator" size={24} color={color} />
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={onViewBreakdown}
        buttonColor={isDark ? '#E5E5E5' : '#000000'}
        textColor={isDark ? '#000000' : '#FFFFFF'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon={({ color }) => <BreakdownIcon color={color} />}
      >
        View Paycheck Breakdown
      </Button>
      <Button
        mode="contained"
        onPress={onViewTradeoffs}
        buttonColor={isDark ? '#E5E5E5' : '#000000'}
        textColor={isDark ? '#000000' : '#FFFFFF'}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon={({ color }) => <TradeoffIcon color={color} />}
      >
        View Tradeoff Cards
      </Button>
    </View>
  );
}
