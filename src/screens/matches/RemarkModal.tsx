import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
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
  const [text, setText] = useState(editActivity?.text ?? '');

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
          <TouchableOpacity onPress={onClose} accessibilityRole="button">
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
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  cancel: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
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
    fontFamily: fonts.regular,
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
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
});
