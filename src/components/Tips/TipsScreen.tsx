import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { Footer } from '../shared/Footer';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TipsScreenProps {
    onBack: () => void;
    navigation?: any;
}

export function TipsScreen({ onBack, navigation }: TipsScreenProps) {
    const { currentColors, isDark } = useTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: currentColors.background,
        },
        header: {
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: currentColors.borderLight,
            backgroundColor: currentColors.background,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            fontWeight: '700',
        },
        scrollContent: {
            padding: spacing.md,
            paddingBottom: spacing.xxl,
        },
        headlineContainer: {
            marginBottom: spacing.lg,
            padding: spacing.md,
            backgroundColor: currentColors.textSecondary, // Dark Grey
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#444444',
        },
        headlineText: {
            ...typography.body,
            fontSize: 16,
            lineHeight: 24,
            color: isDark ? '#000' : '#FFFFFF', // White text for dark BG
            fontStyle: 'italic',
            textAlign: 'center',
        },
        stepCard: {
            marginBottom: spacing.lg,
            backgroundColor: currentColors.surface, // Light Grey for both modes
            borderRadius: 27,
            borderWidth: 3,
            borderColor: currentColors.borderLight,
            // Shadow
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5,
        },
        cardContent: {
            padding: spacing.md,
        },
        stepHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing.sm,
        },
        iconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(33, 150, 243, 0.1)', // Keep it subtle, or adapt
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
        },
        stepTitle: {
            ...typography.h4,
            color: currentColors.text, // Dark text for light BG
            fontSize: 18,
            fontWeight: '700',
        },
        stepSubtitle: {
            ...typography.bodySmall,
            color: currentColors.textSecondary, // Dark grey for subtitle
        },
        divider: {
            height: 1,
            backgroundColor: currentColors.borderLight, // Light divider
            marginVertical: spacing.md,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: spacing.xs,
        },
        bullet: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: currentColors.primary,
            marginTop: 8,
            marginRight: spacing.sm,
        },
        detailText: {
            ...typography.body,
            color: currentColors.textSecondary, // Dark text
            flex: 1,
        },
        microcopy: {
            ...typography.caption,
            color: currentColors.primary,
            marginTop: spacing.sm,
            fontStyle: 'italic',
            fontWeight: '600',
        },
        connectorLine: {
            position: 'absolute',
            left: 40,
            top: -20,
            bottom: -20,
            width: 2,
            backgroundColor: currentColors.borderLight,
            zIndex: -1,
        },
        placeholder: {
            width: 60,
        },
        footerContainer: {
            backgroundColor: currentColors.surface,
        },
    });

    const steps = [
        {
            id: 1,
            icon: 'cash-fast',
            title: 'Your Paycheck Arrives',
            subtitle: 'Net income after taxes and deductions',
            details: ['Wait for direct deposit to hit', 'Check for accuracy'],
            microcopy: '',
            color: '#2196F3'
        },
        {
            id: 2,
            icon: 'shield-check-outline',
            title: 'Cover Minimums',
            subtitle: 'Minimum Obligations Gate',
            details: ['Credit cards', 'Student loans', 'Auto loans'],
            microcopy: 'Keeping this funded prevents financial leaks.',
            color: '#FF9800'
        },
        {
            id: 3,
            icon: 'basket-outline',
            title: 'Fund Monthly Life',
            subtitle: 'Monthly Essentials Pool',
            details: ['Rent / Mortgage', 'Utilities', 'Groceries', 'Transport'],
            microcopy: 'Fill your monthly tank to 100% first.',
            color: '#4CAF50'
        },
        {
            id: 4,
            icon: 'lifebuoy', // or shield-outline
            title: 'Emergency Fund',
            subtitle: 'Safety Reservoir',
            details: ['Target: 3-6 months of essentials', 'Keep in High Yield Savings (HYSA)'],
            microcopy: 'This is your financial oxygen tank.',
            color: '#F44336'
        },
        {
            id: 5,
            icon: 'chart-line-variant',
            title: 'Future You (401k / IRA)',
            subtitle: 'Retirement Stream',
            details: ['Get your employer match!', 'Aim for 10-15% total contribution'],
            microcopy: 'Remember, time is your strongest current.',
            color: '#9C27B0'
        },
        {
            id: 6,
            icon: 'water-off', // Drain concept
            title: 'Eliminate High-Interest Debt',
            subtitle: 'Plug the Drain',
            details: ['Prioritize debts > 15% APR', 'Pay extra to clear faster'],
            microcopy: 'Stop paying for yesterday.',
            color: '#795548'
        },
        {
            id: 7,
            icon: 'sprout-outline',
            title: 'Grow Beyond the Basics',
            subtitle: 'Growth Channels',
            details: ['Roth IRA', 'Brokerage Investing', 'Side Income'],
            microcopy: 'Let your money work for you.',
            color: '#00BCD4'
        }
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Quick Tips</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.headlineContainer}>
                    <Text style={styles.headlineText}>
                        Everything seems to cost ~30% more than it did a few years ago, with higher inflation numbers and lower high-yield interest rates.
                        Follow these steps to properly manage the flow of your money in 2026 and beyond.
                    </Text>
                </View>

                {steps.map((step, index) => (
                    <View key={step.id}>
                        {/* Connector Line (except for last item) */}
                        {index < steps.length - 1 && (
                            <View style={[styles.connectorLine, { height: '100%', top: 50, left: 40 + 16 }]} />
                            // This positioning is tricky without absolute layout relative to parent. 
                            // Visual simplified: Just vertical margin implies flow. 
                            // Or we add a line view between cards.
                        )}

                        {/* Connector Line Attempt */}
                        {index < steps.length - 1 && (
                            <View style={{
                                position: 'absolute',
                                left: 39,
                                top: 60,
                                bottom: -30,
                                width: 2,
                                backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                                zIndex: -1
                            }} />
                        )}

                        <Card style={styles.stepCard}>
                            <View style={styles.cardContent}>
                                <View style={styles.stepHeader}>
                                    <View style={[styles.iconContainer, { backgroundColor: isDark ? `${step.color}30` : `${step.color}20` }]}>
                                        <MaterialCommunityIcons name={step.icon as any} size={28} color={step.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                        <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
                                    </View>
                                </View>

                                {(step.details.length > 0 || step.microcopy) && <View style={styles.divider} />}

                                {step.details.map((detail, i) => (
                                    <View key={i} style={styles.detailRow}>
                                        <View style={[styles.bullet, { backgroundColor: step.color }]} />
                                        <Text style={styles.detailText}>{detail}</Text>
                                    </View>
                                ))}

                                {step.microcopy ? (
                                    <Text style={[styles.microcopy, { color: step.color }]}>{step.microcopy}</Text>
                                ) : null}
                            </View>
                        </Card>
                    </View>
                ))}

            </ScrollView>

            <SafeAreaView edges={['bottom']} style={styles.footerContainer}>
                <Footer navigation={navigation} />
            </SafeAreaView>
        </SafeAreaView>
    );
}
