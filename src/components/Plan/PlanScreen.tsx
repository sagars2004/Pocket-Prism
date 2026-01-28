import React, { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
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
import { estimateTakeHome } from '../../services/calculations/paycheck';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - spacing.lg * 4;

interface PlanScreenProps {
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSettings?: () => void;
  navigation?: any;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: string;
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

// Helper to get pay periods per month
function getPayPeriodsPerMonth(frequency: string, payPeriodsPerYear?: number): number {
  if (payPeriodsPerYear && payPeriodsPerYear > 0) {
    return payPeriodsPerYear / 12;
  }
  switch (frequency) {
    case 'weekly': return 52 / 12;
    case 'biweekly': return 26 / 12;
    case 'semimonthly': return 24 / 12;
    case 'monthly': return 1;
    default: return 1;
  }
}

export function PlanScreen({ onBack, onNavigateToHome, onNavigateToSettings, navigation }: PlanScreenProps) {
  const { currentColors, isDark } = useTheme();
  const { userData } = useUser();
  const [monthsToProject, setMonthsToProject] = useState('12');
  const sliderValues = [3, 6, 9, 12];
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: '1', name: 'Rent', amount: '' },
    { id: '2', name: 'Groceries', amount: '' },
    { id: '3', name: 'Utilities', amount: '' },
  ]);

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

  // Calculate total monthly expenses from expense items
  const totalMonthlyExpenses = useMemo(() => {
    return expenses.reduce((total, expense) => {
      const amount = parseFloat(expense.amount) || 0;
      return total + amount;
    }, 0);
  }, [expenses]);

  const expenseAccumulation = useMemo(() => {
    if (!userData?.salary || totalMonthlyExpenses === 0) return [];
    return calculateExpenseAccumulation(userData.salary, totalMonthlyExpenses, parseInt(monthsToProject) || 12);
  }, [userData?.salary, totalMonthlyExpenses, monthsToProject]);

  // Get current month breakdown for single month chart
  const currentMonthBreakdown = useMemo(() => {
    if (!userData?.salary) return null;
    const breakdown = estimateTakeHome(userData.salary);
    const payPeriodsPerMonth = getPayPeriodsPerMonth(userData.salary.payFrequency, userData.salary.payPeriodsPerYear);

    const gross = breakdown.grossPay * payPeriodsPerMonth;
    const federalTax = breakdown.taxes.federal * payPeriodsPerMonth;
    const stateTax = breakdown.taxes.state * payPeriodsPerMonth;
    const fica = breakdown.taxes.fica * payPeriodsPerMonth;
    // Calculate total benefits (Consolidated)
    const totalBenefits = breakdown.benefits.total * payPeriodsPerMonth;
    const expenses = totalMonthlyExpenses;

    // Calculate total deductions to ensure bar doesn't exceed gross
    const totalDeductions = federalTax + stateTax + fica + totalBenefits + expenses;
    const calculatedNet = gross - totalDeductions;

    return {
      gross,
      federalTax,
      stateTax,
      fica,
      totalBenefits,
      net: Math.max(0, calculatedNet), // Ensure net is never negative
      expenses,
    };
  }, [userData?.salary, totalMonthlyExpenses]);

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
      backgroundColor: currentColors.background,
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
    periodButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    periodButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: currentColors.border,
      backgroundColor: currentColors.surface,
    },
    periodButtonActive: {
      borderColor: isDark ? '#FFFFFF' : '#000000',
      borderWidth: 3,
      backgroundColor: isDark ? '#FFFFFF10' : '#00000010',
    },
    periodButtonText: {
      ...typography.body,
      color: currentColors.textSecondary,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    periodButtonTextActive: {
      color: currentColors.text,
      fontWeight: '700',
      fontSize: 20,
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
      color: currentColors.text,
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
    emptyLogo: {
      width: 540,
      height: 168,
      resizeMode: 'contain',
      marginBottom: spacing.md,
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
          <Image
            source={
              isDark
                ? require('../../../assets/finsh_logo_inverted.png')
                : require('../../../assets/finsh_logo.png')
            }
            style={styles.emptyLogo}
            accessible
            accessibilityLabel="Finsh logo"
          />
          <Text style={[styles.emptyText, { marginTop: spacing.sm }]}>
            Woah there! We know you're enthusiastic but there's a couple steps you need to do first.
          </Text>
          <Text style={styles.emptyText}>
            {'\n'}Please complete onboarding to see your personalized Finsh tank.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Moved hooks and helpers to top level to fix Hook Rule violations

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Finsh Tank</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projection Period (Months)</Text>
          <View style={styles.periodButtonsContainer}>
            {sliderValues.map((value) => {
              const isSelected = parseInt(monthsToProject) === value;
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => setMonthsToProject(value.toString())}
                  style={[
                    styles.periodButton,
                    isSelected && styles.periodButtonActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      isSelected && styles.periodButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Monthly Expenses Section */}
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={styles.sectionTitle}>Monthly Expenses</Text>
            <Text style={[styles.statValue, { fontSize: 16 }]}>
              Total: {formatCurrency(totalMonthlyExpenses)}
            </Text>
          </View>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {expenses.map((expense, index) => (
                <View key={expense.id} style={{ marginBottom: index < expenses.length - 1 ? spacing.md : 0 }}>
                  <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        label="Expense Name"
                        placeholder="e.g., Rent, Groceries"
                        mode="outlined"
                        value={expense.name}
                        onChangeText={(text) => {
                          const updated = expenses.map(e =>
                            e.id === expense.id ? { ...e, name: text } : e
                          );
                          setExpenses(updated);
                        }}
                        dense
                        style={{ marginBottom: 0 }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <TextInput
                        label="Amount"
                        mode="outlined"
                        keyboardType="numeric"
                        value={expense.amount}
                        onChangeText={(text) => {
                          const filteredText = text.replace(/[^0-9.]/g, '');
                          const updated = expenses.map(e =>
                            e.id === expense.id ? { ...e, amount: filteredText } : e
                          );
                          setExpenses(updated);
                        }}
                        left={<TextInput.Affix text="$" />}
                        dense
                        style={{ marginBottom: 0 }}
                      />
                    </View>
                    {expenses.length > 1 && (
                      <TouchableOpacity
                        onPress={() => {
                          setExpenses(expenses.filter(e => e.id !== expense.id));
                        }}
                        style={{ padding: spacing.sm, marginTop: spacing.xs }}
                      >
                        <MaterialCommunityIcons name="delete-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => {
                  const newId = String(Date.now());
                  setExpenses([...expenses, { id: newId, name: '', amount: '' }]);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: spacing.md,
                  paddingVertical: spacing.sm,
                }}
              >
                <MaterialCommunityIcons name="plus-circle-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                <Text style={[styles.statLabel, { marginLeft: spacing.xs, color: isDark ? '#FFFFFF' : '#000000', textDecorationLine: 'underline' }]}>
                  Add Expense
                </Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
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
                  <Text style={[styles.statValue, { fontSize: 18, color: '#4CAF50', fontWeight: '700' }]}>
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

        {/* Single Month Breakdown Chart */}
        {currentMonthBreakdown && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gross vs. Net Pay (Current Month)</Text>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.chartContainer}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 250, marginBottom: spacing.md, overflow: 'hidden' }}>
                    {/* Bar Chart */}
                    <View style={{ flex: 1, height: '100%', justifyContent: 'flex-end', marginRight: spacing.md, overflow: 'hidden', borderWidth: 2, borderColor: currentColors.textSecondary + '80' }}>
                      <View style={{ height: '100%', width: '100%', justifyContent: 'flex-end', overflow: 'hidden' }}>
                        {/* Federal Tax (Red) - Bottom */}
                        {currentMonthBreakdown.federalTax > 0 && (
                          <View
                            style={{
                              height: `${(currentMonthBreakdown.federalTax / currentMonthBreakdown.gross) * 100}%`,
                              backgroundColor: '#D32F2F',
                              width: '100%',
                            }}
                          />
                        )}
                        {/* State Tax (Bright Sky Blue) */}
                        {currentMonthBreakdown.stateTax > 0 && (
                          <View
                            style={{
                              height: `${(currentMonthBreakdown.stateTax / currentMonthBreakdown.gross) * 100}%`,
                              backgroundColor: '#03A9F4',
                              width: '100%',
                            }}
                          />
                        )}
                        {/* FICA (Bright Yellow) */}
                        {currentMonthBreakdown.fica > 0 && (
                          <View
                            style={{
                              height: `${(currentMonthBreakdown.fica / currentMonthBreakdown.gross) * 100}%`,
                              backgroundColor: '#FFEB3B',
                              width: '100%',
                            }}
                          />
                        )}
                        {/* Benefits (Purple) */}
                        {currentMonthBreakdown.totalBenefits > 0 && (
                          <View
                            style={{
                              height: `${(currentMonthBreakdown.totalBenefits / currentMonthBreakdown.gross) * 100}%`,
                              backgroundColor: '#9C27B0',
                              width: '100%',
                            }}
                          />
                        )}
                        {/* Expenses (Orange) */}
                        {currentMonthBreakdown.expenses > 0 && (
                          <View
                            style={{
                              height: `${(currentMonthBreakdown.expenses / currentMonthBreakdown.gross) * 100}%`,
                              backgroundColor: '#FF9800',
                              width: '100%',
                            }}
                          />
                        )}
                        {/* Net Pay (Green) - Top */}
                        <View
                          style={{
                            height: `${(currentMonthBreakdown.net / currentMonthBreakdown.gross) * 100}%`,
                            backgroundColor: '#4CAF50',
                            width: '100%',
                            borderWidth: 2,
                            borderColor: currentColors.textSecondary + '80',
                          }}
                        />
                      </View>
                    </View>

                    {/* Labels */}
                    <View style={{ flex: 1, justifyContent: 'space-between', height: '100%', paddingLeft: spacing.sm }}>
                      {/* Gross Pay - Bottom */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <View style={{ width: 12, height: 12, backgroundColor: currentColors.textSecondary + '40', marginRight: spacing.xs, borderRadius: 2 }} />
                          <Text style={[styles.chartLabel, { color: currentColors.text, fontWeight: '700' }]}>Gross Pay</Text>
                        </View>
                        <Text style={[styles.chartLabel, { fontWeight: '700', color: currentColors.text }]}>
                          {formatCurrency(currentMonthBreakdown.gross)}
                        </Text>
                      </View>

                      {/* Federal Tax */}
                      {currentMonthBreakdown.federalTax > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: '#D32F2F', marginRight: spacing.xs, borderRadius: 2 }} />
                            <Text style={[styles.chartLabel, { color: currentColors.text }]}>Federal Tax</Text>
                          </View>
                          <Text style={[styles.chartLabel, { fontWeight: '600', color: currentColors.text }]}>
                            {formatCurrency(currentMonthBreakdown.federalTax)}
                          </Text>
                        </View>
                      )}

                      {/* State Tax */}
                      {currentMonthBreakdown.stateTax > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: '#03A9F4', marginRight: spacing.xs, borderRadius: 2 }} />
                            <Text style={[styles.chartLabel, { color: currentColors.text }]}>State Tax</Text>
                          </View>
                          <Text style={[styles.chartLabel, { fontWeight: '600', color: currentColors.text }]}>
                            {formatCurrency(currentMonthBreakdown.stateTax)}
                          </Text>
                        </View>
                      )}

                      {/* FICA */}
                      {currentMonthBreakdown.fica > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: '#FFEB3B', marginRight: spacing.xs, borderRadius: 2 }} />
                            <Text style={[styles.chartLabel, { color: currentColors.text }]}>FICA</Text>
                          </View>
                          <Text style={[styles.chartLabel, { fontWeight: '600', color: currentColors.text }]}>
                            {formatCurrency(currentMonthBreakdown.fica)}
                          </Text>
                        </View>
                      )}

                      {/* Benefits */}
                      {currentMonthBreakdown.totalBenefits > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: '#9C27B0', marginRight: spacing.xs, borderRadius: 2 }} />
                            <Text style={[styles.chartLabel, { color: currentColors.text }]}>Benefits</Text>
                          </View>
                          <Text style={[styles.chartLabel, { fontWeight: '600', color: currentColors.text }]}>
                            {formatCurrency(currentMonthBreakdown.totalBenefits)}
                          </Text>
                        </View>
                      )}

                      {/* Expenses */}
                      {currentMonthBreakdown.expenses > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{ width: 12, height: 12, backgroundColor: '#FF9800', marginRight: spacing.xs, borderRadius: 2 }} />
                            <Text style={[styles.chartLabel, { color: currentColors.text }]}>Expenses</Text>
                          </View>
                          <Text style={[styles.chartLabel, { fontWeight: '600', color: currentColors.text }]}>
                            {formatCurrency(currentMonthBreakdown.expenses)}
                          </Text>
                        </View>
                      )}

                      {/* Net Pay - Top */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                          <View style={{ width: 12, height: 12, backgroundColor: '#4CAF50', marginRight: spacing.xs, borderRadius: 2 }} />
                          <Text style={[styles.chartLabel, { color: currentColors.text, fontWeight: '700' }]}>Net Pay</Text>
                        </View>
                        <Text style={[styles.chartLabel, { fontWeight: '700', color: currentColors.text }]}>
                          {formatCurrency(currentMonthBreakdown.net)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Cumulative Net Earnings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cumulative Net Earnings</Text>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={[styles.chartContainer, { marginTop: spacing.lg }]}>
                <View style={[styles.chart, { position: 'relative' }]}>
                  {projections.slice(0, Math.min(12, projections.length)).map((proj, index) => {
                    const maxCumulative = getMaxValue(projections.map(p => p.cumulativeNet));
                    const totalBars = Math.min(12, projections.length);
                    // Calculate gradient: light blue (left) to darker blue (right)
                    // Interpolate between #81D4FA (light blue) and #0277BD (darker blue)
                    const ratio = index / (totalBars - 1 || 1);
                    const r1 = 129, g1 = 212, b1 = 250; // Light blue #81D4FA
                    const r2 = 2, g2 = 119, b2 = 189; // Dark blue #0277BD
                    const r = Math.round(r1 + (r2 - r1) * ratio);
                    const g = Math.round(g1 + (g2 - g1) * ratio);
                    const b = Math.round(b1 + (b2 - b1) * ratio);
                    const gradientColor = `rgb(${r}, ${g}, ${b})`;
                    const barHeight = maxCumulative > 0 ? (proj.cumulativeNet / maxCumulative) * 200 : 0;

                    return (
                      <View
                        key={index}
                        style={{ flex: 1, marginHorizontal: 2, alignItems: 'center', justifyContent: 'flex-end' }}
                      >
                        {/* Rotated text above bar */}
                        <Text
                          style={{
                            fontSize: 10,
                            color: currentColors.text,
                            transform: [{ rotate: '-90deg' }],
                            marginBottom: spacing.md,
                            width: 60,
                            textAlign: 'center',
                          }}
                        >
                          {formatCurrency(proj.cumulativeNet)}
                        </Text>
                        {/* Bar */}
                        <View
                          style={{
                            width: '100%',
                            height: barHeight,
                            backgroundColor: gradientColor,
                            borderRadius: 4,
                            minHeight: 2,
                          }}
                        />
                      </View>
                    );
                  })}
                </View>
                <View style={[styles.chartLabels, { marginTop: spacing.md }]}>
                  {projections.slice(0, Math.min(12, projections.length)).map((proj, index) => (
                    <Text key={index} style={styles.chartLabel}>
                      {proj.monthName}
                    </Text>
                  ))}
                </View>
                <Text style={[styles.chartTitle, { marginTop: spacing.md }]}>
                  Total after {monthsToProject} months: {formatCurrency(projections[projections.length - 1]?.cumulativeNet || 0)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Tradeoff Comparisons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tradeoff Comparisons (This Month)</Text>
          <View style={{ gap: spacing.md }}>
            {tradeoffComparisons.map((comparison, index) => (
              <Card key={index} style={styles.card}>
                <Card.Content style={styles.cardContent}>
                  <View style={[styles.comparisonRow, { borderBottomWidth: 0, paddingVertical: 0 }]}>
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
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Projected Savings */}
        {expenseAccumulation.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projected Savings ({monthsToProject} Months)</Text>
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                {expenseAccumulation.slice(0, 12).map((expense, index) => (
                  <View key={index} style={styles.expenseRow}>
                    <Text style={styles.expenseLabel}>{expense.monthName}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[styles.expenseValue, { color: '#10B981' }]}>
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
          onPlanPress={() => { }}
          onSettingsPress={onNavigateToSettings}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
}
