import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../constants/theme';

import { useSettingsScreen } from './useSettingsScreen';

export default function SettingsScreen() {
  const { hasSampleData, onToggleSampleData, onResetAll } = useSettingsScreen();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SAMPLE DATA</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={onToggleSampleData}
          accessibilityRole="button"
          accessibilityLabel={hasSampleData ? 'Remove sample data' : 'Load sample data'}
        >
          <Text style={styles.rowLabel}>
            {hasSampleData ? 'Remove Sample Data' : 'Load Sample Data'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>DANGER ZONE</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={onResetAll}
          accessibilityRole="button"
          accessibilityLabel="Reset all data"
        >
          <Text style={[styles.rowLabel, styles.destructiveLabel]}>Reset All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  row: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  rowLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  destructiveLabel: {
    color: colors.destructive,
  },
});
