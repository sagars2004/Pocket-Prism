import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { TradeoffOption } from '../../types/tradeoff';
import { formatCurrency, formatMonthlyCurrency } from '../../utils/formatters';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';



interface TradeoffCardProps {
  title: string;
  optionA: TradeoffOption;
  optionB: TradeoffOption;
  annualSalary?: number;
}

export function TradeoffCard({ title, optionA, optionB, annualSalary = 50000 }: TradeoffCardProps) {
  const { currentColors, isDark } = useTheme();
  const [expandedOption, setExpandedOption] = useState<'A' | 'B' | null>(null);

  // Dynamic scaler: Baseline is $50k
  // If user earns $100k, impact is doubled to keep relative "feel" constant
  const scaleFactor = Math.max(0.5, annualSalary / 50000);

  const getScaledImpact = (baseImpact: number) => {
    return Math.round(baseImpact * scaleFactor);
  };


  const toggleOption = (option: 'A' | 'B') => {
    // Basic state update for stability
    setExpandedOption(expandedOption === option ? null : option);
  };

  const renderOptionCard = (option: TradeoffOption, type: 'A' | 'B') => {
    const isExpanded = expandedOption === type;
    const isPositive = option.monthlyImpact >= 0;
    const scaledImpact = getScaledImpact(option.monthlyImpact);

    // Custom monochrome styling
    const isOptionA = type === 'A';

    // Light Mode Colors
    const lightModeColors = {
      A: { bg: '#F3F4F6', border: '#1F2937', text: '#111827', textSec: '#111827', badgeBg: 'rgba(32, 32, 32, 0.29)' },
      B: { bg: '#b5b9bfff', border: '#1F2937', text: '#111827', textSec: '#111827', badgeBg: 'rgba(221, 218, 218, 0.6)' }
    };

    // Dark Mode Colors
    const darkModeColors = {
      A: { bg: '#8b939fd4', border: '#ffffffff', text: '#D1D5DB', textSec: '#D1D5DB', badgeBg: 'rgba(32, 32, 32, 0.29)' },
      B: { bg: currentColors.surface, border: '#ffffffff', text: '#D1D5DB', textSec: '#D1D5DB', badgeBg: 'rgba(221, 218, 218, 0.26)' }
    };

    const colors = isDark ? darkModeColors[type] : lightModeColors[type];
    const impactColor = isPositive ? (isOptionA && !isDark ? '#059669' : '#34D399') : (isOptionA && !isDark ? '#DC2626' : '#F87171');

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleOption(type)}
        style={[
          styles.optionCard,
          {
            backgroundColor: colors.bg,
            borderColor: isExpanded ? colors.border : colors.border, // Border always visible based on request? "dark border" implies visible.
            // Wait, request said "light grey with dark border". Assuming border is always there or only when expanded?
            // "one card is light grey with a dark border" implies persistent border.
            // Let's make border always visible but maybe thicker when expanded?
            // Or just always 2px as per request style.
            borderWidth: 2,
            overflow: 'hidden'
          }
        ]}
      >
        <View style={styles.optionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>
              {option.title}
            </Text>
            {option.description && (
              <Text style={[styles.optionDesc, { color: colors.textSec }]}>
                {option.description}
              </Text>
            )}
          </View>
          <View style={[styles.impactBadge, { backgroundColor: colors.badgeBg, borderColor: colors.border, borderWidth: 1 }]}>
            <Text style={[styles.impactValue, { color: impactColor }]}>
              {scaledImpact > 0 ? '+' : ''}{formatMonthlyCurrency(scaledImpact)}
            </Text>
            <Text style={[styles.impactLabel, { color: colors.textSec }]}>/mo</Text>
          </View>
        </View>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={[styles.divider, { backgroundColor: colors.border, opacity: 0.3 }]} />
            <View style={styles.prosConsRow}>
              <View style={styles.prosContainer}>
                <Text style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="check-circle-outline" size={14} color={isOptionA ? (isDark ? '#34D399' : '#059669') : '#34D399'} /> PROS
                </Text>
                {option.pros.map((pro, i) => (
                  <Text key={i} style={[styles.detailItem, { color: colors.text }]}>• {pro}</Text>
                ))}
              </View>

              <View style={styles.consContainer}>
                <Text style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={14} color={isOptionA ? (isDark ? '#F87171' : '#DC2626') : '#F87171'} /> CONS
                </Text>
                {option.cons.map((con, i) => (
                  <Text key={i} style={[styles.detailItem, { color: colors.textSec }]}>• {con}</Text>
                ))}
              </View>
            </View>
          </View>
        )}

        {!isExpanded && (
          <View style={{ alignItems: 'center', marginTop: spacing.sm }}>
            <Text style={{ fontSize: 12, color: isDark ? '#fff' : 'rgba(0, 0, 0, 1)', fontWeight: '600' }}>
              Tap for details
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h3,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.lg,
    },
    vsContainer: {
      alignItems: 'center',
      marginVertical: -12,
      zIndex: 10,
    },
    vsBadge: {
      backgroundColor: currentColors.surface,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? "#fff" : "#000",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    vsText: {
      ...typography.caption,
      fontWeight: '900',
      color: isDark ? "#fff" : "#000",
    },
    optionCard: {
      borderRadius: 16,
      padding: spacing.md,
      marginBottom: spacing.xs,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    optionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    optionTitle: {
      ...typography.h4,
      fontWeight: '700',
      marginBottom: 4,
    },
    optionDesc: {
      ...typography.bodySmall,
      fontSize: 13,
      lineHeight: 18,
    },
    impactBadge: {
      alignItems: 'flex-end',
      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginLeft: spacing.sm,
    },
    impactValue: {
      ...typography.h4,
      fontWeight: '800',
      fontSize: 18,
    },
    impactLabel: {
      fontSize: 10,
      color: currentColors.textTertiary,
      textTransform: 'uppercase',
      fontWeight: '700',
    },
    detailsContainer: {
      marginTop: spacing.md,
    },
    divider: {
      height: 1,
      backgroundColor: currentColors.border,
      opacity: 0.5,
      marginBottom: spacing.md,
    },
    prosConsRow: {
      gap: spacing.md,
    },
    prosContainer: {
      marginBottom: spacing.sm,
    },
    consContainer: {},
    sectionHeader: {
      fontSize: 11,
      fontWeight: '800',
      color: currentColors.textSecondary,
      marginBottom: spacing.xs,
      letterSpacing: 0.5,
    },
    detailItem: {
      ...typography.bodySmall,
      marginBottom: 4,
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={{ gap: spacing.md }}>
        {renderOptionCard(optionA, 'A')}

        <View style={styles.vsContainer}>
          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        </View>

        {renderOptionCard(optionB, 'B')}
      </View>
    </View>
  );
}
