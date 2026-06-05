import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootTabNavigator from './navigation/RootTabNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootTabNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
