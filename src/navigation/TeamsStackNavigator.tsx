import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import TeamDetailScreen from '../screens/teams/TeamDetailScreen';
import TeamsListScreen from '../screens/teams/TeamsListScreen';
import type { TeamsStackParamList } from '../types';

const Stack = createNativeStackNavigator<TeamsStackParamList>();

export default function TeamsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TeamsList" component={TeamsListScreen} options={{ title: 'Teams' }} />
      <Stack.Screen
        name="TeamDetail"
        component={TeamDetailScreen}
        options={{ title: 'Team Detail' }}
      />
    </Stack.Navigator>
  );
}
