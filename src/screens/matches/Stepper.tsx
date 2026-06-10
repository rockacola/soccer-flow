import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../../constants/theme';

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
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 24,
  },
  value: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    minWidth: 64,
    textAlign: 'center',
  },
});
