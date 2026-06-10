import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { deletePastMatch } from '../../services/matchService';
import type { Match, MatchesStackParamList } from '../../types';
import { resolveOpponent } from '../../utils/match';
import { formatMatchDate } from '../../utils/time';
import DeleteAction from '../teams/DeleteAction';

type Nav = NativeStackNavigationProp<MatchesStackParamList, 'MatchesList'>;

type Props = {
  match: Match;
  resolveTeamName: (teamId: string) => string;
  openSwipeableRef: React.MutableRefObject<Swipeable | null>;
};

export default function MatchRow({ match, resolveTeamName, openSwipeableRef }: Props) {
  const navigation = useNavigation<Nav>();
  const swipeableRef = useRef<Swipeable>(null);

  function handleDelete() {
    swipeableRef.current?.close();
    deletePastMatch(match.id);
  }

  function handlePress() {
    navigation.navigate('MatchDetail', { matchId: match.id });
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
        accessibilityLabel={`${resolveTeamName(match.homeTeamId)} vs ${resolveOpponent(match.opponentName)}, ${match.homeScore} to ${match.awayScore}`}
      >
        <View style={styles.rowTeams}>
          <Text style={styles.teamText} numberOfLines={1}>
            {resolveTeamName(match.homeTeamId)}
          </Text>
          <Text style={styles.scoreText}>
            {match.homeScore} – {match.awayScore}
          </Text>
          <Text style={styles.teamText} numberOfLines={1}>
            {resolveOpponent(match.opponentName)}
          </Text>
        </View>
        <Text style={styles.dateText}>{formatMatchDate(match.segments[0]?.startedAt ?? null)}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
  },
  rowTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  teamText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 12,
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
  },
});
