import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Match, MatchActivity, MatchesStackParamList } from '../../types';
import { segmentLabel } from '../../utils/match';
import { formatWallClock } from '../../utils/time';

import ActivityLogItem from './ActivityLogItem';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchDetail'>;

type SegmentGroup = {
  segmentId: string;
  label: string;
  startedAt: number;
  endedAt: number | null;
  activities: MatchActivity[];
  breakAfter: { label: string; durationMs: number } | null;
};

function buildSegmentGroups(match: Match): SegmentGroup[] {
  const { segments, activities } = match;
  const groups: SegmentGroup[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.segmentType !== 'period') {
      continue;
    }

    const nextSegStart = segments[i + 1]?.startedAt ?? match.endedAt ?? null;
    const periodActivities = activities.filter(
      (a) => a.createdAt >= seg.startedAt && a.createdAt < (nextSegStart ?? Infinity),
    );

    let breakAfter: { label: string; durationMs: number } | null = null;
    if (i + 1 < segments.length && segments[i + 1].segmentType === 'break') {
      const breakSeg = segments[i + 1];
      const afterBreakSeg = segments[i + 2];
      const durationMs = afterBreakSeg
        ? afterBreakSeg.startedAt - breakSeg.startedAt
        : match.breakDurationMinutes * 60 * 1000;
      breakAfter = { label: segmentLabel(breakSeg, i + 1, segments), durationMs };
    }

    groups.push({
      segmentId: `seg-${i}`,
      label: segmentLabel(seg, i, segments),
      startedAt: seg.startedAt,
      endedAt: nextSegStart,
      activities: periodActivities,
      breakAfter,
    });
  }

  return groups;
}

function formatBreakDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  return `${minutes} min`;
}

function formatDate(timestamp: number | null): string {
  if (timestamp === null) {
    return '';
  }
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MatchDetailScreen({ route }: Props) {
  const { matchId } = route.params;
  const match = useMatchStore((s) => s.pastMatches.find((m) => m.id === matchId));
  const teams = useTeamsStore((s) => s.teams);

  if (!match) {
    return (
      <View style={styles.centred}>
        <Text style={styles.emptyText}>Match not found.</Text>
      </View>
    );
  }

  const homeTeam = teams.find((t) => t.id === match.homeTeamId) ?? {
    id: '',
    name: 'Unknown',
    colour: '#ccc',
    players: [],
  };
  const opponentName = match.opponentName.trim() || 'Opponent';
  const groups = buildSegmentGroups(match);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      {/* Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.date}>{formatDate(match.segments[0]?.startedAt ?? null)}</Text>
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
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    paddingBottom: 40,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  scoreCard: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.45)',
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
    color: 'rgba(255,255,255,0.75)',
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  periodMeta: {
    fontSize: 12,
    color: '#AEAEB2',
    fontVariant: ['tabular-nums'],
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
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
    color: '#8E8E93',
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
    backgroundColor: '#C7C7CC',
  },
  breakText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
});
