import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Player, RootTabParamList, TeamsStackParamList } from '../../types';

import AddPlayerModal from './AddPlayerModal';
import EditPlayerModal from './EditPlayerModal';
import EditTeamModal from './EditTeamModal';
import PlayerRow from './PlayerRow';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamDetail'>;

export default function TeamDetailScreen({ route, navigation }: Props) {
  const { teamId } = route.params;
  const team = useTeamsStore((s) => s.teams.find((t) => t.id === teamId));
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editTeamModalVisible, setEditTeamModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const rootNav = useNavigation<NavigationProp<RootTabParamList>>();

  useEffect(
    function dismissOnTabBlur() {
      const parent = navigation.getParent();
      if (!parent) {
        return () => {};
      }
      const unsubscribe = parent.addListener('blur', () => {
        navigation.popToTop();
      });
      return unsubscribe;
    },
    [navigation],
  );

  useEffect(
    function syncHeaderTitle() {
      if (!team) {
        return;
      }
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity
            onPress={() => setEditTeamModalVisible(true)}
            style={styles.headerTitleContainer}
          >
            <View style={[styles.headerColourDot, { backgroundColor: team.colour }]} />
            <Text style={styles.headerTitleText}>{team.name}</Text>
          </TouchableOpacity>
        ),
      });
    },
    [navigation, team],
  );

  const handleStartMatch = () => {
    rootNav.navigate('Matches', {
      screen: 'MatchSetup',
      params: { homeTeamId: teamId },
    });
  };

  if (!team) {
    return (
      <View style={styles.centred}>
        <Text style={styles.missingText}>Team not found.</Text>
      </View>
    );
  }

  const matchButton =
    currentMatch !== null ? (
      <View style={[styles.matchButton, styles.matchButtonDisabled]}>
        <Text style={[styles.matchButtonText, styles.matchButtonTextDisabled]}>
          A match is already in progress
        </Text>
      </View>
    ) : (
      <TouchableOpacity style={styles.matchButton} onPress={handleStartMatch}>
        <Text style={styles.matchButtonText}>Start Match</Text>
      </TouchableOpacity>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={team.players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlayerRow teamId={teamId} player={item} onPress={() => setSelectedPlayer(item)} />
        )}
        ListHeaderComponent={matchButton}
        contentContainerStyle={team.players.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>No players yet.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.fabLabel}>+</Text>
      </TouchableOpacity>

      <AddPlayerModal
        teamId={teamId}
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
      />

      {selectedPlayer !== null && (
        <EditPlayerModal
          teamId={teamId}
          player={selectedPlayer}
          visible={selectedPlayer !== null}
          onClose={() => setSelectedPlayer(null)}
        />
      )}

      <EditTeamModal
        teamId={teamId}
        initialName={team.name}
        initialColour={team.colour}
        visible={editTeamModalVisible}
        onClose={() => setEditTeamModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerColourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '600',
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  matchButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  matchButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  matchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  matchButtonTextDisabled: {
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabLabel: {
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 34,
  },
});
