import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import type { RootTabParamList } from '../types';

import MatchesStackNavigator from './MatchesStackNavigator';
import TeamsStackNavigator from './TeamsStackNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Teams" component={TeamsStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen
        name="Matches"
        component={MatchesStackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
