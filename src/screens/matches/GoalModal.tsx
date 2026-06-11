import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
import type { GoalActivity, Team } from '../../types';
import {
  buildScorerRows,
  resolveGoalPlayerId,
  resolveOpponent,
  scorerRowId,
  scorerRowPlayerId,
} from '../../utils/match';
import { formatPlayerLabel } from '../../utils/player';
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

export default function GoalModal({
  visible,
  onClose,
  onRecord,
  homeTeam,
  opponentName,
  capturedPhaseSeconds,
  editActivity,
}: Props) {
  const [side, setSide] = useState<'home' | 'away'>(editActivity?.side ?? 'home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null | undefined>(
    editActivity?.playerId,
  );

  const scorerRows = buildScorerRows(homeTeam.players);

  const handleRecord = () => {
    onRecord(side, resolveGoalPlayerId(side, selectedPlayerId));
    onClose();
  };

  const opponentLabel = resolveOpponent(opponentName);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editActivity ? 'Edit ' : ''}Goal — {formatElapsed(capturedPhaseSeconds)}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
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
                accessibilityRole="button"
                accessibilityLabel={s === 'home' ? homeTeam.name : opponentLabel}
                accessibilityState={{ selected: side === s }}
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
                keyExtractor={scorerRowId}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.playerRow}
                    onPress={() => setSelectedPlayerId(scorerRowPlayerId(item))}
                    accessibilityRole="button"
                    accessibilityLabel={
                      item.type === 'player' ? formatPlayerLabel(item.player) : 'Unknown scorer'
                    }
                    accessibilityState={{ selected: selectedPlayerId === scorerRowPlayerId(item) }}
                  >
                    {item.type === 'player' ? (
                      <>
                        <JerseyBadge number={item.player.jerseyNumber} />
                        <Text style={styles.playerName}>{item.player.name}</Text>
                      </>
                    ) : (
                      <Text style={styles.unknownLabel}>Unknown scorer</Text>
                    )}
                    {selectedPlayerId === scorerRowPlayerId(item) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecord}
          accessibilityRole="button"
          accessibilityLabel={editActivity ? 'Save goal' : 'Record goal'}
        >
          <Text style={styles.recordButtonText}>{editActivity ? 'Save' : 'Record Goal'}</Text>
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
  content: {
    flex: 1,
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
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cancel: {
    fontSize: typeScale.body,
    color: colors.accent,
  },
  sectionLabel: {
    fontSize: typeScale.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xl,
    marginBottom: 6,
    paddingHorizontal: spacing.lg,
  },
  teamToggle: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.separator,
    overflow: 'hidden',
  },
  teamTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
  },
  teamTabActive: {
    backgroundColor: colors.accent,
  },
  teamTabText: {
    fontSize: typeScale.md,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  teamTabTextActive: {
    color: colors.textPrimary,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    gap: spacing.md,
  },
  playerName: {
    fontSize: typeScale.input,
    color: colors.textPrimary,
    flex: 1,
  },
  unknownLabel: {
    fontSize: typeScale.input,
    color: colors.textSecondary,
    flex: 1,
  },
  checkmark: {
    fontSize: typeScale.input,
    color: colors.accent,
    fontWeight: '600',
  },
  recordButton: {
    margin: spacing.lg,
    backgroundColor: colors.positive,
    borderRadius: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: typeScale.title,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
