import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ScreenBackground from '../../components/ScreenBackground';
import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
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
  const { team, openEditTeamModal, openAddModal } = vm;

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

  useEffect(
    function syncHeaderAddButton() {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={openAddModal} accessibilityRole="button">
            <Text style={styles.headerButton}>Add</Text>
          </TouchableOpacity>
        ),
      });
    },
    [navigation, openAddModal],
  );

  if (!team) {
    return (
      <ScreenBackground>
        <View style={styles.centred}>
          <Text style={styles.missingText}>Team not found.</Text>
        </View>
      </ScreenBackground>
    );
  }

  const {
    hasActiveMatch,
    addModalVisible,
    editTeamModalVisible,
    selectedPlayer,
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
    <ScreenBackground>
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
            >
              <Text style={styles.deleteTeamButtonText}>Delete Team</Text>
            </TouchableOpacity>
          }
          contentContainerStyle={team.players.length === 0 ? styles.emptyContainer : undefined}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No players yet. Tap Add to build your roster before starting a match.
            </Text>
          }
        />

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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
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
    fontFamily: fonts.semiBold,
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
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
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
    fontFamily: fonts.semiBold,
    color: colors.destructive,
  },
  headerButton: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  },
});
