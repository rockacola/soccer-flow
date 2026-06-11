import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import type { Match, MatchesStackParamList } from '../../types';
import { resolveOpponent } from '../../utils/match';
import { formatMatchDate } from '../../utils/time';

type Nav = NativeStackNavigationProp<MatchesStackParamList, 'MatchesList'>;

type Props = {
  match: Match;
  resolveTeamName: (teamId: string) => string;
};

export default function MatchRow({ match, resolveTeamName }: Props) {
  const navigation = useNavigation<Nav>();

  function handlePress() {
    navigation.navigate('MatchDetail', { matchId: match.id });
  }

  return (
    <Pressable
      style={styles.row}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${resolveTeamName(match.homeTeamId)} vs ${resolveOpponent(match.opponentName)}, ${match.homeScore} to ${match.awayScore}`}
    >
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: spacing.md,
    padding: 14,
    overflow: 'hidden',
  },
  rowTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  teamText: {
    fontSize: typeScale.body,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    flex: 1,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: typeScale.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'right',
  },
});
