import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import { useAppStore } from '../stores/appStore';
import type { RootStackParamList } from '../types';

import RootTabNavigator from './RootTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={RootTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
