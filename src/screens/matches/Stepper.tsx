import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';

type Props = {
  label: string;
  value: number;
  onAdjust: (delta: number) => void;
};

export default function Stepper({ label, value, onAdjust }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAdjust(-5)}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label.toLowerCase()} by 5 minutes`}
        >
          <Text style={styles.buttonText}>−5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAdjust(-1)}
          accessibilityRole="button"
          accessibilityLabel={`Decrease ${label.toLowerCase()} by 1 minute`}
        >
          <Text style={styles.buttonText}>−1</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value} min</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAdjust(1)}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label.toLowerCase()} by 1 minute`}
        >
          <Text style={styles.buttonText}>+1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onAdjust(5)}
          accessibilityRole="button"
          accessibilityLabel={`Increase ${label.toLowerCase()} by 5 minutes`}
        >
          <Text style={styles.buttonText}>+5</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: spacing.md,
    padding: spacing.lg,
  },
  label: {
    fontSize: typeScale.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: typeScale.md,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  value: {
    fontSize: typeScale.title,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 64,
    textAlign: 'center',
  },
});
