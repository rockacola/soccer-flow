import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PLAYER_POSITIONS } from '../../constants/player';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { deletePlayer, updatePlayer } from '../../services/teamsService';
import type { Player, PlayerPosition } from '../../types';
import { parseJerseyNumber } from '../../utils/player';

type Props = {
  teamId: string;
  player: Player;
  visible: boolean;
  onClose: () => void;
};

export default function EditPlayerModal({ teamId, player, visible, onClose }: Props) {
  const [name, setName] = useState(player.name);
  const [jerseyInput, setJerseyInput] = useState(player.jerseyNumber?.toString() ?? '');
  const [position, setPosition] = useState<PlayerPosition | undefined>(player.position);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const jerseyNumber = parseJerseyNumber(jerseyInput);
    try {
      updatePlayer(teamId, player.id, name, jerseyNumber, position);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function handleDelete() {
    Alert.alert('Delete Player', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePlayer(teamId, player.id);
          onClose();
        },
      },
    ]);
  }

  function handlePositionPress(p: PlayerPosition) {
    setPosition((prev) => (prev === p ? undefined : p));
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Player</Text>
          <TouchableOpacity
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save player"
          >
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

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete player"
          >
            <Text style={styles.deleteButtonText}>Delete Player</Text>
          </TouchableOpacity>
        </View>
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
  deleteButton: {
    marginTop: spacing.xxl,
    paddingVertical: 14,
    borderRadius: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.destructive,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.destructive,
  },
});
