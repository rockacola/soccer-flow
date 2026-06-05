import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchSetupScreen() {
  return (
    <View style={styles.container}>
      <Text>Match Setup</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
