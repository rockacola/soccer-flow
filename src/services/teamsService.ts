import { useTeamsStore } from '../stores/teamsStore';
import type { Team } from '../types';
import { generateId } from '../utils/id';

export function createTeam(name: string, colour: string): Team {
  const trimmed = name.trim();
  if (trimmed.length === 0) throw new Error('Team name cannot be empty.');

  const team: Team = {
    id: generateId('t'),
    name: trimmed,
    colour,
    players: [],
  };

  useTeamsStore.getState().addTeam(team);
  return team;
}
