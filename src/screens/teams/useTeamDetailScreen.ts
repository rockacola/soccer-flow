import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';

import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Player, RootTabParamList, Team, TeamsStackParamList } from '../../types';

type Navigation = NativeStackNavigationProp<TeamsStackParamList, 'TeamDetail'>;

export type TeamDetailScreenState = {
  team: Team | null;
  hasActiveMatch: boolean;
  addModalVisible: boolean;
  editTeamModalVisible: boolean;
  selectedPlayer: Player | null;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditTeamModal: () => void;
  closeEditTeamModal: () => void;
  selectPlayer: (player: Player) => void;
  deselectPlayer: () => void;
  handleStartMatch: () => void;
};

export function useTeamDetailScreen(teamId: string, navigation: Navigation): TeamDetailScreenState {
  const rootNav = useNavigation<NavigationProp<RootTabParamList>>();
  const team = useTeamsStore((s) => s.teams.find((t) => t.id === teamId)) ?? null;
  const hasActiveMatch = useMatchStore((s) => s.currentMatch !== null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editTeamModalVisible, setEditTeamModalVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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

  const openEditTeamModal = useCallback(() => setEditTeamModalVisible(true), []);

  return {
    team,
    hasActiveMatch,
    addModalVisible,
    editTeamModalVisible,
    selectedPlayer,
    openAddModal: () => setAddModalVisible(true),
    closeAddModal: () => setAddModalVisible(false),
    openEditTeamModal,
    closeEditTeamModal: () => setEditTeamModalVisible(false),
    selectPlayer: setSelectedPlayer,
    deselectPlayer: () => setSelectedPlayer(null),
    handleStartMatch: () => {
      rootNav.navigate('Matches', {
        screen: 'MatchSetup',
        params: { homeTeamId: teamId },
      });
    },
  };
}
