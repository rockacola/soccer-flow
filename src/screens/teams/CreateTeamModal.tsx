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

import ScreenBackground from '../../components/ScreenBackground';
import { spacing } from '../../constants/spacing';
import { TEAM_COLOUR_OPTIONS } from '../../constants/team';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { createTeam } from '../../services/teamsService';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateTeamModal({ visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState(TEAM_COLOUR_OPTIONS[0].hex);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    try {
      createTeam(name, colour);
      setName('');
      setColour(TEAM_COLOUR_OPTIONS[0].hex);
      setError(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function handleClose() {
    setName('');
    setColour(TEAM_COLOUR_OPTIONS[0].hex);
    setError(null);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ScreenBackground>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Team</Text>
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
            placeholder="e.g. Red Lions"
            placeholderTextColor={colors.textSecondary}
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
