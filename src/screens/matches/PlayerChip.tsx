import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
import type { Team } from '../../types';

type Props = {
  team: Team;
  playerId: string | null;
};

export default function PlayerChip({ team, playerId }: Props) {
  const player = playerId !== null ? team.players.find((p) => p.id === playerId) : undefined;
  return (
    <View style={styles.container}>
      <JerseyBadge size="sm" number={player?.jerseyNumber} />
      <Text style={styles.name}>{player?.name ?? 'Unknown'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    fontSize: typeScale.md,
    color: colors.textPrimary,
  },
});
