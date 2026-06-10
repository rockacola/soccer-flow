import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { SubstitutionActivity, Team } from '../../types';
import { formatPlayerLabel } from '../../utils/player';
import { formatElapsed } from '../../utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onRecord: (playerOutId: string, playerInId: string) => void;
  homeTeam: Team;
  capturedPhaseSeconds: number;
  editActivity?: SubstitutionActivity;
};

export default function SubstitutionModal({
  visible,
  onClose,
  onRecord,
  homeTeam,
  capturedPhaseSeconds,
  editActivity,
}: Props) {
  const [playerOutId, setPlayerOutId] = useState<string | null>(null);
  const [playerInId, setPlayerInId] = useState<string | null>(null);

  useEffect(
    function resetFormOnOpen() {
      if (visible) {
        if (editActivity) {
          setPlayerOutId(editActivity.playerOutId);
          setPlayerInId(editActivity.playerInId);
        } else {
          setPlayerOutId(null);
          setPlayerInId(null);
        }
      }
    },
    [visible, editActivity],
  );

  const handleRecord = () => {
    if (!playerOutId || !playerInId) {
      Alert.alert('Incomplete', 'Select both the player coming off and the player coming on.');
      return;
    }
    onRecord(playerOutId, playerInId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editActivity ? 'Edit ' : ''}Substitution — {formatElapsed(capturedPhaseSeconds)}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          {homeTeam.players.length === 0 ? (
            <View style={styles.emptyNotice}>
              <Text style={styles.emptyText}>No players in your team's roster.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.sectionLabel}>Coming off</Text>
              {homeTeam.players.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={styles.playerRow}
                  onPress={() => {
                    setPlayerOutId(p.id);
                    if (playerInId === p.id) {
                      setPlayerInId(null);
                    }
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Off: ${formatPlayerLabel(p)}`}
                  accessibilityState={{ selected: playerOutId === p.id }}
                >
                  <Text style={styles.playerText}>{formatPlayerLabel(p)}</Text>
                  {playerOutId === p.id && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}

              <Text style={styles.sectionLabel}>Coming on</Text>
              {homeTeam.players
                .filter((p) => p.id !== playerOutId)
                .map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.playerRow}
                    onPress={() => setPlayerInId(p.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`On: ${formatPlayerLabel(p)}`}
                    accessibilityState={{ selected: playerInId === p.id }}
                  >
                    <Text style={styles.playerText}>{formatPlayerLabel(p)}</Text>
                    {playerInId === p.id && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                ))}
            </>
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecord}
          accessibilityRole="button"
          accessibilityLabel={editActivity ? 'Save substitution' : 'Record substitution'}
        >
          <Text style={styles.recordButtonText}>
            {editActivity ? 'Save' : 'Record Substitution'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancel: {
    fontSize: 15,
    color: '#007AFF',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 16,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  playerText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyNotice: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  recordButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
