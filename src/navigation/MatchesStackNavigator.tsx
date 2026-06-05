import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MatchesListScreen from '../screens/matches/MatchesListScreen';
import MatchLiveScreen from '../screens/matches/MatchLiveScreen';
import MatchSetupScreen from '../screens/matches/MatchSetupScreen';
import type { MatchesStackParamList } from '../types';

const Stack = createNativeStackNavigator<MatchesStackParamList>();

export default function MatchesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MatchesList"
        component={MatchesListScreen}
        options={{ title: 'Matches' }}
      />
      <Stack.Screen
        name="MatchSetup"
        component={MatchSetupScreen}
        options={{ title: 'New Match' }}
      />
      <Stack.Screen name="MatchLive" component={MatchLiveScreen} options={{ title: 'Live' }} />
    </Stack.Navigator>
  );
}
