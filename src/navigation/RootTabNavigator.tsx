import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, type PressableProps } from 'react-native';

import type { RootTabParamList } from '../types';

import MatchesStackNavigator from './MatchesStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import TeamsStackNavigator from './TeamsStackNavigator';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function RootTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Teams"
        component={TeamsStackNavigator}
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable {...(props as unknown as PressableProps)} testID="tab-teams" />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              navigation.navigate('Teams', { screen: 'TeamsList' });
            }
          },
        })}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesStackNavigator}
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable {...(props as unknown as PressableProps)} testID="tab-matches" />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="scoreboard-outline" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              navigation.navigate('Matches', { screen: 'MatchesList' });
            }
          },
        })}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable {...(props as unknown as PressableProps)} testID="tab-settings" />
          ),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
