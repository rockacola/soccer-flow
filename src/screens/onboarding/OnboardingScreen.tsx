import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../constants/theme';

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
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: colors.textSecondary,
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonLabel: {
    fontSize: 17,
    color: colors.textSecondary,
  },
});
