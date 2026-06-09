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

import { createTeam } from '../../services/teamsService';

const COLOUR_OPTIONS: { hex: string; label: string }[] = [
  { hex: '#E53935', label: 'Red' },
  { hex: '#D81B60', label: 'Pink' },
  { hex: '#8E24AA', label: 'Purple' },
  { hex: '#1E88E5', label: 'Blue' },
  { hex: '#00897B', label: 'Teal' },
  { hex: '#43A047', label: 'Green' },
  { hex: '#FB8C00', label: 'Orange' },
  { hex: '#6D4C41', label: 'Brown' },
  { hex: '#757575', label: 'Grey' },
  { hex: '#1A1A1A', label: 'Black' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CreateTeamModal({ visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [colour, setColour] = useState(COLOUR_OPTIONS[0].hex);
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    try {
      createTeam(name, colour);
      setName('');
      setColour(COLOUR_OPTIONS[0].hex);
      setError(null);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function handleClose() {
    setName('');
    setColour(COLOUR_OPTIONS[0].hex);
    setError(null);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Team</Text>
          <TouchableOpacity onPress={handleSave}>
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
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          {error !== null && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourGrid}>
            {COLOUR_OPTIONS.map(({ hex, label }) => (
              <Pressable
                key={hex}
                accessibilityLabel={label}
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 17,
    color: '#007AFF',
  },
  saveButton: {
    fontSize: 17,
    color: '#007AFF',
    fontWeight: '600',
  },
  body: {
    padding: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C6C70',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  },
  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#FF3B30',
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
    borderColor: '#007AFF',
  },
});
