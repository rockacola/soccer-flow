import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { MatchActivity, MatchesStackParamList } from '../../types';

import ActivityLogItem from './ActivityLogItem';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchDetail'>;

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

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const opponentName = match.opponentName.trim() || 'Opponent';

  return (
    <FlatList
      style={styles.container}
      data={match.activities}
      keyExtractor={(item: MatchActivity) => item.id}
      renderItem={({ item }) => (
        <ActivityLogItem
          activity={item}
          homeTeam={homeTeam ?? { id: '', name: 'Unknown', colour: '#ccc', players: [] }}
          opponentName={opponentName}
          segments={match.segments}
        />
      )}
      ListHeaderComponent={
        <View>
          {/* Score */}
          <View style={styles.scoreCard}>
            <Text style={styles.date}>{formatDate(match.segments[0]?.startedAt ?? null)}</Text>
            <View style={styles.scoreRow}>
              <Text style={styles.teamName} numberOfLines={2}>
                {homeTeam?.name ?? 'Unknown'}
              </Text>
              <Text style={styles.score}>
                {match.homeScore} – {match.awayScore}
              </Text>
              <Text style={styles.teamName} numberOfLines={2}>
                {opponentName}
              </Text>
            </View>
          </View>

          {/* Match info */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Periods</Text>
              <Text style={styles.infoValue}>
                {match.segments.filter((s) => s.segmentType === 'period').length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Period duration</Text>
              <Text style={styles.infoValue}>{match.periodDurationMinutes} min</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Break duration</Text>
              <Text style={styles.infoValue}>{match.breakDurationMinutes} min</Text>
            </View>
          </View>

          {/* Activity log heading */}
          <Text style={styles.sectionHeading}>Activity</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyActivity}>
          <Text style={styles.emptyText}>No activities recorded.</Text>
        </View>
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    paddingBottom: 32,
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
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#000000',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E5EA',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 28,
    marginBottom: 0,
    marginHorizontal: 16,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
});
