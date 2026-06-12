import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { spacing } from '../../constants/spacing';
import { TEAM_COLOUR_OPTIONS } from '../../constants/team';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { updateTeam } from '../../services/teamsService';

type Props = {
  teamId: string;
  initialName: string;
  initialColour: string;
  visible: boolean;
  onClose: () => void;
};

export default function EditTeamModal({
  teamId,
  initialName,
  initialColour,
  visible,
  onClose,
}: Props) {
  const [name, setName] = useState(initialName);
  const [colour, setColour] = useState(initialColour);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    try {
      updateTeam(teamId, name, colour);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function handleClose() {
    setError(null);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} accessibilityRole="button">
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Team</Text>
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
            autoFocus
            keyboardAppearance="dark"
            returnKeyType="done"
            onSubmitEditing={handleSave}
            accessibilityLabel="Team name"
          />
          {error !== null && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourGrid}>
            {TEAM_COLOUR_OPTIONS.map(({ hex, label }) => (
              <Pressable
                key={hex}
                accessibilityRole="button"
                accessibilityLabel={label}
                accessibilityState={{ selected: colour === hex }}
                style={[
                  styles.colourSwatch,
                  { backgroundColor: hex },
                  colour === hex && styles.colourSwatchSelected,
                ]}
                onPress={() => setColour(hex)}
              />
            ))}
          </View>
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
  colourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colourSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  colourSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.accent,
  },
});
