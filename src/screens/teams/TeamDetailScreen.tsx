import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTeamsStore } from '../../stores/teamsStore';
import type { Player, TeamsStackParamList } from '../../types';

import AddPlayerModal from './AddPlayerModal';
import EditPlayerModal from './EditPlayerModal';
import PlayerRow from './PlayerRow';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamDetail'>;

export default function TeamDetailScreen({ route }: Props) {
  const { teamId } = route.params;
  const team = useTeamsStore((s) => s.teams.find((t) => t.id === teamId));
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  if (!team) {
    return (
      <View style={styles.centred}>
        <Text style={styles.missingText}>Team not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={team.players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlayerRow teamId={teamId} player={item} onPress={() => setSelectedPlayer(item)} />
        )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
