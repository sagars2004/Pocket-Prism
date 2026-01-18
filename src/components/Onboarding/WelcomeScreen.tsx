import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeScreenProps {
  onNext: () => void;
}

interface Bubble {
  id: number;
  size: number;
  startX: Animated.Value;
  initialX: number; // Store initial X position for calculations
  startY: number;
  duration: number;
  delay: number;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const { currentColors, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Create bubbles - small circular particles that drift left with random spawning
  const [bubbles] = useState<Bubble[]>(() => {
    const bubbleCount = 60; // General bubbles across the screen
    const topBubbleCount = 30; // Additional bubbles in top quarter
    const totalCount = bubbleCount + topBubbleCount;
    const bubblesArray: Bubble[] = [];
    const baseDuration = 8000; // Base duration for consistent speed
    const minDuration = 6000; // Minimum duration (faster bubbles)
    const maxDuration = 12000; // Maximum duration (slower bubbles)
    
    // Create general bubbles distributed across the screen
    for (let i = 0; i < bubbleCount; i++) {
      // Space out bubbles across a wide range on the right side to avoid clustering
      // Spread them across 3 screen widths worth of space
      const spreadWidth = SCREEN_WIDTH * 3;
      const initialX = SCREEN_WIDTH + 20 + (i / bubbleCount) * spreadWidth;
      
      // Random Y position across the visible content area
      const minY = SCREEN_HEIGHT * 0.1; // Start from 10% down
      const maxY = SCREEN_HEIGHT * 0.8; // Up to 80% down
      const startY = minY + Math.random() * (maxY - minY);
      
      // Random size: 4-8 pixels (larger)
      const size = Math.random() * 4 + 4;
      
      // Random duration for varied speeds
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      
      // Calculate delay based on position to ensure continuous flow
      // Bubbles further back should start earlier so they arrive continuously
      const distanceToScreen = initialX - SCREEN_WIDTH - 20;
      const averageSpeed = SCREEN_WIDTH / baseDuration; // pixels per millisecond
      const delay = Math.max(0, distanceToScreen / averageSpeed);
      
      bubblesArray.push({
        id: i,
        size,
        startX: new Animated.Value(initialX),
        initialX,
        startY,
        duration,
        delay,
      });
    }
    
    // Create additional bubbles specifically for top quarter of screen
    for (let i = bubbleCount; i < totalCount; i++) {
      const topBubbleIndex = i - bubbleCount;
      // Space out bubbles across a wide range on the right side
      // Spread them across 3 screen widths worth of space
      const spreadWidth = SCREEN_WIDTH * 3;
      const initialX = SCREEN_WIDTH + 20 + (topBubbleIndex / topBubbleCount) * spreadWidth;
      
      // Y position in top quarter (0-25% of screen height)
      const minY = SCREEN_HEIGHT * 0.0; // Start from top
      const maxY = SCREEN_HEIGHT * 0.25; // Top quarter
      const startY = minY + Math.random() * (maxY - minY);
      
      // Random size: 4-8 pixels (larger)
      const size = Math.random() * 4 + 4;
      
      // Random duration for varied speeds
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      
      // Calculate delay based on position to ensure continuous flow
      const distanceToScreen = initialX - SCREEN_WIDTH - 20;
      const averageSpeed = SCREEN_WIDTH / baseDuration; // pixels per millisecond
      const delay = Math.max(0, distanceToScreen / averageSpeed);
      
      bubblesArray.push({
        id: i,
        size,
        startX: new Animated.Value(initialX),
        initialX,
        startY,
        duration,
        delay,
      });
    }
    
    return bubblesArray;
  });

  useEffect(() => {
    // Create a continuous floating/bobbing animation with sinusoidal motion
    // Using easing to approximate smooth sine wave movement
    const createFloatAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          // Move up smoothly (approximates sine wave from 0 to π/2)
          Animated.timing(translateY, {
            toValue: -12, // Move up 12 pixels
            duration: 1600, // 1.6 seconds for smooth upward motion
            useNativeDriver: true,
          }),
          // Move back down smoothly (approximates sine wave from π/2 to π)
          Animated.timing(translateY, {
            toValue: 0, // Move back to center
            duration: 1600, // 1.6 seconds for smooth downward motion
            useNativeDriver: true,
          }),
        ])
      );
    };

    const logoAnimation = createFloatAnimation();
    logoAnimation.start();

    // Animate bubbles drifting left with continuous scrolling
    const bubbleAnimations = bubbles.map((bubble: Bubble) => {
      // Create seamless continuous loop
      const createContinuousAnimation = () => {
        // Calculate duration for first segment (from initial position to left edge)
        const totalDistance = bubble.initialX + 20; // Distance from initial X to left off-screen
        const screenDistance = SCREEN_WIDTH + 40; // Total screen width + margins
        const firstSegmentDuration = (totalDistance / screenDistance) * bubble.duration;
        
        return Animated.loop(
          Animated.sequence([
            // Move from initial position to left off-screen
            Animated.timing(bubble.startX, {
              toValue: -20,
              duration: firstSegmentDuration,
              useNativeDriver: true,
            }),
            // Instantly reset to right side (start of next cycle)
            Animated.timing(bubble.startX, {
              toValue: SCREEN_WIDTH + 20,
              duration: 0,
              useNativeDriver: true,
            }),
            // Continue moving left from right edge to maintain continuous flow
            Animated.timing(bubble.startX, {
              toValue: -20,
              duration: bubble.duration,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Start animation - bubbles that start further back begin moving earlier
      // to create continuous flow without gaps
      const animation = Animated.sequence([
        Animated.delay(bubble.delay),
        createContinuousAnimation(),
      ]);

      return animation;
    });

    // Start all bubble animations
    bubbleAnimations.forEach((anim: Animated.CompositeAnimation) => anim.start());

    return () => {
      logoAnimation.stop();
      bubbleAnimations.forEach((anim: Animated.CompositeAnimation) => anim.stop());
    };
  }, [translateY, bubbles]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    bubbleContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none', // Allow touches to pass through
    },
    bubble: {
      position: 'absolute',
      borderRadius: 50,
      opacity: 0.4, // Lighter opacity for subtle effect
    },
    logoContainer: {
      marginBottom: spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      zIndex: 10, // Ensure logo is above bubbles
    },
    logoWrapper: {
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logo: {
      width: 150,
      height: 150,
      alignSelf: 'center',
    },
    title: {
      ...typography.h1,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subtitle: {
      ...typography.bodyLarge,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.md,
      lineHeight: 26,
    },
    description: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
      marginTop: spacing.lg,
    },
    buttonContainer: {
      paddingVertical: spacing.lg,
    },
    button: {
      width: '100%',
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    buttonLabel: {
      ...typography.button,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Bubble particles background */}
          <View style={styles.bubbleContainer}>
            {bubbles.map((bubble: Bubble) => (
              <Animated.View
                key={bubble.id}
                style={[
                  styles.bubble,
                  {
                    width: bubble.size,
                    height: bubble.size,
                    backgroundColor: isDark ? 'rgba(200, 200, 200, 0.5)' : 'rgba(80, 80, 80, 0.5)', // Darker grey in both modes
                    top: bubble.startY,
                    transform: [
                      {
                        translateX: bubble.startX,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
          
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ translateY }],
              },
            ]}
          >
            <View style={styles.logoWrapper}>
              <Image
                source={
                  isDark
                    ? require('../../../assets/finsh_logo_inverted.png')
                    : require('../../../assets/finsh_logo.png')
                }
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          <Text style={styles.title}>Welcome to Finsh</Text>
          <Text style={styles.subtitle}>
            Understand your paycheck before it's in the bank, plan out where your money might go, and make smarter financial decisions from day one.
          </Text>
          <Text style={styles.description}>
            To make this as fluid as possible, let's learn a bit about your situation.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={onNext}
            buttonColor={currentColors.primary}
            textColor={currentColors.surface}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
