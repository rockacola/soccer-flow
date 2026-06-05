import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { deleteTeam } from '../../services/teamsService';
import type { Team, TeamsStackParamList } from '../../types';

import DeleteAction from './DeleteAction';

type Nav = NativeStackNavigationProp<TeamsStackParamList, 'TeamsList'>;

type Props = {
  team: Team;
};

export default function TeamRow({ team }: Props) {
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
    >
      <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.7}>
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
    borderBottomColor: '#C6C6C8',
    backgroundColor: '#FFFFFF',
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
  },
  playerCount: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    color: '#C6C6C8',
  },
});
