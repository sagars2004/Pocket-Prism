import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { UserProvider } from './src/context/UserContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { paperTheme } from './src/theme/paperTheme';
import { MD3DarkTheme } from 'react-native-paper';
import { colorsDark } from './src/theme/colorsDark';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://6d42ca31b888c55bd4de51790edd628e@o4510789745704960.ingest.us.sentry.io/4510789764644864',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

// Create dark theme for Paper
const darkPaperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colorsDark.primary,
    primaryContainer: colorsDark.primaryLight,
    secondary: colorsDark.accent,
    surface: colorsDark.surface,
    surfaceVariant: colorsDark.surfaceSecondary,
    background: colorsDark.background,
    error: colorsDark.error,
    onPrimary: colorsDark.surface,
    onSurface: colorsDark.text,
    onSurfaceVariant: colorsDark.textSecondary,
    onBackground: colorsDark.text,
    outline: colorsDark.border,
    outlineVariant: colorsDark.borderLight,
  },
  roundness: 8,
};

function ThemedApp() {
  const { isDark } = useTheme();
  const currentPaperTheme = isDark ? darkPaperTheme : paperTheme;

  return (
    <PaperProvider theme={currentPaperTheme}>
      <UserProvider>
        <OnboardingProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <AppNavigator />
        </OnboardingProvider>
      </UserProvider>
    </PaperProvider>
  );
}

export default Sentry.wrap(function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
});