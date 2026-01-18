import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { Picker } from '../shared/Picker';
import { Footer } from '../shared/Footer';
import { TextInput } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import {
  calculateMonthlyProjections,
  calculateAnnualEarnings,
  calculateTradeoffComparisons,
  calculateExpenseAccumulation,
} from '../../services/calculations/planning';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 4;

interface PlanScreenProps {
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSettings?: () => void;
  navigation?: any;
}

export function PlanScreen({ onBack, onNavigateToHome, onNavigateToSettings, navigation }: PlanScreenProps) {
  const { currentColors, isDark } = useTheme();
  const { userData } = useUser();
  const [monthsToProject, setMonthsToProject] = useState('12');
  const [monthlyExpenses, setMonthlyExpenses] = useState('2000');

  const projections = useMemo(() => {
    if (!userData?.salary) return [];
    return calculateMonthlyProjections(userData.salary, parseInt(monthsToProject) || 12);
  }, [userData?.salary, monthsToProject]);

  const annualEarnings = useMemo(() => {
    if (!userData?.salary) return null;
    return calculateAnnualEarnings(userData.salary);
  }, [userData?.salary]);

  const tradeoffComparisons = useMemo(() => {
    if (!userData?.salary) return [];
    return calculateTradeoffComparisons(userData.salary);
  }, [userData?.salary]);

  const expenseAccumulation = useMemo(() => {
    if (!userData?.salary || !monthlyExpenses) return [];
    const expenses = parseFloat(monthlyExpenses) || 0;
    return calculateExpenseAccumulation(userData.salary, expenses, parseInt(monthsToProject) || 12);
  }, [userData?.salary, monthlyExpenses, monthsToProject]);

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
      backgroundColor: currentColors.surface,
    },
    backButton: {
      padding: spacing.sm,
    },
    backButtonText: {
      ...typography.body,
      color: currentColors.primary,
    },
    title: {
      ...typography.h3,
      color: currentColors.text,
    },
    placeholder: {
      width: 60,
    },
    scrollContent: {
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.h4,
      color: currentColors.text,
      marginBottom: spacing.md,
      fontWeight: '700',
    },
    card: {
      marginBottom: spacing.md,
      borderRadius: 12,
      backgroundColor: currentColors.surface,
    },
    cardContent: {
      padding: spacing.md,
    },
    controlsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    controlItem: {
      flex: 1,
    },
    chartContainer: {
      marginTop: spacing.md,
      paddingVertical: spacing.md,
    },
    chartTitle: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    chart: {
      height: 200,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
      borderLeftWidth: 1,
      borderLeftColor: currentColors.borderLight,
      marginBottom: spacing.sm,
    },
    chartBar: {
      flex: 1,
      marginHorizontal: 2,
      borderRadius: 4,
      justifyContent: 'flex-end',
    },
    chartLabels: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: spacing.xs,
    },
    chartLabel: {
      ...typography.caption,
      color: currentColors.textSecondary,
      fontSize: 10,
      textAlign: 'center',
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    statLabel: {
      ...typography.body,
      color: currentColors.textSecondary,
    },
    statValue: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
    },
    comparisonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    comparisonScenario: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
      flex: 1,
    },
    comparisonAmount: {
      ...typography.body,
      color: currentColors.primary,
      fontWeight: '700',
      marginLeft: spacing.md,
    },
    comparisonSavings: {
      ...typography.caption,
      color: '#10B981',
      marginLeft: spacing.sm,
      fontWeight: '600',
    },
    comparisonDescription: {
      ...typography.caption,
      color: currentColors.textSecondary,
      marginTop: spacing.xs,
    },
    expenseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    expenseLabel: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
    },
    expenseValue: {
      ...typography.bodySmall,
      color: currentColors.text,
      fontWeight: '600',
    },
    positiveValue: {
      color: '#10B981',
    },
    negativeValue: {
      color: '#EF4444',
    },
    emptyContainer: {
      padding: spacing.xxl,
      alignItems: 'center',
    },
    emptyText: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
    },
    footerContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  if (!userData?.salary) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Plan</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-line" size={64} color={currentColors.textSecondary} />
          <Text style={styles.emptyText}>Please complete onboarding to see your plan.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to get max value for chart scaling
  const getMaxValue = (data: number[]) => {
    return Math.max(...data, 0) * 1.1; // Add 10% padding
  };

  // Net vs Gross comparison chart data
  const grossNetData = projections.map(p => ({
    month: p.monthName,
    gross: p.grossPay,
    net: p.netPay,
  }));

  const maxGrossNet = getMaxValue([...grossNetData.map(d => d.gross), ...grossNetData.map(d => d.net)]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Financial Plan</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Controls */}
        <View style={styles.controlsRow}>
          <View style={styles.controlItem}>
            <Text style={[styles.statLabel, { marginBottom: spacing.xs }]}>Projection Period</Text>
            <Picker
              selectedValue={monthsToProject}
              onValueChange={setMonthsToProject}
              items={[
                { label: '6 months', value: '6' },
                { label: '12 months', value: '12' },
                { label: '18 months', value: '18' },
                { label: '24 months', value: '24' },
              ]}
              placeholder="Select period"
            />
          </View>
          <View style={styles.controlItem}>
            <TextInput
              label="Monthly Expenses"
              placeholder="$2000"
              mode="outlined"
              keyboardType="numeric"
              value={monthlyExpenses}
              onChangeText={setMonthlyExpenses}
              left={<TextInput.Affix text="$" />}
              dense
            />
          </View>
        </View>

        {/* Annual Earnings Summary */}
        {annualEarnings && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Annual Earnings</Text>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Gross Income</Text>
                  <Text style={styles.statValue}>{formatCurrency(annualEarnings.annualGross)}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Taxes</Text>
                  <Text style={[styles.statValue, styles.negativeValue]}>
                    -{formatCurrency(annualEarnings.annualTaxes)} ({annualEarnings.taxRate.toFixed(1)}%)
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Benefits</Text>
                  <Text style={[styles.statValue, styles.negativeValue]}>
                    -{formatCurrency(annualEarnings.annualBenefits)}
                  </Text>
                </View>
                <View style={[styles.statRow, { borderBottomWidth: 0, paddingTop: spacing.sm }]}>
                  <Text style={[styles.statLabel, { fontWeight: '700' }]}>Net Income</Text>
                  <Text style={[styles.statValue, { fontSize: 18, color: currentColors.primary }]}>
                    {formatCurrency(annualEarnings.annualNet)}
                  </Text>
                </View>
                <Text style={[styles.chartTitle, { marginTop: spacing.sm }]}>
                  Take-home rate: {annualEarnings.takeHomeRate.toFixed(1)}%
                </Text>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Net vs Gross Comparison Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Net vs Gross Pay (Monthly)</Text>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.chartContainer}>
                <View style={styles.chart}>
                  {grossNetData.slice(0, 12).map((data, index) => (
                    <View key={index} style={{ flex: 1, marginHorizontal: 2 }}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${(data.gross / maxGrossNet) * 100}%`,
                            backgroundColor: currentColors.textSecondary + '40',
                            marginBottom: 2,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: `${(data.net / maxGrossNet) * 100}%`,
                            backgroundColor: currentColors.primary,
                          },
                        ]}
                      />
                    </View>
                  ))}
                </View>
                <View style={styles.chartLabels}>
                  {grossNetData.slice(0, 12).map((data, index) => (
                    <Text key={index} style={styles.chartLabel}>
                      {data.month}
                    </Text>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: spacing.sm, gap: spacing.md }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: currentColors.textSecondary + '40', marginRight: spacing.xs }} />
                    <Text style={styles.chartLabel}>Gross</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 12, height: 12, backgroundColor: currentColors.primary, marginRight: spacing.xs }} />
                    <Text style={styles.chartLabel}>Net</Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Cumulative Net Earnings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cumulative Net Earnings</Text>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.chartContainer}>
                <View style={styles.chart}>
                  {projections.slice(0, Math.min(12, projections.length)).map((proj, index) => {
                    const maxCumulative = getMaxValue(projections.map(p => p.cumulativeNet));
                    return (
                      <View
                        key={index}
                        style={[
                          styles.chartBar,
                          {
                            height: `${(proj.cumulativeNet / maxCumulative) * 100}%`,
                            backgroundColor: currentColors.primary,
                          },
                        ]}
                      />
                    );
                  })}
                </View>
                <View style={styles.chartLabels}>
                  {projections.slice(0, Math.min(12, projections.length)).map((proj, index) => (
                    <Text key={index} style={styles.chartLabel}>
                      {proj.monthName}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.chartTitle, { marginTop: spacing.sm }]}>
                  Total after {monthsToProject} months: {formatCurrency(projections[projections.length - 1]?.cumulativeNet || 0)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Tradeoff Comparisons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tradeoff Comparisons</Text>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {tradeoffComparisons.map((comparison, index) => (
                <View key={index}>
                  <View style={styles.comparisonRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.comparisonScenario}>{comparison.scenario}</Text>
                      {comparison.description && (
                        <Text style={styles.comparisonDescription}>{comparison.description}</Text>
                      )}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.comparisonAmount}>{formatCurrency(comparison.monthlyNet)}/mo</Text>
                      {comparison.monthlySavings !== undefined && comparison.monthlySavings !== 0 && (
                        <Text
                          style={[
                            styles.comparisonSavings,
                            { color: comparison.monthlySavings > 0 ? '#10B981' : '#EF4444' },
                          ]}
                        >
                          {comparison.monthlySavings > 0 ? '+' : ''}
                          {formatCurrency(comparison.monthlySavings)}/mo
                        </Text>
                      )}
                    </View>
                  </View>
                  {index < tradeoffComparisons.length - 1 && (
                    <View style={{ height: 1, backgroundColor: currentColors.borderLight, marginVertical: spacing.xs }} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Expense Accumulation */}
        {expenseAccumulation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expense Accumulation</Text>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                {expenseAccumulation.slice(0, 12).map((expense, index) => (
                  <View key={index} style={styles.expenseRow}>
                    <Text style={styles.expenseLabel}>{expense.monthName}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.expenseValue, expense.remainingBalance > 0 ? styles.positiveValue : styles.negativeValue]}>
                        {formatCurrency(expense.remainingBalance)}
                      </Text>
                      <Text style={[styles.chartLabel, { marginTop: spacing.xs }]}>
                        Savings rate: {expense.savingsRate.toFixed(1)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </View>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer
          navigation={navigation}
          onHomePress={onNavigateToHome}
          onPlanPress={() => {}}
          onSettingsPress={onNavigateToSettings}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}
