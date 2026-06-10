import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { MatchesStackParamList } from '../../types';
import { formatBreakDuration, formatMatchDateLong, formatWallClock } from '../../utils/time';

import ActivityLogItem from './ActivityLogItem';
import { useMatchDetailScreen } from './useMatchDetailScreen';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchDetail'>;

export default function MatchDetailScreen({ route }: Props) {
  const { matchId } = route.params;
  const vm = useMatchDetailScreen(matchId);

  if (vm.status === 'not-found') {
    return (
      <View style={styles.centred}>
        <Text style={styles.emptyText}>Match not found.</Text>
      </View>
    );
  }

  const { match, homeTeam, opponentName, groups } = vm;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      {/* Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.date}>{formatMatchDateLong(match.segments[0]?.startedAt ?? null)}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.teamName} numberOfLines={2}>
            {homeTeam.name}
          </Text>
          <Text style={styles.score}>
            {match.homeScore} – {match.awayScore}
          </Text>
          <Text style={styles.teamName} numberOfLines={2}>
            {opponentName}
          </Text>
        </View>
      </View>

      {/* Segment groups */}
      <View style={styles.segmentsContainer}>
        {groups.map((group) => (
          <React.Fragment key={group.segmentId}>
            <View style={styles.periodHeader}>
              <Text style={styles.periodLabel}>{group.label.toUpperCase()}</Text>
              {group.endedAt !== null && (
                <Text style={styles.periodMeta}>
                  {formatWallClock(group.startedAt)}
                  {' – '}
                  {formatWallClock(group.endedAt)}
                  {'  ·  '}
                  {Math.round((group.endedAt - group.startedAt) / 60000)} min
                </Text>
              )}
            </View>
            <View style={styles.activityCard}>
              {group.activities.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyRowText}>No activities</Text>
                </View>
              ) : (
                group.activities.map((activity, aIdx) => (
                  <ActivityLogItem
                    key={activity.id}
                    activity={activity}
                    homeTeam={homeTeam}
                    opponentName={opponentName}
                    segments={match.segments}
                    showBottomBorder={aIdx < group.activities.length - 1}
                  />
                ))
              )}
            </View>
            {group.breakAfter !== null && (
              <View style={styles.breakSeparator}>
                <View style={styles.breakLine} />
                <Text style={styles.breakText}>
                  {group.breakAfter.label} · {formatBreakDuration(group.breakAfter.durationMs)}
                </Text>
                <View style={styles.breakLine} />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  segmentsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginLeft: 4,
    marginRight: 4,
  },
  periodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  periodMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  emptyRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyRowText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  breakSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  breakLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  breakText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
