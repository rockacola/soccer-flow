import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { RemarkActivity } from '../../types';
import { formatElapsed } from '../../utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onRecord: (text: string) => void;
  capturedPhaseSeconds: number;
  editActivity?: RemarkActivity;
};

export default function RemarkModal({
  visible,
  onClose,
  onRecord,
  capturedPhaseSeconds,
  editActivity,
}: Props) {
  const [text, setText] = useState('');

  useEffect(
    function resetFormOnOpen() {
      if (visible) {
        setText(editActivity ? editActivity.text : '');
      }
    },
    [visible, editActivity],
  );

  const handleRecord = () => {
    if (text.trim().length === 0) {
      Alert.alert('Empty remark', 'Please enter a note before recording.');
      return;
    }
    onRecord(text.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editActivity ? 'Edit ' : ''}Note — {formatElapsed(capturedPhaseSeconds)}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="What happened?"
            placeholderTextColor={colors.textSecondary}
            value={text}
            onChangeText={setText}
            multiline
            autoFocus
            keyboardAppearance="dark"
            accessibilityLabel="Match note"
          />
        </View>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecord}
          accessibilityRole="button"
          accessibilityLabel={editActivity ? 'Save note' : 'Record note'}
        >
          <Text style={styles.recordButtonText}>{editActivity ? 'Save' : 'Record Note'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancel: {
    fontSize: 15,
    color: colors.accent,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    margin: 16,
    padding: 12,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  recordButton: {
    marginHorizontal: 16,
    backgroundColor: colors.warning,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
