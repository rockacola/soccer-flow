import React, { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import type { GoalActivity, Player, Team } from '../../types';
import { formatElapsed } from '../../utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onRecord: (side: 'home' | 'away', playerId: string | null) => void;
  homeTeam: Team;
  opponentName: string;
  capturedPhaseSeconds: number;
  editActivity?: GoalActivity;
};

type ScorerRow = { type: 'unknown' } | { type: 'player'; player: Player };

export default function GoalModal({
  visible,
  onClose,
  onRecord,
  homeTeam,
  opponentName,
  capturedPhaseSeconds,
  editActivity,
}: Props) {
  const [side, setSide] = useState<'home' | 'away'>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      if (editActivity) {
        setSide(editActivity.side);
        setSelectedPlayerId(editActivity.playerId);
      } else {
        setSide('home');
        setSelectedPlayerId(undefined);
      }
    }
  }, [visible, editActivity]);

  const scorerRows: ScorerRow[] = [
    { type: 'unknown' },
    ...homeTeam.players.map((p): ScorerRow => ({ type: 'player', player: p })),
  ];

  const rowId = (row: ScorerRow) => (row.type === 'unknown' ? '__none__' : row.player.id);
  const rowPlayerId = (row: ScorerRow): string | null =>
    row.type === 'player' ? row.player.id : null;

  const handleRecord = () => {
    const playerId =
      side === 'home' ? (selectedPlayerId === undefined ? null : selectedPlayerId) : null;
    onRecord(side, playerId);
    onClose();
  };

  const opponentLabel = opponentName.trim() || 'Opponent';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editActivity ? 'Edit ' : ''}Goal — {formatElapsed(capturedPhaseSeconds)}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Team</Text>
          <View style={styles.teamToggle}>
            {(['home', 'away'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.teamTab, side === s && styles.teamTabActive]}
                onPress={() => {
                  setSide(s);
                  setSelectedPlayerId(undefined);
                }}
              >
                <Text style={[styles.teamTabText, side === s && styles.teamTabTextActive]}>
                  {s === 'home' ? homeTeam.name : opponentLabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {side === 'home' && (
            <>
              <Text style={styles.sectionLabel}>Scorer</Text>
              <FlatList
                data={scorerRows}
                keyExtractor={rowId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.playerRow}
                    onPress={() => setSelectedPlayerId(rowPlayerId(item))}
                  >
                    {item.type === 'player' ? (
                      <>
                        <JerseyBadge number={item.player.jerseyNumber} />
                        <Text style={styles.playerName}>{item.player.name}</Text>
                      </>
                    ) : (
                      <Text style={styles.unknownLabel}>Unknown scorer</Text>
                    )}
                    {selectedPlayerId === rowPlayerId(item) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
          <Text style={styles.recordButtonText}>{editActivity ? 'Save' : 'Record Goal'}</Text>
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
  content: {
    flex: 1,
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
  teamToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D1D6',
    overflow: 'hidden',
  },
  teamTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  teamTabActive: {
    backgroundColor: '#007AFF',
  },
  teamTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  teamTabTextActive: {
    color: '#FFFFFF',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    gap: 12,
  },
  playerName: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  unknownLabel: {
    fontSize: 16,
    color: '#8E8E93',
    flex: 1,
  },
  checkmark: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  recordButton: {
    margin: 16,
    backgroundColor: '#34C759',
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
