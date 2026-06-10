import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { formatElapsed } from '../../utils/time';

type Props = {
  durationSeconds: number;
  onAdjust: (deltaSeconds: number) => void;
};

export default function DeltaButtons({ durationSeconds, onAdjust }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(-5 * 60)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>-5m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(-1 * 60)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>-1m</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(-5)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>-5s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(-1)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>-1s</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.duration}>{formatElapsed(durationSeconds)}</Text>

      <View style={styles.side}>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(1 * 60)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>+1m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(5 * 60)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>+5m</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(1)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>+1s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onAdjust(5)}
            accessibilityRole="button"
          >
            <Text style={styles.btnText}>+5s</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
  },
  side: {
    gap: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 7,
    width: 44,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
  },
  duration: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontVariant: ['tabular-nums'],
  },
});
