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

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
