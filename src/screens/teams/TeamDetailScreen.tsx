import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TeamDetailScreen() {
  return (
    <View style={styles.container}>
      <Text>Team Detail</Text>
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
