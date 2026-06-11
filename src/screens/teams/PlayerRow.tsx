import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import type { Player } from '../../types';

type Props = {
  player: Player;
  onPress: () => void;
};

export default function PlayerRow({ player, onPress }: Props) {
  return (
    <Pressable style={styles.playerRow} onPress={onPress} accessibilityLabel={player.name}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <JerseyBadge number={player.jerseyNumber} />
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{player.name}</Text>
        {player.position !== undefined && (
          <Text style={styles.playerPosition}>{player.position}</Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
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
    overflow: 'hidden',
    gap: spacing.md,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: typeScale.input,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  playerPosition: {
    fontSize: typeScale.base,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: typeScale.lg,
    color: colors.separator,
  },
});
