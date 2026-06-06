import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function MatchesHeaderTitle() {
  return (
    <View style={styles.headerTitle}>
      <MaterialCommunityIcons name="scoreboard-outline" size={20} color="#000000" />
      <Text style={styles.headerTitleText}>Matches</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
});
