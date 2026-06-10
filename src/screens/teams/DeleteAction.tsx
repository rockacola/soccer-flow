import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';

type Props = {
  onPress: () => void;
};

export default function DeleteAction({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.deleteAction} onPress={onPress}>
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteActionText: {
    color: colors.textPrimary,
    fontSize: typeScale.body,
    fontWeight: '600',
  },
});
