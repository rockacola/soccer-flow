import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  number?: number;
  size?: 'sm' | 'md';
};

export default function JerseyBadge({ number, size = 'md' }: Props) {
  const dim = size === 'sm' ? 22 : 36;
  const fontSize = size === 'sm' ? 10 : 14;

  return (
    <View style={[styles.badge, { width: dim, height: dim, borderRadius: dim / 2 }]}>
      {number !== undefined && <Text style={[styles.number, { fontSize }]}>{number}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontWeight: '700',
    color: '#1C1C1E',
  },
});
