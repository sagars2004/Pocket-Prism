import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Animated, Platform, Dimensions, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeScreenProps {
  onNext: () => void;
  navigation?: any;
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

export function WelcomeScreen({ onNext, navigation }: WelcomeScreenProps) {
  const { currentColors, isDark } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  
  // Entrance animations for text elements
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Track if logo animation is running to prevent duplicate starts
  const logoAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // Track intro sequence state (4 seconds of logo only)
  const [showIntro, setShowIntro] = useState(true);
  
  // Create bubbles - small circular particles that drift left with random spawning
  // Bubbles appear strictly above the title and below all text content
  const [bubbles] = useState<Bubble[]>(() => {
    const topBubbleCount = 70; // Bubbles above the title
    const bottomBubbleCount = 40; // Bubbles below all content
    const totalCount = topBubbleCount + bottomBubbleCount;
    const bubblesArray: Bubble[] = [];
    const baseDuration = 8000; // Base duration for consistent speed
    const minDuration = 6000; // Minimum duration (faster bubbles)
    const maxDuration = 12000; // Maximum duration (slower bubbles)
    
    // Define zones - title starts around 30-35% of screen (adjust based on layout)
    const titleTopZone = SCREEN_HEIGHT * 0.30; // Everything below this is title/content
    const contentBottomZone = SCREEN_HEIGHT * 0.60; // Everything below this is safe for bubbles
    
    // Create bubbles in the top area (strictly above title: 0% to titleTopZone)
    for (let i = 0; i < topBubbleCount; i++) {
      // Space out bubbles across a wide range on the right side
      const spreadWidth = SCREEN_WIDTH * 3;
      const initialX = SCREEN_WIDTH + 20 + (i / topBubbleCount) * spreadWidth;
      
      // Y position in top area only (strictly above title)
      const minY = SCREEN_HEIGHT * 0.0; // Start from very top
      const maxY = titleTopZone; // Up to where title starts
      const startY = minY + Math.random() * (maxY - minY);
      
      // Random size: 4-8 pixels
      const size = Math.random() * 4 + 4;
      
      // Random duration for varied speeds
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      
      // Calculate delay based on position to ensure continuous flow
      const distanceToScreen = initialX - SCREEN_WIDTH - 20;
      const averageSpeed = SCREEN_WIDTH / baseDuration;
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
    
    // Create bubbles in the bottom area (below all content)
    for (let i = topBubbleCount; i < totalCount; i++) {
      const bottomBubbleIndex = i - topBubbleCount;
      // Space out bubbles across a wide range on the right side
      const spreadWidth = SCREEN_WIDTH * 3;
      const initialX = SCREEN_WIDTH + 20 + (bottomBubbleIndex / bottomBubbleCount) * spreadWidth;
      
      // Y position in bottom area only (below all text/features)
      const minY = contentBottomZone; // Start from below content area
      const maxY = SCREEN_HEIGHT * 0.85; // Up to 85% down (leaving some space for button)
      const startY = minY + Math.random() * (maxY - minY);
      
      // Random size: 4-8 pixels
      const size = Math.random() * 4 + 4;
      
      // Random duration for varied speeds
      const duration = minDuration + Math.random() * (maxDuration - minDuration);
      
      // Calculate delay based on position to ensure continuous flow
      const distanceToScreen = initialX - SCREEN_WIDTH - 20;
      const averageSpeed = SCREEN_WIDTH / baseDuration;
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
    // Reset intro state when component mounts/navigates back
    setShowIntro(true);
    
    // Reset animation values when component mounts/remounts
    translateY.setValue(0);
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    
    // Start intro timer: show only logo for 4 seconds
    let introTimer: NodeJS.Timeout | null = null;
    introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000);
    
    // Create a continuous floating/bobbing animation with sinusoidal motion
    // Using easing to approximate smooth sine wave movement
    const createFloatAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          // Move up smoothly (approximates sine wave from 0 to π/2)
          Animated.timing(translateY, {
            toValue: -12, // Move up 12 pixels
            duration: 1000, // 1 second for faster upward motion
            useNativeDriver: true,
          }),
          // Move back down smoothly (approximates sine wave from π/2 to π)
          Animated.timing(translateY, {
            toValue: 0, // Move back to center
            duration: 1000, // 1 second for faster downward motion
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Stop any existing animation before starting a new one
    if (logoAnimationRef.current) {
      logoAnimationRef.current.stop();
    }
    
    const logoAnimation = createFloatAnimation();
    logoAnimation.start();
    logoAnimationRef.current = logoAnimation;

    // Entrance animations for text
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate bubbles drifting left with continuous scrolling
    const bubbleAnimations = bubbles.map((bubble: Bubble) => {
      // Calculate when bubble should disappear (when rightmost point goes off left edge)
      // Rightmost point = translateX + bubble.size/2
      // We want bubbles to flow all the way to the left edge and beyond
      // Set disappearX so the rightmost point reaches -bubble.size/2 (fully off screen)
      // So: translateX + bubble.size/2 = -bubble.size/2
      // Therefore: translateX = -bubble.size
      const disappearX = -bubble.size;
      
      // Start position on right side (rightmost point at right edge + padding)
      // Rightmost point = SCREEN_WIDTH + padding, so translateX = SCREEN_WIDTH + padding - bubble.size/2
      const padding = 20;
      const startX = SCREEN_WIDTH + padding - bubble.size / 2;
      
      // Distance to travel (from initial position to disappear position)
      const travelDistance = bubble.initialX - disappearX;
      
      // Calculate constant speed (pixels per millisecond)
      const speed = SCREEN_WIDTH / bubble.duration; // pixels per ms
      
      // Duration for first segment based on actual distance
      const firstSegmentDuration = travelDistance / speed;
      
      // Create seamless continuous loop with constant speed
      const createContinuousAnimation = () => {
        return Animated.loop(
          Animated.sequence([
            // Move from initial position to disappear position (leftmost reaches left edge)
            Animated.timing(bubble.startX, {
              toValue: disappearX,
              duration: firstSegmentDuration,
              easing: Easing.linear, // Constant speed, no easing
              useNativeDriver: true,
            }),
            // Instantly reset to right side (position leftmost at right edge)
            Animated.timing(bubble.startX, {
              toValue: startX,
              duration: 0,
              useNativeDriver: true,
            }),
            // Continue moving left from right edge to maintain continuous flow
            // Full screen width + bubble size distance at constant speed
            Animated.timing(bubble.startX, {
              toValue: disappearX,
              duration: bubble.duration,
              easing: Easing.linear, // Constant speed, no easing
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
      if (introTimer) {
        clearTimeout(introTimer);
      }
      if (logoAnimationRef.current) {
        logoAnimationRef.current.stop();
        logoAnimationRef.current = null;
      }
      bubbleAnimations.forEach((anim: Animated.CompositeAnimation) => anim.stop());
    };
  }, [translateY, bubbles, fadeAnim, slideAnim, isDark]); // Add isDark to dependencies to restart on theme change

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: spacing.lg,
    },
    introContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentColors.background,
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
      left: -20, // Allow bubbles to flow beyond the left edge
      right: 0,
      bottom: 0,
      width: SCREEN_WIDTH + 40, // Extend container to allow bubbles to flow off edge
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
      minHeight: 150, // Ensure container always has space
    },
    logoWrapper: {
      width: 150,
      height: 150,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative', // Ensure wrapper maintains space
    },
    logo: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      position: 'absolute', // Ensure logo always renders
    },
    textContainer: {
      alignItems: 'center',
      width: '100%',
    },
    title: {
      ...typography.h1,
      color: currentColors.text,
      textAlign: 'center',
      marginBottom: spacing.md,
      fontWeight: '800',
    },
    subtitle: {
      ...typography.bodyLarge,
      color: currentColors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.md,
      lineHeight: 28,
      fontWeight: '500',
    },
    featuresContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.xl,
      marginTop: spacing.md,
    },
    feature: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: spacing.sm,
    },
    featureText: {
      ...typography.bodySmall,
      color: currentColors.text,
      marginTop: spacing.sm,
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    description: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
      paddingHorizontal: spacing.md,
      fontStyle: 'italic',
      marginTop: spacing.sm,
    },
    buttonContainer: {
      paddingVertical: spacing.lg,
      flexDirection: 'row',
      gap: spacing.md,
    },
    button: {
      flex: 1,
    },
    buttonContent: {
      paddingVertical: spacing.sm,
    },
    buttonLabel: {
      ...typography.button,
      fontSize: 18,
      fontWeight: '700',
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
            key={`logo-${isDark}`} // Force re-render on theme change
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
                onError={(error) => {
                  console.error('Logo image failed to load:', error);
                }}
                onLoad={() => {
                  // Ensure logo is visible after load
                }}
              />
            </View>
          </Animated.View>
          
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Welcome to Finsh</Text>
            <Text style={styles.subtitle}>
              Understand your paycheck before it's in the bank, plan out where your money might go, and make smarter decisions from day one.
            </Text>
            
            {/* Feature highlights */}
            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="calculator-variant"
                  size={32}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
                <Text style={styles.featureText}>Paycheck Breakdown</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="swap-horizontal"
                  size={32}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
                <Text style={styles.featureText}>Smart Trade-offs</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="chart-line"
                  size={32}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
                <Text style={styles.featureText}>Planning Insight</Text>
              </View>
            </View>
            
            <Text style={styles.description}>
              Curate your personal Finsh tank and make your financial currents flow effortlessly!
            </Text>
          </Animated.View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={onNext}
            buttonColor={isDark ? '#E5E5E5' : '#000000'}
            textColor={isDark ? '#000000' : '#FFFFFF'}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation?.navigate('Tutorial')}
            buttonColor="transparent"
            textColor={isDark ? '#E5E5E5' : '#000000'}
            style={[styles.button, { borderColor: isDark ? '#E5E5E5' : '#000000', borderWidth: 2 }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Learn More
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
