import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchLiveScreen() {
  return (
    <View style={styles.container}>
      <Text>Match Live</Text>
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
