import { useTeamsStore } from '../stores/teamsStore';
import type { Player, PlayerPosition, Team } from '../types';
import { generateId } from '../utils/id';

export function createTeam(name: string, colour: string): Team {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error('Team name cannot be empty.');
  }

  const team: Team = {
    id: generateId('t'),
    name: trimmedName,
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
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
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
    name: trimmedName,
    jerseyNumber,
    position,
  };

  useTeamsStore.getState().updatePlayer(teamId, player);
  return player;
}

export function updateTeam(teamId: string, name: string, colour: string): Team {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new Error('Team name cannot be empty.');
  }
  const existingTeam = useTeamsStore.getState().teams.find((t) => t.id === teamId);
  if (!existingTeam) {
    throw new Error('Team not found.');
  }
  const updatedTeam: Team = { ...existingTeam, name: trimmedName, colour };
  useTeamsStore.getState().updateTeam(updatedTeam);
  return updatedTeam;
}

export function addPlayer(
  teamId: string,
  name: string,
  jerseyNumber: number | undefined,
  position: PlayerPosition | undefined,
): Player {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
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
    name: trimmedName,
    jerseyNumber,
    position,
  };

  useTeamsStore.getState().addPlayer(teamId, player);
  return player;
}
