import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import SettingsScreen from '../screens/settings/SettingsScreen';
import type { SettingsStackParamList } from '../types';

import SettingsHeaderTitle from './SettingsHeaderTitle';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsList"
        component={SettingsScreen}
        options={{ headerTitle: () => <SettingsHeaderTitle /> }}
      />
    </Stack.Navigator>
  );
}
