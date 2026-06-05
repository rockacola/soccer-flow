import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchesListScreen() {
  return (
    <View style={styles.container}>
      <Text>Matches</Text>
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
