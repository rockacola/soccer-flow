import palette from '../../constants/palette';
import type { Team } from '../../types';
import {
  addPlayer,
  createTeam,
  deletePlayer,
  deleteTeam,
  updatePlayer,
  updateTeam,
} from '../teamsService';

let mockTeams: Team[] = [];

const mockAddTeam = jest.fn();
const mockUpdateTeam = jest.fn();
const mockDeleteTeam = jest.fn();
const mockAddPlayer = jest.fn();
const mockUpdatePlayer = jest.fn();
const mockDeletePlayer = jest.fn();

jest.mock('../../stores/teamsStore', () => ({
  useTeamsStore: {
    getState: () => ({
      get teams() {
        return mockTeams;
      },
      addTeam: mockAddTeam,
      updateTeam: mockUpdateTeam,
      deleteTeam: mockDeleteTeam,
      addPlayer: mockAddPlayer,
      updatePlayer: mockUpdatePlayer,
      deletePlayer: mockDeletePlayer,
    }),
  },
}));

jest.mock('../../utils/id', () => ({
  generateId: (prefix?: string) => (prefix ? `${prefix}_test` : 'test'),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockTeams = [];
});

// ── createTeam ────────────────────────────────────────────────────────────────

describe('createTeam', () => {
  it('returns a team with the correct shape', () => {
    const team = createTeam('Red Lions', palette.red[500]);
    expect(team).toEqual({
      id: 't_test',
      name: 'Red Lions',
      colour: palette.red[500],
      players: [],
    });
  });

  it('trims whitespace from name', () => {
    const team = createTeam('  Red Lions  ', palette.red[500]);
    expect(team.name).toBe('Red Lions');
  });

  it('calls addTeam on the store', () => {
    const team = createTeam('Red Lions', palette.red[500]);
    expect(mockAddTeam).toHaveBeenCalledWith(team);
  });

  it('throws when name is empty', () => {
    expect(() => createTeam('', palette.red[500])).toThrow('Team name cannot be empty.');
  });

  it('throws when name is only whitespace', () => {
    expect(() => createTeam('   ', palette.red[500])).toThrow('Team name cannot be empty.');
  });
});

// ── deleteTeam ────────────────────────────────────────────────────────────────

describe('deleteTeam', () => {
  it('calls deleteTeam on the store with the teamId', () => {
    deleteTeam('t_abc');
    expect(mockDeleteTeam).toHaveBeenCalledWith('t_abc');
  });
});

// ── addPlayer ─────────────────────────────────────────────────────────────────

describe('addPlayer', () => {
  it('returns a player with the correct shape', () => {
    const player = addPlayer('t_abc', 'Alex Morgan', 13, 'FWD');
    expect(player).toEqual({
      id: 'p_test',
      name: 'Alex Morgan',
      jerseyNumber: 13,
      position: 'FWD',
    });
  });

  it('calls addPlayer on the store', () => {
    const player = addPlayer('t_abc', 'Alex Morgan', 13, 'FWD');
    expect(mockAddPlayer).toHaveBeenCalledWith('t_abc', player);
  });

  it('trims whitespace from name', () => {
    const player = addPlayer('t_abc', '  Alex Morgan  ', 13, 'FWD');
    expect(player.name).toBe('Alex Morgan');
  });

  it('accepts undefined jersey number', () => {
    expect(() => addPlayer('t_abc', 'Alex Morgan', undefined, 'FWD')).not.toThrow();
  });

  it('accepts undefined position', () => {
    expect(() => addPlayer('t_abc', 'Alex Morgan', 13, undefined)).not.toThrow();
  });

  it('throws when name is empty', () => {
    expect(() => addPlayer('t_abc', '', 13, 'FWD')).toThrow('Player name cannot be empty.');
  });

  it('throws when jersey number is 0', () => {
    expect(() => addPlayer('t_abc', 'Alex Morgan', 0, 'FWD')).toThrow(
      'Jersey number must be between 1 and 9999.',
    );
  });

  it('throws when jersey number exceeds 9999', () => {
    expect(() => addPlayer('t_abc', 'Alex Morgan', 10000, 'FWD')).toThrow(
      'Jersey number must be between 1 and 9999.',
    );
  });

  it('throws when jersey number is a float', () => {
    expect(() => addPlayer('t_abc', 'Alex Morgan', 7.5, 'FWD')).toThrow(
      'Jersey number must be between 1 and 9999.',
    );
  });
});

// ── updatePlayer ──────────────────────────────────────────────────────────────

describe('updatePlayer', () => {
  it('returns a player preserving the existing id', () => {
    const player = updatePlayer('t_abc', 'p_existing', 'Alex Morgan', 13, 'FWD');
    expect(player.id).toBe('p_existing');
  });

  it('calls updatePlayer on the store', () => {
    const player = updatePlayer('t_abc', 'p_existing', 'Alex Morgan', 13, 'FWD');
    expect(mockUpdatePlayer).toHaveBeenCalledWith('t_abc', player);
  });

  it('throws when name is empty', () => {
    expect(() => updatePlayer('t_abc', 'p_existing', '', 13, 'FWD')).toThrow(
      'Player name cannot be empty.',
    );
  });

  it('throws when jersey number is invalid', () => {
    expect(() => updatePlayer('t_abc', 'p_existing', 'Alex Morgan', 10000, 'FWD')).toThrow(
      'Jersey number must be between 1 and 9999.',
    );
  });
});

// ── deletePlayer ──────────────────────────────────────────────────────────────

describe('deletePlayer', () => {
  it('calls deletePlayer on the store with teamId and playerId', () => {
    deletePlayer('t_abc', 'p_xyz');
    expect(mockDeletePlayer).toHaveBeenCalledWith('t_abc', 'p_xyz');
  });
});

// ── updateTeam ────────────────────────────────────────────────────────────────

describe('updateTeam', () => {
  const existingTeam: Team = {
    id: 't_1',
    name: 'Red Lions',
    colour: palette.red[500],
    players: [],
  };

  it('throws when name is empty', () => {
    expect(() => updateTeam('t_1', '', palette.red[500])).toThrow('Team name cannot be empty.');
  });

  it('throws when name is only whitespace', () => {
    expect(() => updateTeam('t_1', '   ', palette.red[500])).toThrow('Team name cannot be empty.');
  });

  it('throws when team is not found', () => {
    mockTeams = [];
    expect(() => updateTeam('t_unknown', 'Red Lions', palette.red[500])).toThrow('Team not found.');
  });

  it('returns the updated team with the correct shape', () => {
    mockTeams = [existingTeam];
    const result = updateTeam('t_1', 'Blue Eagles', palette.blue[500]);
    expect(result).toEqual({
      id: 't_1',
      name: 'Blue Eagles',
      colour: palette.blue[500],
      players: [],
    });
  });

  it('trims whitespace from name', () => {
    mockTeams = [existingTeam];
    const result = updateTeam('t_1', '  Blue Eagles  ', palette.blue[500]);
    expect(result.name).toBe('Blue Eagles');
  });

  it('calls updateTeam on the store with the updated team', () => {
    mockTeams = [existingTeam];
    const result = updateTeam('t_1', 'Blue Eagles', palette.blue[500]);
    expect(mockUpdateTeam).toHaveBeenCalledWith(result);
  });
});
