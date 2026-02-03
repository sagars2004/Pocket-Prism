import 'react-native-gesture-handler';
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
// import * as Sentry from '@sentry/react-native';

// Sentry.init({
//   dsn: 'https://6d42ca31b888c55bd4de51790edd628e@o4510789745704960.ingest.us.sentry.io/4510789764644864',
//   sendDefaultPii: true,
//   enableLogs: true,
// });

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

import { ErrorBoundary } from './src/components/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);

        // Artificial delay for smooth splash screen effect (optional)
        // await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}