import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
import { deleteTeam } from '../../services/teamsService';
import type { TeamsStackParamList } from '../../types';

import AddPlayerModal from './AddPlayerModal';
import EditPlayerModal from './EditPlayerModal';
import EditTeamModal from './EditTeamModal';
import PlayerRow from './PlayerRow';
import { useTeamDetailScreen } from './useTeamDetailScreen';

type Props = NativeStackScreenProps<TeamsStackParamList, 'TeamDetail'>;

export default function TeamDetailScreen({ route, navigation }: Props) {
  const { teamId } = route.params;
  const vm = useTeamDetailScreen(teamId, navigation);
  const { team, openEditTeamModal } = vm;

  useEffect(
    function syncHeaderTitle() {
      if (!team) {
        return;
      }
      navigation.setOptions({
        headerTitle: () => (
          <TouchableOpacity onPress={openEditTeamModal} style={styles.headerTitleContainer}>
            <View style={[styles.headerColourDot, { backgroundColor: team.colour }]} />
            <Text style={styles.headerTitleText}>{team.name}</Text>
          </TouchableOpacity>
        ),
      });
    },
    [navigation, team, openEditTeamModal],
  );

  if (!team) {
    return (
      <View style={styles.centred}>
        <Text style={styles.missingText}>Team not found.</Text>
      </View>
    );
  }

  const {
    hasActiveMatch,
    addModalVisible,
    editTeamModalVisible,
    selectedPlayer,
    openAddModal,
    closeAddModal,
    closeEditTeamModal,
    selectPlayer,
    deselectPlayer,
    handleStartMatch,
  } = vm;

  function handleDeleteTeam() {
    Alert.alert('Delete Team', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTeam(teamId);
          navigation.goBack();
        },
      },
    ]);
  }

  const matchButton = hasActiveMatch ? (
    <View
      style={[styles.matchButton, styles.matchButtonDisabled]}
      accessible
      accessibilityLabel="A match is already in progress"
    >
      <Text style={[styles.matchButtonText, styles.matchButtonTextDisabled]}>
        A match is already in progress
      </Text>
    </View>
  ) : (
    <TouchableOpacity
      style={styles.matchButton}
      onPress={handleStartMatch}
      accessibilityRole="button"
    >
      <Text style={styles.matchButtonText}>Start Match</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={team.players}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlayerRow player={item} onPress={() => selectPlayer(item)} />}
        ListHeaderComponent={matchButton}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.deleteTeamButton}
            onPress={handleDeleteTeam}
            accessibilityRole="button"
            accessibilityLabel="Delete team"
          >
            <Text style={styles.deleteTeamButtonText}>Delete Team</Text>
          </TouchableOpacity>
        }
        contentContainerStyle={team.players.length === 0 ? styles.emptyContainer : undefined}
        ListEmptyComponent={<Text style={styles.emptyText}>No players yet.</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={openAddModal}
        accessibilityRole="button"
        accessibilityLabel="Add player"
      >
        <Text style={styles.fabLabel}>+</Text>
      </TouchableOpacity>

      <AddPlayerModal teamId={teamId} visible={addModalVisible} onClose={closeAddModal} />

      {selectedPlayer !== null && (
        <EditPlayerModal
          key={selectedPlayer.id}
          teamId={teamId}
          player={selectedPlayer}
          visible={selectedPlayer !== null}
          onClose={deselectPlayer}
        />
      )}

      <EditTeamModal
        key={String(editTeamModalVisible)}
        teamId={teamId}
        initialName={team.name}
        initialColour={team.colour}
        visible={editTeamModalVisible}
        onClose={closeEditTeamModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerColourDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  headerTitleText: {
    fontSize: typeScale.title,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  matchButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.positive,
    borderRadius: spacing.md,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  matchButtonDisabled: {
    backgroundColor: colors.surfaceHigh,
  },
  matchButtonText: {
    fontSize: typeScale.input,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  matchButtonTextDisabled: {
    color: colors.textSecondary,
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
  deleteTeamButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: 100,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.destructive,
    alignItems: 'center',
  },
  deleteTeamButtonText: {
    fontSize: typeScale.body,
    fontWeight: '600',
    color: colors.destructive,
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
