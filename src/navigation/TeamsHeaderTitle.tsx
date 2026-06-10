import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

export default function TeamsHeaderTitle() {
  return (
    <View style={styles.headerTitle}>
      <MaterialCommunityIcons name="account-group" size={20} color={colors.textPrimary} />
      <Text style={styles.headerTitleText}>Teams</Text>
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
    color: colors.textPrimary,
  },
});
