import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Swipeable } from 'react-native-gesture-handler';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { MatchesStackParamList } from '../../types';
import { resolveOpponent, resolveTeamName } from '../../utils/match';

import MatchRow from './MatchRow';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchesList'>;

export default function MatchesListScreen({ navigation }: Props) {
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const pastMatches = useMatchStore((s) => s.pastMatches);
  const teams = useTeamsStore((s) => s.teams);
  const openSwipeableRef = useRef<Swipeable | null>(null);

  useFocusEffect(
    useCallback(() => {
      return () => {
        openSwipeableRef.current?.close();
        openSwipeableRef.current = null;
      };
    }, []),
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
              {resolveTeamName(teams, currentMatch.homeTeamId)} vs{' '}
              {resolveOpponent(currentMatch.opponentName)}
            </Text>
          </View>
          <Text style={styles.resumeChevron}>›</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={[...pastMatches].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchRow
            match={item}
            resolveTeamName={(teamId) => resolveTeamName(teams, teamId)}
            openSwipeableRef={openSwipeableRef}
          />
        )}
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
