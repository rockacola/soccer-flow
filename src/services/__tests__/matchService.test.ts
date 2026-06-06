import type { Match } from '../../types';
import {
  adjustScore,
  adjustSegments,
  createAndStartMatch,
  finishMatch,
  pauseMatch,
  recordGoal,
  recordRemark,
  recordSubstitution,
  resumeMatch,
  tickTimer,
} from '../matchService';

// ── Mutable match state shared across mock calls ──────────────────────────────

let mockCurrentMatch: Match | null = null;

const mockStartMatch = jest.fn();
const mockTick = jest.fn();
const mockPauseMatch = jest.fn();
const mockResumeMatch = jest.fn();
const mockFinishMatch = jest.fn();
const mockSetSegmentActuals = jest.fn();
const mockSetScore = jest.fn();
const mockAddActivity = jest.fn();

jest.mock('../../stores/matchStore', () => ({
  useMatchStore: {
    getState: () => ({
      get currentMatch() {
        return mockCurrentMatch;
      },
      startMatch: mockStartMatch,
      tick: mockTick,
      pauseMatch: mockPauseMatch,
      resumeMatch: mockResumeMatch,
      finishMatch: mockFinishMatch,
      setSegmentActuals: mockSetSegmentActuals,
      setScore: mockSetScore,
      addActivity: mockAddActivity,
    }),
  },
}));

jest.mock('../../stores/teamsStore', () => ({
  useTeamsStore: {
    getState: () => ({
      teams: [{ id: 't_home', name: 'Home FC', colour: '#FF0000', players: [] }],
    }),
  },
}));

jest.mock('../../utils/id', () => ({
  generateId: (prefix?: string) => (prefix ? `${prefix}_test` : 'test'),
}));

const baseLiveMatch: Match = {
  id: 'm_test',
  homeTeamId: 't_home',
  opponentName: 'Rivals',
  periodCount: 2,
  periodDurationMinutes: 40,
  breakDurationMinutes: 15,
  status: 'live',
  startedAt: 1000000,
  elapsedSeconds: 0,
  segmentActualSeconds: [],
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
    expect(() => createAndStartMatch('t_unknown', 'Rivals', 40, 15)).toThrow(
      'Selected team not found.',
    );
  });

  it('calls startMatch with the correct match shape', () => {
    createAndStartMatch('t_home', 'Rivals', 40, 15);
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
  });

  it('trims whitespace from opponentName', () => {
    createAndStartMatch('t_home', '  Rivals  ', 40, 15);
    expect(mockStartMatch).toHaveBeenCalledWith(
      expect.objectContaining({ opponentName: 'Rivals' }),
    );
  });
});

// ── tickTimer ─────────────────────────────────────────────────────────────────

describe('tickTimer', () => {
  it('does nothing when there is no current match', () => {
    mockCurrentMatch = null;
    tickTimer();
    expect(mockTick).not.toHaveBeenCalled();
  });

  it('does nothing when match is paused', () => {
    mockCurrentMatch = { ...baseLiveMatch, status: 'paused' };
    tickTimer();
    expect(mockTick).not.toHaveBeenCalled();
  });

  it('advances elapsed by 1 when match is live', () => {
    mockCurrentMatch = { ...baseLiveMatch, elapsedSeconds: 42 };
    tickTimer();
    expect(mockTick).toHaveBeenCalledWith(43);
  });
});

// ── pauseMatch / resumeMatch / finishMatch ────────────────────────────────────

describe('pauseMatch', () => {
  it('delegates to the store', () => {
    pauseMatch();
    expect(mockPauseMatch).toHaveBeenCalledTimes(1);
  });
});

describe('resumeMatch', () => {
  it('delegates to the store', () => {
    resumeMatch();
    expect(mockResumeMatch).toHaveBeenCalledTimes(1);
  });
});

describe('finishMatch', () => {
  it('delegates to the store', () => {
    finishMatch();
    expect(mockFinishMatch).toHaveBeenCalledTimes(1);
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
    recordGoal('home', 'p_abc', 1200);
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'goal',
      elapsedSeconds: 1200,
      side: 'home',
      playerId: 'p_abc',
    });
  });

  it('accepts null playerId', () => {
    recordGoal('away', null, 600);
    expect(mockAddActivity).toHaveBeenCalledWith(
      expect.objectContaining({ playerId: null, side: 'away' }),
    );
  });
});

// ── recordSubstitution ────────────────────────────────────────────────────────

describe('recordSubstitution', () => {
  it('throws when playerOut and playerIn are the same', () => {
    expect(() => recordSubstitution('home', 'p_1', 'p_1', 900)).toThrow(
      'Player off and player on must be different.',
    );
  });

  it('adds a substitution activity with the correct shape', () => {
    recordSubstitution('home', 'p_out', 'p_in', 900);
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'substitution',
      elapsedSeconds: 900,
      side: 'home',
      playerOutId: 'p_out',
      playerInId: 'p_in',
    });
  });
});

// ── recordRemark ──────────────────────────────────────────────────────────────

describe('recordRemark', () => {
  it('throws when text is empty', () => {
    expect(() => recordRemark('', 0)).toThrow('Remark cannot be empty.');
  });

  it('throws when text is only whitespace', () => {
    expect(() => recordRemark('   ', 0)).toThrow('Remark cannot be empty.');
  });

  it('trims whitespace from text', () => {
    recordRemark('  Great save!  ', 500);
    expect(mockAddActivity).toHaveBeenCalledWith(expect.objectContaining({ text: 'Great save!' }));
  });

  it('adds a remark activity with the correct shape', () => {
    recordRemark('Corner kick', 300);
    expect(mockAddActivity).toHaveBeenCalledWith({
      id: 'a_test',
      type: 'remark',
      elapsedSeconds: 300,
      text: 'Corner kick',
    });
  });
});

// ── adjustSegments ────────────────────────────────────────────────────────────

describe('adjustSegments', () => {
  it('does nothing when there is no current match', () => {
    mockCurrentMatch = null;
    adjustSegments([2400, 900]);
    expect(mockSetSegmentActuals).not.toHaveBeenCalled();
    expect(mockTick).not.toHaveBeenCalled();
  });

  it('preserves elapsed position within the current period', () => {
    // 20 min into period 1, new actuals keep the same durations
    mockCurrentMatch = { ...baseLiveMatch, elapsedSeconds: 1200 };
    adjustSegments([2400, 900]);
    expect(mockSetSegmentActuals).toHaveBeenCalledWith([2400, 900]);
    // base for seg 0 is 0, withinSeconds is 1200 → tick(1200)
    expect(mockTick).toHaveBeenCalledWith(1200);
  });

  it('re-anchors elapsed when current period is extended', () => {
    // 5 min into period 2, match elapsed = 3300 + 300 = 3600
    mockCurrentMatch = { ...baseLiveMatch, elapsedSeconds: 3600 };
    // New actuals: period 1 = 2400, break = 900 (unchanged), so period 2 starts at 3300
    const newActuals = [2400, 900];
    adjustSegments(newActuals);
    // phase: period 2, withinSeconds = 3600 - 3300 = 300
    // base for period 2 (segIdx=2): sum of seg0+seg1 = 2400+900 = 3300
    expect(mockTick).toHaveBeenCalledWith(3300 + 300);
  });
});
