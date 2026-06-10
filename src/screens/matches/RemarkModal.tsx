import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  title: {
    fontSize: typeScale.title,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancel: {
    fontSize: typeScale.body,
    color: colors.accent,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    fontSize: typeScale.input,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  recordButton: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.warning,
    borderRadius: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: typeScale.title,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
