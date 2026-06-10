import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
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
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: spacing.md,
    padding: 14,
  },
  rowTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  teamText: {
    fontSize: typeScale.body,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: typeScale.sm,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
