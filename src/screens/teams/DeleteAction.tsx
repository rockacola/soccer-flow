import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

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
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
