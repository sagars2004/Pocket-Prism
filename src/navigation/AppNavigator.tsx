import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../components/Onboarding/WelcomeScreen';
import { SalaryInfoScreen } from '../components/Onboarding/SalaryInfoScreen';
import { ContextScreen } from '../components/Onboarding/ContextScreen';
import { ConfirmationScreen } from '../components/Onboarding/ConfirmationScreen';
import { DashboardScreen } from '../components/Dashboard/DashboardScreen';
import { TradeoffCardsScreen } from '../components/Tradeoffs/TradeoffCardsScreen';
import { BreakdownScreen } from '../components/PaycheckBreakdown/BreakdownScreen';
import { useUser } from '../context/UserContext';

export type RootStackParamList = {
  Welcome: undefined;
  SalaryInfo: undefined;
  Context: undefined;
  Confirmation: undefined;
  Dashboard: undefined;
  Tradeoffs: undefined;
  Breakdown: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { userData, isLoading } = useUser();

  // Start with Welcome - userData loads asynchronously
  // Navigation will handle routing to Dashboard if user has completed onboarding
  // Ensure onboardingComplete is properly converted to boolean
  const onboardingComplete = userData?.onboardingComplete === true;
  const initialRoute: keyof RootStackParamList = onboardingComplete ? 'Dashboard' : 'Welcome';

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F9FA' },
        }}
      >
        <Stack.Screen name="Welcome">
          {(props) => (
            <WelcomeScreen
              {...props}
              onNext={() => props.navigation.navigate('SalaryInfo')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SalaryInfo">
          {(props) => (
            <SalaryInfoScreen
              {...props}
              onNext={() => props.navigation.navigate('Context')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Context">
          {(props) => (
            <ContextScreen
              {...props}
              onNext={() => props.navigation.navigate('Confirmation')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Confirmation">
          {(props) => (
            <ConfirmationScreen
              {...props}
              onComplete={() => props.navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              })}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Dashboard">
          {(props) => (
            <DashboardScreen
              {...props}
              onViewTradeoffs={() => props.navigation.navigate('Tradeoffs')}
              onViewBreakdown={() => props.navigation.navigate('Breakdown')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tradeoffs">
          {(props) => (
            <TradeoffCardsScreen
              {...props}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Breakdown">
          {(props) => (
            <BreakdownScreen
              {...props}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
