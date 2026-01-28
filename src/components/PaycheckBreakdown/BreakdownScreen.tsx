import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Footer } from '../shared/Footer';
import { BreakdownSection } from './BreakdownSection';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { estimateTakeHome } from '../../services/calculations/paycheck';
import { CustomBenefit } from '../../types/user';
import { formatCurrency } from '../../utils/formatters';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BreakdownScreenProps {
  onBack: () => void;
  navigation?: any;
}

interface LocalBenefit {
  id: string;
  name: string;
  amount: string;
}

export function BreakdownScreen({ onBack, navigation }: BreakdownScreenProps) {
  const { userData, setUserData } = useUser();
  const { currentColors, isDark } = useTheme();

  // Local state for editable benefits to handle string inputs
  const [benefitsList, setBenefitsList] = useState<LocalBenefit[]>([]);
  const isInitialized = useRef(false);

  const breakdown = useMemo(() => {
    if (!userData?.salary) return null;
    return estimateTakeHome(userData.salary);
  }, [userData?.salary]);

  // Initialize benefits list from global state ONLY ONCE to prevnt input locking
  useEffect(() => {
    if (!userData?.salary || isInitialized.current) return;

    if (userData.salary.customBenefits && userData.salary.customBenefits.length > 0) {
      setBenefitsList(userData.salary.customBenefits.map(b => ({
        id: b.id,
        name: b.name,
        amount: b.amount.toFixed(2),
      })));
    } else if (breakdown) {
      // Initialize with default estimates if no custom benefits exist
      setBenefitsList([
        {
          id: '1',
          name: 'Health Insurance',
          amount: breakdown.benefits.healthInsurance.toFixed(2),
        },
        {
          id: '2',
          name: 'Retirement',
          amount: breakdown.benefits.retirement.toFixed(2),
        },
      ]);
    }
    isInitialized.current = true;
  }, [userData?.salary, breakdown]); // Depend on breakdown for initial values

  const updateGlobalState = (newList: LocalBenefit[]) => {
    if (!userData?.salary) return;

    const customBenefits: CustomBenefit[] = newList.map(b => ({
      id: b.id,
      name: b.name,
      amount: parseFloat(b.amount) || 0,
    }));

    setUserData({
      ...userData,
      salary: {
        ...userData.salary,
        customBenefits,
      },
    });
  };

  const handleUpdateBenefit = (id: string, field: keyof LocalBenefit, value: string) => {
    const newList = benefitsList.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setBenefitsList(newList);
    updateGlobalState(newList);
  };

  const handleAddBenefit = () => {
    const newBenefit: LocalBenefit = {
      id: Date.now().toString(),
      name: 'New Benefit',
      amount: '0.00',
    };
    const newList = [...benefitsList, newBenefit];
    setBenefitsList(newList);
    updateGlobalState(newList);
  };

  const handleDeleteBenefit = (id: string) => {
    const newList = benefitsList.filter(item => item.id !== id);
    setBenefitsList(newList);
    updateGlobalState(newList);
  };

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
      padding: spacing.md,
      paddingBottom: spacing.xxl * 2,
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
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
      marginTop: spacing.md,
    },
    sectionHeader: {
      ...typography.h4,
      color: currentColors.text,
      fontWeight: '700',
    },
    sectionDescription: {
      ...typography.caption,
      color: currentColors.textSecondary,
      marginBottom: spacing.md,
      marginTop: -spacing.xs,
    },
    statValue: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '600',
      fontSize: 16,
    },
    statLabel: {
      ...typography.body,
      color: currentColors.textSecondary,
    },
    taxSection: {
      marginBottom: spacing.lg,
    },
    benefitsSection: {
      marginBottom: spacing.lg,
    },
    card: {
      marginBottom: spacing.md,
      borderRadius: 12,
      backgroundColor: currentColors.surface,
    },
    cardContent: {
      padding: spacing.md,
    },
    inputCard: {
      marginBottom: spacing.sm,
      backgroundColor: currentColors.surface,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    nameInput: {
      flex: 1,
      height: 40,
      backgroundColor: 'transparent',
      ...typography.body,
    },
    amountInput: {
      width: 100,
      height: 40,
      backgroundColor: 'transparent',
      textAlign: 'right',
      ...typography.body,
      fontWeight: '600',
    },
    deleteButton: {
      padding: spacing.xs,
      marginLeft: spacing.xs,
    },
    deleteText: {
      fontSize: 20,
      color: currentColors.textSecondary,
      fontWeight: '300',
    },
    addButton: {
      marginTop: spacing.sm,
      padding: spacing.md,
      backgroundColor: currentColors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: currentColors.borderLight,
      alignItems: 'center',
      borderStyle: 'dashed',
    },
    addButtonText: {
      ...typography.body,
      color: currentColors.primary,
      fontWeight: '600',
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
        <Text style={styles.title}>Full Breakdown</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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
                You can edit the benefits below to match your actual paycheck.
              </Text>
            </Card.Content>
          </Card>

          <BreakdownSection
            label="Gross Pay"
            amount={breakdown.grossPay}
            description="Your total pay before deductions"
            variant="grossPay"
          />

          <View style={styles.taxSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Estimated Taxes</Text>
              <Text style={styles.statValue}>Total: {formatCurrency(breakdown.taxes.total)}</Text>
            </View>
            <BreakdownSection
              label="Federal Tax"
              amount={breakdown.taxes.federal}
              description="Progressive brackets (10-37%)"
            />
            <BreakdownSection
              label="State Tax"
              amount={breakdown.taxes.state}
              description={userData?.salary?.state ? `State rate for ${userData.salary.state}` : "State income tax"}
            />
            <BreakdownSection
              label="FICA"
              amount={breakdown.taxes.fica}
              description="Social Security & Medicare (7.65%)"
            />
          </View>

          <View style={styles.benefitsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Benefits & Deductions</Text>
              <Text style={styles.statValue}>Total: {formatCurrency(breakdown.benefits.total)}</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Estimated at 5% for health and 3% for retirement.
            </Text>

            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                {benefitsList.map((benefit, index) => (
                  <View key={benefit.id} style={{ marginBottom: index < benefitsList.length - 1 ? spacing.md : 0 }}>
                    <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          label="Benefit Name"
                          placeholder="e.g. Health Insurance"
                          mode="outlined"
                          value={benefit.name}
                          onChangeText={(text) => handleUpdateBenefit(benefit.id, 'name', text)}
                          dense
                          multiline={false}
                          numberOfLines={1}
                          style={{ marginBottom: 0 }}
                          textColor={currentColors.text}
                          theme={{ colors: { onSurfaceVariant: currentColors.textSecondary } }}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          label="Amount"
                          mode="outlined"
                          keyboardType="numeric"
                          value={benefit.amount}
                          onChangeText={(text) => {
                            const filteredText = text.replace(/[^0-9.]/g, '');
                            handleUpdateBenefit(benefit.id, 'amount', filteredText);
                          }}
                          left={<TextInput.Affix text="$" />}
                          dense
                          style={{ marginBottom: 0 }}
                          textColor={currentColors.text}
                        />
                      </View>
                      {benefitsList.length > 0 && (
                        <TouchableOpacity
                          onPress={() => handleDeleteBenefit(benefit.id)}
                          style={{ padding: spacing.sm, marginTop: spacing.xs }}
                        >
                          <MaterialCommunityIcons name="delete-outline" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={handleAddBenefit}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: spacing.md,
                    paddingVertical: spacing.sm,
                  }}
                >
                  <MaterialCommunityIcons name="plus-circle-outline" size={20} color={isDark ? '#FFFFFF' : '#000000'} />
                  <Text style={[styles.statLabel, { marginLeft: spacing.xs, color: isDark ? '#FFFFFF' : '#000000', textDecorationLine: 'underline' }]}>
                    Add Benefit
                  </Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </View>

          <BreakdownSection
            label="Take-Home Pay"
            amount={breakdown.takeHomePay}
            description="What you'll actually receive"
            variant="takeHome"
          />

          <Card style={styles.noteContainer}>
            <Card.Content>
              <Text style={styles.noteText}>
                Note: Taxes are estimated. You can adjust the benefit amounts above to match your paystub.
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
