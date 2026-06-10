import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEY_TEAMS } from '../constants/storageKeys';
import type { Player, Team } from '../types';

type TeamsStore = {
  teams: Team[];
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  removeTeamsByIds: (ids: string[]) => void;
  addPlayer: (teamId: string, player: Player) => void;
  updatePlayer: (teamId: string, player: Player) => void;
  deletePlayer: (teamId: string, playerId: string) => void;
};

export const useTeamsStore = create<TeamsStore>()(
  persist(
    (set) => ({
      teams: [],
      addTeam: (team) => set((s) => ({ teams: [...s.teams, team] })),
      updateTeam: (team) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === team.id ? team : t)) })),
      deleteTeam: (teamId) => set((s) => ({ teams: s.teams.filter((t) => t.id !== teamId) })),
      removeTeamsByIds: (ids) =>
        set((s) => ({ teams: s.teams.filter((t) => !ids.includes(t.id)) })),
      addPlayer: (teamId, player) =>
        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === teamId ? { ...t, players: [...t.players, player] } : t,
          ),
        })),
      updatePlayer: (teamId, player) =>
        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === teamId
              ? { ...t, players: t.players.map((p) => (p.id === player.id ? player : p)) }
              : t,
          ),
        })),
      deletePlayer: (teamId, playerId) =>
        set((s) => ({
          teams: s.teams.map((t) =>
            t.id === teamId ? { ...t, players: t.players.filter((p) => p.id !== playerId) } : t,
          ),
        })),
    }),
    {
      name: STORAGE_KEY_TEAMS,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
