import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CreateTeamModal from '../../components/CreateTeamModal';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Team } from '../../types';

function TeamRow({ team }: { team: Team }) {
  return (
    <View style={styles.row}>
      <View style={[styles.colourDot, { backgroundColor: team.colour }]} />
      <View style={styles.rowText}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.playerCount}>{team.players.length} players</Text>
      </View>
    </View>
  );
}

export default function TeamsListScreen() {
  const teams = useTeamsStore((s) => s.teams);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TeamRow team={item} />}
        contentContainerStyle={teams.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>No teams yet.</Text>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabLabel}>+</Text>
      </TouchableOpacity>

      <CreateTeamModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  colourDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerCount: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
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
