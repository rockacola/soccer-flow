import { create } from 'zustand';

import type { Player, Team } from '../types';

type TeamsStore = {
  teams: Team[];
  loadTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeam: (team: Team) => void;
  deleteTeam: (teamId: string) => void;
  addPlayer: (teamId: string, player: Player) => void;
  updatePlayer: (teamId: string, player: Player) => void;
  deletePlayer: (teamId: string, playerId: string) => void;
};

export const useTeamsStore = create<TeamsStore>((set) => ({
  teams: [],
  loadTeams: (teams) => set({ teams }),
  addTeam: (team) => set((s) => ({ teams: [...s.teams, team] })),
  updateTeam: (team) => set((s) => ({ teams: s.teams.map((t) => (t.id === team.id ? team : t)) })),
  deleteTeam: (teamId) => set((s) => ({ teams: s.teams.filter((t) => t.id !== teamId) })),
  addPlayer: (teamId, player) =>
    set((s) => ({
      teams: s.teams.map((t) => (t.id === teamId ? { ...t, players: [...t.players, player] } : t)),
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
}));
