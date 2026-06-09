import { useTeamsStore } from '../stores/teamsStore';
import type { Player, PlayerPosition, Team } from '../types';
import { generateId } from '../utils/id';

export function createTeam(name: string, colour: string): Team {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Team name cannot be empty.');
  }

  const team: Team = {
    id: generateId('t'),
    name: trimmed,
    colour,
    players: [],
  };

  useTeamsStore.getState().addTeam(team);
  return team;
}

export function deleteTeam(teamId: string): void {
  useTeamsStore.getState().deleteTeam(teamId);
}

export function deletePlayer(teamId: string, playerId: string): void {
  useTeamsStore.getState().deletePlayer(teamId, playerId);
}

export function updatePlayer(
  teamId: string,
  playerId: string,
  name: string,
  jerseyNumber: number | undefined,
  position: PlayerPosition | undefined,
): Player {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Player name cannot be empty.');
  }
  if (
    jerseyNumber !== undefined &&
    (!Number.isInteger(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 9999)
  ) {
    throw new Error('Jersey number must be between 1 and 9999.');
  }

  const player: Player = {
    id: playerId,
    name: trimmed,
    jerseyNumber,
    position,
  };

  useTeamsStore.getState().updatePlayer(teamId, player);
  return player;
}

export function updateTeam(teamId: string, name: string, colour: string): Team {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Team name cannot be empty.');
  }
  const existing = useTeamsStore.getState().teams.find((t) => t.id === teamId);
  if (!existing) {
    throw new Error('Team not found.');
  }
  const updated: Team = { ...existing, name: trimmed, colour };
  useTeamsStore.getState().updateTeam(updated);
  return updated;
}

export function addPlayer(
  teamId: string,
  name: string,
  jerseyNumber: number | undefined,
  position: PlayerPosition | undefined,
): Player {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    throw new Error('Player name cannot be empty.');
  }
  if (
    jerseyNumber !== undefined &&
    (!Number.isInteger(jerseyNumber) || jerseyNumber < 1 || jerseyNumber > 9999)
  ) {
    throw new Error('Jersey number must be between 1 and 9999.');
  }

  const player: Player = {
    id: generateId('p'),
    name: trimmed,
    jerseyNumber,
    position,
  };

  useTeamsStore.getState().addPlayer(teamId, player);
  return player;
}
