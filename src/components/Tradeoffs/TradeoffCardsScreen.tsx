import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Footer } from '../shared/Footer';
import { TradeoffCard } from './TradeoffCard';
import { getPlaceholderTradeoffs } from '../../utils/placeholders';
import { generateTradeoffs } from '../../services/replit/ai';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { TradeoffCard as TradeoffCardType } from '../../types/tradeoff';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const SWIPE_THRESHOLD = 50;

interface TradeoffCardsScreenProps {
  onBack: () => void;
  navigation?: any;
}

export function TradeoffCardsScreen({ onBack, navigation }: TradeoffCardsScreenProps) {
  const { userData } = useUser();
  const { currentColors, isDark } = useTheme();
  const [cards, setCards] = useState<TradeoffCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

  // Animate card transition
  const animateCardTransition = (direction: 'next' | 'prev', newIndex: number) => {
    // Slide out current card
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: direction === 'next' ? -SCREEN_WIDTH : SCREEN_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Update index after slide out completes
      setCurrentIndex(newIndex);
      
      // Reset position for slide in
      translateX.setValue(direction === 'next' ? SCREEN_WIDTH : -SCREEN_WIDTH);
      opacity.setValue(0);
      
      // Slide in new card
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      animateCardTransition('next', currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      animateCardTransition('prev', currentIndex - 1);
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500;

      if (swipeThreshold) {
        if (translationX > 0 && currentIndex > 0) {
          // Swipe right - go to previous
          handlePrevious();
        } else if (translationX < 0 && currentIndex < cards.length - 1) {
          // Swipe left - go to next
          handleNext();
        } else {
          // Reset position if swipe didn't trigger navigation
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      } else {
        // Reset position if swipe wasn't strong enough
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }
    }
  };

  // Reset animation values when index changes externally
  useEffect(() => {
    translateX.setValue(0);
    opacity.setValue(1);
  }, [currentIndex]);

  const cardStyle = {
    transform: [{ translateX }],
    opacity,
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
      ...typography.h4,
      color: currentColors.text,
      fontWeight: '700',
      flex: 1,
      textAlign: 'center',
    },
    counter: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
      width: 60,
      textAlign: 'right',
    },
    gestureContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      flexGrow: 1,
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.lg,
      gap: spacing.md,
    },
    navButton: {
      flex: 1,
      borderRadius: 36,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    navButtonDisabled: {
      opacity: 0.5,
    },
    navButtonContent: {
      paddingVertical: spacing.sm,
    },
    navButtonLabel: {
      ...typography.button,
      fontSize: 20,
    },
    footer: {
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    footerText: {
      ...typography.caption,
      color: currentColors.textTertiary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    loadingIcon: {
      fontSize: 48,
      marginBottom: spacing.md,
    },
    loadingText: {
      ...typography.h3,
      color: currentColors.text,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    loadingSubtext: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
    },
    footerIconContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What Ifs</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>💭</Text>
          <Text style={styles.loadingText}>Generating personalized tradeoffs...</Text>
          <Text style={styles.loadingSubtext}>This will just take a moment</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What Ifs</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>😕</Text>
          <Text style={styles.loadingText}>No tradeoffs available</Text>
          <Text style={styles.loadingSubtext}>Please complete onboarding first</Text>
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
        <Text style={styles.title}>What Ifs</Text>
        <Text style={styles.counter}>
          {currentIndex + 1} of {cards.length}
        </Text>
      </View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View style={styles.gestureContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            <Animated.View style={cardStyle}>
              <TradeoffCard
                title={currentCard.title}
                optionA={currentCard.optionA}
                optionB={currentCard.optionB}
              />
            </Animated.View>
            <View style={styles.navigationContainer}>
              <Button
                mode="contained"
                onPress={handlePrevious}
                disabled={currentIndex === 0}
                buttonColor={isDark ? '#E5E5E5' : '#000000'}
                textColor={isDark ? '#000000' : '#FFFFFF'}
                style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                contentStyle={styles.navButtonContent}
                labelStyle={styles.navButtonLabel}
              >
                ← Previous
              </Button>
              <Button
                mode="contained"
                onPress={handleNext}
                disabled={currentIndex === cards.length - 1}
                buttonColor={isDark ? '#E5E5E5' : '#000000'}
                textColor={isDark ? '#000000' : '#FFFFFF'}
                style={[styles.navButton, currentIndex === cards.length - 1 && styles.navButtonDisabled]}
                contentStyle={styles.navButtonContent}
                labelStyle={styles.navButtonLabel}
              >
                Next →
              </Button>
            </View>
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
      <SafeAreaView edges={['bottom']} style={styles.footerIconContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
