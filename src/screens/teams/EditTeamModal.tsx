import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { TEAM_COLOUR_OPTIONS } from '../../constants/team';
import { colors } from '../../constants/theme';
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

  useEffect(
    function resetFormOnOpen() {
      if (visible) {
        setName(initialName);
        setColour(initialColour);
        setError(null);
      }
    },
    [visible, initialName, initialColour],
  );

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
          <TouchableOpacity
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Team</Text>
          <TouchableOpacity
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Save team"
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    backgroundColor: colors.surfaceElevated,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancelButton: {
    fontSize: 17,
    color: colors.accent,
  },
  saveButton: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '600',
  },
  body: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.separator,
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: colors.destructive,
  },
  colourGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
