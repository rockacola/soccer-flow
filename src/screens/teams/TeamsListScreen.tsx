import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Create team"
      >
        <Text style={styles.fabLabel}>+</Text>
      </TouchableOpacity>

      <CreateTeamModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: spacing.xxl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  fabLabel: {
    fontSize: 30,
    color: colors.textPrimary,
    lineHeight: 34,
  },
});
