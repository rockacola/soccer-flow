import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';

import { useOnboardingScreen } from './useOnboardingScreen';

export default function OnboardingScreen() {
  const { onLoadSampleData, onSkip } = useOnboardingScreen();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SoccerFlow</Text>
        <Text style={styles.description}>
          Track your team's matches in real time. Log goals, substitutions, and remarks as they
          happen — then review the full match history afterward.
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onLoadSampleData}
          accessibilityRole="button"
          accessibilityLabel="Load sample data and explore the app"
        >
          <Text style={styles.primaryButtonLabel}>See Sample Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip and start with an empty app"
        >
          <Text style={styles.secondaryButtonLabel}>Start Fresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    paddingBottom: 52,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: typeScale.xxxl,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  description: {
    fontSize: typeScale.title,
    fontFamily: fonts.regular,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    fontSize: typeScale.title,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
});
