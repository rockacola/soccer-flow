import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import ScreenBackground from '../../components/ScreenBackground';
import { PLAYER_POSITIONS } from '../../constants/player';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { addPlayer } from '../../services/teamsService';
import type { PlayerPosition } from '../../types';
import { parseJerseyNumber } from '../../utils/player';

type Props = {
  teamId: string;
  visible: boolean;
  onClose: () => void;
};

export default function AddPlayerModal({ teamId, visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [jerseyInput, setJerseyInput] = useState('');
  const [position, setPosition] = useState<PlayerPosition | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const jerseyNumber = parseJerseyNumber(jerseyInput);
    try {
      addPlayer(teamId, name, jerseyNumber, position);
      resetAndClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function resetAndClose() {
    setName('');
    setJerseyInput('');
    setPosition(undefined);
    setError(null);
    onClose();
  }

  function handlePositionPress(p: PlayerPosition) {
    setPosition((prev) => (prev === p ? undefined : p));
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScreenBackground>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetAndClose} accessibilityRole="button">
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Player</Text>
          <TouchableOpacity onPress={handleSave} accessibilityRole="button">
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(t) => {
              setName(t);
              setError(null);
            }}
            placeholder="e.g. Alex Morgan"
            placeholderTextColor={colors.textSecondary}
            autoFocus
            keyboardAppearance="dark"
            returnKeyType="next"
            accessibilityLabel="Player name"
          />

          <Text style={styles.label}>Jersey Number (optional)</Text>
          <TextInput
            style={styles.input}
            value={jerseyInput}
            onChangeText={(t) => {
              setJerseyInput(t);
              setError(null);
            }}
            placeholder="e.g. 10"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            keyboardAppearance="dark"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            accessibilityLabel="Jersey number"
          />

          {error !== null && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Position (optional)</Text>
          <View style={styles.positionRow}>
            {PLAYER_POSITIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.positionChip, position === p && styles.positionChipSelected]}
                onPress={() => handlePositionPress(p)}
                accessibilityRole="button"
                accessibilityLabel={p}
                accessibilityState={{ selected: position === p }}
              >
                <Text
                  style={[
                    styles.positionChipText,
                    position === p && styles.positionChipTextSelected,
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScreenBackground>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    backgroundColor: colors.surfaceElevated,
  },
  title: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  cancelButton: {
    fontSize: typeScale.title,
    fontFamily: fonts.regular,
    color: colors.accent,
  },
  saveButton: {
    fontSize: typeScale.title,
    color: colors.accent,
    fontFamily: fonts.semiBold,
  },
  body: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typeScale.base,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
    fontSize: typeScale.input,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  errorText: {
    marginTop: 6,
    fontSize: typeScale.base,
    fontFamily: fonts.regular,
    color: colors.destructive,
  },
  positionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  positionChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.surfaceElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  positionChipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  positionChipText: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  positionChipTextSelected: {
    color: colors.textPrimary,
  },
});
