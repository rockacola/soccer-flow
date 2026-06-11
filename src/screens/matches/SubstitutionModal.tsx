import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
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
  const [playerOutId, setPlayerOutId] = useState<string | null>(editActivity?.playerOutId ?? null);
  const [playerInId, setPlayerInId] = useState<string | null>(editActivity?.playerInId ?? null);

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
    backgroundColor: colors.surface,
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
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  playerText: {
    fontSize: typeScale.input,
    color: colors.textPrimary,
    flex: 1,
  },
  checkmark: {
    fontSize: typeScale.input,
    color: colors.accent,
    fontWeight: '600',
  },
  emptyNotice: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  emptyText: {
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  recordButton: {
    margin: spacing.lg,
    backgroundColor: colors.accent,
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
