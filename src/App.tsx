import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootStackNavigator from './navigation/RootStackNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStackNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
