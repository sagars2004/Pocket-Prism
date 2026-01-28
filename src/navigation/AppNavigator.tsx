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
import { SettingsScreen } from '../components/Settings/SettingsScreen';
import { PlanScreen } from '../components/Plan/PlanScreen';
import { TutorialScreen } from '../components/Onboarding/TutorialScreen';
import { useUser } from '../context/UserContext';
import { TipsScreen } from '../components/Tips/TipsScreen';


export type RootStackParamList = {
  Welcome: undefined;
  Tutorial: undefined;
  SalaryInfo: undefined;
  Context: undefined;
  Confirmation: undefined;
  Dashboard: undefined;
  Tradeoffs: undefined;
  Breakdown: undefined;
  Settings: undefined;
  Plan: undefined;
  Tips: undefined;

};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { userData, isLoading } = useUser();

  // Determine initial route based on onboarding status
  const onboardingComplete = userData?.onboardingComplete === true;

  const initialRoute: keyof RootStackParamList =
    onboardingComplete ? 'Dashboard' :
      'Welcome';

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
              navigation={props.navigation}
              onNext={() => props.navigation.navigate('SalaryInfo')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tutorial">
          {(props) => (
            <TutorialScreen
              {...props}
              navigation={props.navigation}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="SalaryInfo">
          {(props) => (
            <SalaryInfoScreen
              {...props}
              navigation={props.navigation}
              onNext={() => props.navigation.navigate('Context')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Context">
          {(props) => (
            <ContextScreen
              {...props}
              navigation={props.navigation}
              onNext={() => props.navigation.navigate('Confirmation')}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Confirmation">
          {(props) => (
            <ConfirmationScreen
              {...props}
              navigation={props.navigation}
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
              navigation={props.navigation}
              onViewTradeoffs={() => props.navigation.navigate('Tradeoffs')}
              onViewBreakdown={() => props.navigation.navigate('Breakdown')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tradeoffs">
          {(props) => (
            <TradeoffCardsScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Breakdown">
          {(props) => (
            <BreakdownScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Settings">
          {(props) => (
            <SettingsScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
              onNavigateToHome={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                });
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Plan">
          {(props) => (
            <PlanScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
              onNavigateToHome={() => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Dashboard' }],
                });
              }}
              onNavigateToSettings={() => props.navigation.navigate('Settings')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Tips">
          {(props) => (
            <TipsScreen
              {...props}
              navigation={props.navigation}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
