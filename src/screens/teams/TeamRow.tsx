import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { colors } from '../../constants/theme';
import { deleteTeam } from '../../services/teamsService';
import type { Team, TeamsStackParamList } from '../../types';

import DeleteAction from './DeleteAction';

type Nav = NativeStackNavigationProp<TeamsStackParamList, 'TeamsList'>;

type Props = {
  team: Team;
  openSwipeableRef: React.MutableRefObject<Swipeable | null>;
};

export default function TeamRow({ team, openSwipeableRef }: Props) {
  const navigation = useNavigation<Nav>();
  const swipeableRef = useRef<Swipeable>(null);

  function handleDelete() {
    swipeableRef.current?.close();
    deleteTeam(team.id);
  }

  function handlePress() {
    navigation.navigate('TeamDetail', { teamId: team.id });
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={() => <DeleteAction onPress={handleDelete} />}
      overshootRight={false}
      onSwipeableOpen={() => {
        if (openSwipeableRef.current !== swipeableRef.current) {
          openSwipeableRef.current?.close();
        }
        openSwipeableRef.current = swipeableRef.current;
      }}
    >
      <TouchableOpacity
        style={styles.row}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={team.name}
      >
        <View style={[styles.colourDot, { backgroundColor: team.colour }]} />
        <View style={styles.rowText}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.playerCount}>{team.players.length} players</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    backgroundColor: colors.background,
  },
  colourDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  playerCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: colors.separator,
  },
});
