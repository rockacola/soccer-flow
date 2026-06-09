import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import MatchDetailScreen from '../screens/matches/MatchDetailScreen';
import MatchesListScreen from '../screens/matches/MatchesListScreen';
import MatchLiveScreen from '../screens/matches/MatchLiveScreen';
import MatchSetupScreen from '../screens/matches/MatchSetupScreen';
import type { MatchesStackParamList } from '../types';

import MatchesHeaderTitle from './MatchesHeaderTitle';

const Stack = createNativeStackNavigator<MatchesStackParamList>();

export default function MatchesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MatchesList"
        component={MatchesListScreen}
        options={{ headerTitle: () => <MatchesHeaderTitle /> }}
      />
      <Stack.Screen name="MatchSetup" component={MatchSetupScreen} />
      <Stack.Screen name="MatchLive" component={MatchLiveScreen} options={{ title: 'Live' }} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} options={{ title: 'Match' }} />
    </Stack.Navigator>
  );
}
