import type { Match, MatchActivity, MatchSegment } from '../../types';
import {
  adjustScore,
  adjustTimestamps,
  createAndStartMatch,
  deleteActivity,
  deletePastMatch,
  finishMatch,
  recordGoal,
  recordRemark,
  recordSubstitution,
  updateActivity,
} from '../matchService';

// ── Mutable match state shared across mock calls ──────────────────────────────

let mockCurrentMatch: Match | null = null;

const mockStartMatch = jest.fn();
const mockFinishMatch = jest.fn();
const mockSetSegments = jest.fn();
const mockSetScore = jest.fn();
const mockAddActivity = jest.fn();
const mockRemoveActivity = jest.fn();
const mockUpdateActivity = jest.fn();
const mockDeletePastMatch = jest.fn();

jest.mock('../../stores/matchStore', () => ({
  useMatchStore: {
    getState: () => ({
      get currentMatch() {
        return mockCurrentMatch;
      },
      startMatch: mockStartMatch,
      finishMatch: mockFinishMatch,
      setSegments: mockSetSegments,
      setScore: mockSetScore,
      addActivity: mockAddActivity,
      removeActivity: mockRemoveActivity,
      updateActivity: mockUpdateActivity,
      deletePastMatch: mockDeletePastMatch,
    }),
  },
}));

jest.mock('../../stores/teamsStore', () => {
  const pal = require('../../constants/palette').default;
  return {
    useTeamsStore: {
      getState: () => ({
        teams: [{ id: 't_home', name: 'Home FC', colour: pal.red[500], players: [] }],
      }),
    },
  };
});

jest.mock('../../utils/id', () => ({
  generateId: (prefix?: string) => (prefix ? `${prefix}_test` : 'test'),
}));

const T0 = 1_000_000_000;

const baseSegments: MatchSegment[] = [
  { segmentType: 'period', startedAt: T0 },
  { segmentType: 'break', startedAt: T0 + 2400 * 1000 },
  { segmentType: 'period', startedAt: T0 + 3300 * 1000 },
];

const baseLiveMatch: Match = {
  id: 'm_test',
  homeTeamId: 't_home',
  opponentName: 'Rivals',
  periodDurationMinutes: 40,
  breakDurationMinutes: 15,
  status: 'live',
  segments: baseSegments,
  endedAt: null,
  homeScore: 0,
  awayScore: 0,
  activities: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockCurrentMatch = null;
});

// ── createAndStartMatch ───────────────────────────────────────────────────────

describe('createAndStartMatch', () => {
  it('throws when team is not found', () => {
    expect(() => createAndStartMatch('t_unknown', 'Rivals', 2, 40, 15)).toThrow(
      'Selected team not found.',
    );
  });

  it('calls startMatch with the correct match shape', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0);
    createAndStartMatch('t_home', 'Rivals', 2, 40, 15);
    expect(mockStartMatch).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'm_test',
        homeTeamId: 't_home',
        opponentName: 'Rivals',
        periodDurationMinutes: 40,
        breakDurationMinutes: 15,
        status: 'live',
        homeScore: 0,
        awayScore: 0,
        activities: [],
      }),
    );
    jest.restoreAllMocks();
  });

  it('pre-computes correct segment timestamps', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0);
    createAndStartMatch('t_home', 'Rivals', 2, 40, 15);
    const match = mockStartMatch.mock.calls[0][0] as Match;
    expect(match.segments).toEqual([
      { segmentType: 'period', startedAt: T0 },
      { segmentType: 'break', startedAt: T0 + 2400 * 1000 },
      { segmentType: 'period', startedAt: T0 + 3300 * 1000 },
    ]);
    jest.restoreAllMocks();
  });

  it('trims whitespace from opponentName', () => {
    createAndStartMatch('t_home', '  Rivals  ', 2, 40, 15);
    expect(mockStartMatch).toHaveBeenCalledWith(
      expect.objectContaining({ opponentName: 'Rivals' }),
    );
  });
});

// ── finishMatch ───────────────────────────────────────────────────────────────

describe('finishMatch', () => {
  it('delegates to the store', () => {
    finishMatch();
    expect(mockFinishMatch).toHaveBeenCalledTimes(1);
  });
});

// ── adjustTimestamps ──────────────────────────────────────────────────────────

describe('adjustTimestamps', () => {
  it('delegates new segments to the store', () => {
    const newSegments: MatchSegment[] = [
      { segmentType: 'period', startedAt: T0 },
      { segmentType: 'break', startedAt: T0 + 3000 * 1000 },
      { segmentType: 'period', startedAt: T0 + 3900 * 1000 },
    ];
    adjustTimestamps(newSegments);
    expect(mockSetSegments).toHaveBeenCalledWith(newSegments, undefined);
  });

  it('passes newEndedAt to the store when provided', () => {
    const newEndedAt = T0 + 5000 * 1000;
    adjustTimestamps(baseSegments, newEndedAt);
    expect(mockSetSegments).toHaveBeenCalledWith(baseSegments, newEndedAt);
  });
});

// ── deletePastMatch ───────────────────────────────────────────────────────────

describe('deletePastMatch', () => {
  it('delegates to the store', () => {
    deletePastMatch('m_123');
    expect(mockDeletePastMatch).toHaveBeenCalledWith('m_123');
  });
});

// ── deleteActivity ────────────────────────────────────────────────────────────

describe('deleteActivity', () => {
  it('delegates to the store', () => {
    deleteActivity('a_abc');
    expect(mockRemoveActivity).toHaveBeenCalledWith('a_abc');
  });
});

// ── updateActivity ────────────────────────────────────────────────────────────

describe('updateActivity', () => {
  it('delegates to the store with the activity id and updated activity', () => {
    const activity: MatchActivity = {
      id: 'a_1',
      type: 'remark',
      createdAt: T0,
      text: 'Updated note',
    };
    updateActivity(activity);
    expect(mockUpdateActivity).toHaveBeenCalledWith('a_1', activity);
  });
});

// ── adjustScore ───────────────────────────────────────────────────────────────

describe('adjustScore', () => {
  it('does nothing when there is no current match', () => {
    mockCurrentMatch = null;
    adjustScore('home', 1);
    expect(mockSetScore).not.toHaveBeenCalled();
  });

  it('increments home score', () => {
    mockCurrentMatch = { ...baseLiveMatch, homeScore: 1, awayScore: 2 };
    adjustScore('home', 1);
    expect(mockSetScore).toHaveBeenCalledWith(2, 2);
  });

  it('increments away score', () => {
    mockCurrentMatch = { ...baseLiveMatch, homeScore: 1, awayScore: 2 };
    adjustScore('away', 1);
    expect(mockSetScore).toHaveBeenCalledWith(1, 3);
  });

  it('clamps home score to 0', () => {
    mockCurrentMatch = { ...baseLiveMatch, homeScore: 0, awayScore: 0 };
    adjustScore('home', -1);
    expect(mockSetScore).toHaveBeenCalledWith(0, 0);
  });

  it('clamps away score to 0', () => {
    mockCurrentMatch = { ...baseLiveMatch, homeScore: 0, awayScore: 0 };
    adjustScore('away', -1);
    expect(mockSetScore).toHaveBeenCalledWith(0, 0);
  });
});

// ── recordGoal ────────────────────────────────────────────────────────────────

describe('recordGoal', () => {
  it('adds a goal activity with the correct shape', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0 + 60000);
    recordGoal('home', 'p_abc');
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'goal',
      createdAt: T0 + 60000,
      side: 'home',
      playerId: 'p_abc',
    });
    jest.restoreAllMocks();
  });

  it('accepts null playerId', () => {
    recordGoal('away', null);
    expect(mockAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({ playerId: null, side: 'away' }),
    );
  });
});

// ── recordSubstitution ────────────────────────────────────────────────────────

describe('recordSubstitution', () => {
  it('throws when playerOut and playerIn are the same', () => {
    expect(() => recordSubstitution('home', 'p_1', 'p_1')).toThrow(
      'Player off and player on must be different.',
    );
  });

  it('adds a substitution activity with the correct shape', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0 + 60000);
    recordSubstitution('home', 'p_out', 'p_in');
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'substitution',
      createdAt: T0 + 60000,
      side: 'home',
      playerOutId: 'p_out',
      playerInId: 'p_in',
    });
    jest.restoreAllMocks();
  });
});

// ── recordRemark ──────────────────────────────────────────────────────────────

describe('recordRemark', () => {
  it('throws when text is empty', () => {
    expect(() => recordRemark('')).toThrow('Remark cannot be empty.');
  });

  it('throws when text is only whitespace', () => {
    expect(() => recordRemark('   ')).toThrow('Remark cannot be empty.');
  });

  it('trims whitespace from text', () => {
    recordRemark('  Great save!  ');
    expect(mockAddActivity).toHaveBeenCalledWith(expect.objectContaining({ text: 'Great save!' }));
  });

  it('adds a remark activity with the correct shape', () => {
    jest.spyOn(Date, 'now').mockReturnValue(T0 + 60000);
    recordRemark('Corner kick');
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'remark',
      createdAt: T0 + 60000,
      text: 'Corner kick',
    });
    jest.restoreAllMocks();
  });
});
