import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTeamsStore } from '../../stores/teamsStore';

import CreateTeamModal from './CreateTeamModal';
import TeamRow from './TeamRow';

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
