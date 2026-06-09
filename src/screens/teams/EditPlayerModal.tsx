import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { PLAYER_POSITIONS } from '../../constants/player';
import { updatePlayer } from '../../services/teamsService';
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

  useEffect(
    function resetFormOnOpen() {
      if (visible) {
        setName(player.name);
        setJerseyInput(player.jerseyNumber?.toString() ?? '');
        setPosition(player.position);
        setError(null);
      }
    },
    [visible, player],
  );

  function handleSave() {
    const jerseyNumber = parseJerseyNumber(jerseyInput);
    try {
      updatePlayer(teamId, player.id, name, jerseyNumber, position);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    }
  }

  function handlePositionPress(p: PlayerPosition) {
    setPosition((prev) => (prev === p ? undefined : p));
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Player</Text>
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
            placeholder="e.g. Alex Morgan"
            autoFocus
            returnKeyType="next"
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
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          {error !== null && <Text style={styles.errorText}>{error}</Text>}

          <Text style={styles.label}>Position (optional)</Text>
          <View style={styles.positionRow}>
            {PLAYER_POSITIONS.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.positionChip, position === p && styles.positionChipSelected]}
                onPress={() => handlePositionPress(p)}
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
  positionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  positionChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#C6C6C8',
  },
  positionChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  positionChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  positionChipTextSelected: {
    color: '#FFFFFF',
  },
});
