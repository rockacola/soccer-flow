import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ScreenBackground from '../../components/ScreenBackground';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';

import { useSettingsScreen } from './useSettingsScreen';

export default function SettingsScreen() {
  const { hasSampleData, onToggleSampleData, onResetAll } = useSettingsScreen();

  return (
    <ScreenBackground variant="settings">
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: typeScale.sm,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.xl,
  },
  row: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  rowLabel: {
    fontSize: typeScale.input,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  destructiveLabel: {
    color: colors.destructive,
  },
});
