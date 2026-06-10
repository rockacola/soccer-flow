import palette from '../../constants/palette';
import type { Player, Team } from '../../types';
import { useTeamsStore } from '../teamsStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const player1: Player = { id: 'p_1', name: 'Alice', jerseyNumber: 7, position: 'FWD' };
const player2: Player = { id: 'p_2', name: 'Bob', jerseyNumber: 10, position: 'MID' };

const team1: Team = { id: 't_1', name: 'Red Lions', colour: palette.red[500], players: [player1] };
const team2: Team = { id: 't_2', name: 'Blue Eagles', colour: palette.blue[500], players: [] };

beforeEach(() => {
  useTeamsStore.setState({ teams: [] });
});

// ── addTeam ───────────────────────────────────────────────────────────────────

describe('addTeam', () => {
  it('adds a team to the list', () => {
    useTeamsStore.getState().addTeam(team1);
    expect(useTeamsStore.getState().teams).toEqual([team1]);
  });

  it('appends when teams already exist', () => {
    useTeamsStore.setState({ teams: [team1] });
    useTeamsStore.getState().addTeam(team2);
    expect(useTeamsStore.getState().teams).toHaveLength(2);
  });
});

// ── updateTeam ────────────────────────────────────────────────────────────────

describe('updateTeam', () => {
  it('replaces the team with the matching id', () => {
    useTeamsStore.setState({ teams: [team1, team2] });
    const updated = { ...team1, name: 'Red Dragons' };
    useTeamsStore.getState().updateTeam(updated);
    const teams = useTeamsStore.getState().teams;
    expect(teams.find((t) => t.id === 't_1')?.name).toBe('Red Dragons');
  });

  it('leaves other teams unchanged', () => {
    useTeamsStore.setState({ teams: [team1, team2] });
    useTeamsStore.getState().updateTeam({ ...team1, name: 'Red Dragons' });
    expect(useTeamsStore.getState().teams.find((t) => t.id === 't_2')).toEqual(team2);
  });
});

// ── deleteTeam ────────────────────────────────────────────────────────────────

describe('deleteTeam', () => {
  it('removes the team with the matching id', () => {
    useTeamsStore.setState({ teams: [team1, team2] });
    useTeamsStore.getState().deleteTeam('t_1');
    const teams = useTeamsStore.getState().teams;
    expect(teams).toHaveLength(1);
    expect(teams[0].id).toBe('t_2');
  });

  it('does nothing when the id does not exist', () => {
    useTeamsStore.setState({ teams: [team1] });
    useTeamsStore.getState().deleteTeam('t_unknown');
    expect(useTeamsStore.getState().teams).toHaveLength(1);
  });
});

// ── addPlayer ─────────────────────────────────────────────────────────────────

describe('addPlayer', () => {
  it('adds a player to the correct team', () => {
    useTeamsStore.setState({ teams: [{ ...team1, players: [] }] });
    useTeamsStore.getState().addPlayer('t_1', player1);
    expect(useTeamsStore.getState().teams[0].players).toEqual([player1]);
  });

  it('does not affect other teams', () => {
    useTeamsStore.setState({ teams: [team1, { ...team2, players: [] }] });
    useTeamsStore.getState().addPlayer('t_1', player2);
    expect(useTeamsStore.getState().teams.find((t) => t.id === 't_2')?.players).toHaveLength(0);
  });
});

// ── updatePlayer ──────────────────────────────────────────────────────────────

describe('updatePlayer', () => {
  it('replaces the player with the matching id within the team', () => {
    useTeamsStore.setState({ teams: [{ ...team1, players: [player1, player2] }] });
    const updated = { ...player1, name: 'Alice Updated', jerseyNumber: 99 };
    useTeamsStore.getState().updatePlayer('t_1', updated);
    const players = useTeamsStore.getState().teams[0].players;
    expect(players.find((p) => p.id === 'p_1')?.name).toBe('Alice Updated');
  });

  it('leaves other players unchanged', () => {
    useTeamsStore.setState({ teams: [{ ...team1, players: [player1, player2] }] });
    useTeamsStore.getState().updatePlayer('t_1', { ...player1, name: 'Alice Updated' });
    expect(useTeamsStore.getState().teams[0].players.find((p) => p.id === 'p_2')).toEqual(player2);
  });
});

// ── deletePlayer ──────────────────────────────────────────────────────────────

describe('deletePlayer', () => {
  it('removes the player with the matching id', () => {
    useTeamsStore.setState({ teams: [{ ...team1, players: [player1, player2] }] });
    useTeamsStore.getState().deletePlayer('t_1', 'p_1');
    expect(useTeamsStore.getState().teams[0].players).toEqual([player2]);
  });

  it('does nothing when the player id does not exist', () => {
    useTeamsStore.setState({ teams: [{ ...team1, players: [player1] }] });
    useTeamsStore.getState().deletePlayer('t_1', 'p_unknown');
    expect(useTeamsStore.getState().teams[0].players).toHaveLength(1);
  });
});
