import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
import type { Player } from '../../types';

type Props = {
  player: Player;
  onPress: () => void;
};

export default function PlayerRow({ player, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.playerRow}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={player.name}
    >
      <JerseyBadge number={player.jerseyNumber} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        {player.position !== undefined && (
          <Text style={styles.playerPosition}>{player.position}</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: typeScale.input,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  playerPosition: {
    fontSize: typeScale.base,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: typeScale.lg,
    color: colors.separator,
  },
});
