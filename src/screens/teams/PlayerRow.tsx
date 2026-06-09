import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import JerseyBadge from '../../components/JerseyBadge';
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  playerPosition: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: '#C6C6C8',
  },
});
