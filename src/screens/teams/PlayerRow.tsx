import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import JerseyBadge from '../../components/JerseyBadge';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
import { deletePlayer } from '../../services/teamsService';
import type { Player } from '../../types';

import DeleteAction from './DeleteAction';

type Props = {
  teamId: string;
  player: Player;
  onPress: () => void;
};

export default function PlayerRow({ teamId, player, onPress }: Props) {
  const swipeableRef = useRef<Swipeable>(null);

  function handleDelete() {
    swipeableRef.current?.close();
    deletePlayer(teamId, player.id);
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => <DeleteAction onPress={handleDelete} />}
      overshootRight={false}
    >
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
    </Swipeable>
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
