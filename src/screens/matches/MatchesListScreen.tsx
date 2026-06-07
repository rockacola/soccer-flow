import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Match, MatchesStackParamList } from '../../types';

function resolveOpponent(opponentName: string): string {
  return opponentName.trim() || 'Opponent';
}

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchesList'>;

function formatDate(timestamp: number | null): string {
  if (timestamp === null) {
    return '';
  }
  return new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function MatchesListScreen({ navigation }: Props) {
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const pastMatches = useMatchStore((s) => s.pastMatches);
  const teams = useTeamsStore((s) => s.teams);

  const resolveTeamName = (teamId: string): string =>
    teams.find((t) => t.id === teamId)?.name ?? 'Unknown';

  const renderMatch = ({ item }: { item: Match }) => (
    <TouchableOpacity
      style={styles.matchRow}
      onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
    >
      <View style={styles.matchTeams}>
        <Text style={styles.teamText} numberOfLines={1}>
          {resolveTeamName(item.homeTeamId)}
        </Text>
        <Text style={styles.scoreText}>
          {item.homeScore} – {item.awayScore}
        </Text>
        <Text style={styles.teamText} numberOfLines={1}>
          {resolveOpponent(item.opponentName)}
        </Text>
      </View>
      <Text style={styles.dateText}>{formatDate(item.segments[0]?.startedAt ?? null)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {currentMatch !== null && (
        <TouchableOpacity
          style={styles.resumeBanner}
          onPress={() => navigation.navigate('MatchLive')}
        >
          <View>
            <Text style={styles.resumeLabel}>Match in progress</Text>
            <Text style={styles.resumeTeams}>
              {resolveTeamName(currentMatch.homeTeamId)} vs{' '}
              {resolveOpponent(currentMatch.opponentName)}
            </Text>
          </View>
          <Text style={styles.resumeChevron}>›</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={[...pastMatches].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderMatch}
        contentContainerStyle={pastMatches.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={
          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>No past matches</Text>
            <Text style={styles.emptySubtitle}>Start a match from a team's detail screen.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  resumeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  resumeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.85,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  resumeTeams: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resumeChevron: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  matchRow: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
  },
  matchTeams: {
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
  emptyContainer: {
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});
