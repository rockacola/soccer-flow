import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';

import { colors } from './constants/theme';
import RootStackNavigator from './navigation/RootStackNavigator';

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.separator,
  },
};

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer theme={navigationTheme}>
        <RootStackNavigator />
      </NavigationContainer>
    </>
  );
}
