import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TradeoffCard } from './TradeoffCard';
import { getPlaceholderTradeoffs } from '../../utils/placeholders';
import { generateTradeoffs } from '../../services/replit/ai';
import { useUser } from '../../context/UserContext';
import { TradeoffCard as TradeoffCardType } from '../../types/tradeoff';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface TradeoffCardsScreenProps {
  onBack: () => void;
}

export function TradeoffCardsScreen({ onBack }: TradeoffCardsScreenProps) {
  const { userData } = useUser();
  const [cards, setCards] = useState<TradeoffCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTradeoffs() {
      if (userData) {
        try {
          const tradeoffs = await generateTradeoffs(userData);
          setCards(tradeoffs);
        } catch (error) {
          console.error('Error loading tradeoffs:', error);
          // Fallback to placeholder data
          setCards(getPlaceholderTradeoffs());
        }
      } else {
        // Use placeholder data if no user data
        setCards(getPlaceholderTradeoffs());
      }
      setLoading(false);
    }
    loadTradeoffs();
  }, [userData]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading || cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tradeoffs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>
          {currentIndex + 1} of {cards.length}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TradeoffCard
          title={currentCard.title}
          optionA={currentCard.optionA}
          optionB={currentCard.optionB}
        />
      </ScrollView>
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          style={[styles.navButton, currentIndex === 0 ? styles.navButtonDisabled : null].filter(Boolean)}
        >
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 ? styles.navButtonTextDisabled : null,
            ].filter(Boolean)}
          >
            ← Previous
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === cards.length - 1}
          style={[
            styles.navButton,
            currentIndex === cards.length - 1 ? styles.navButtonDisabled : null,
          ].filter(Boolean)}
        >
          <Text
            style={[
              styles.navButtonText,
              currentIndex === cards.length - 1 ? styles.navButtonTextDisabled : null,
            ].filter(Boolean)}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tradeoffs are based on your salary and expenses
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: colors.primary,
  },
  counter: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  navButton: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: colors.textTertiary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  footerText: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
