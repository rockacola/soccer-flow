import type { Match } from '../../types';
import { useMatchStore } from '../matchStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const baseMatch: Match = {
  id: 'm_1',
  homeTeamId: 't_1',
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
  useMatchStore.setState({ currentMatch: null, pastMatches: [] });
});

// ── startMatch ────────────────────────────────────────────────────────────────

describe('startMatch', () => {
  it('sets currentMatch', () => {
    useMatchStore.getState().startMatch(baseMatch);
    expect(useMatchStore.getState().currentMatch).toEqual(baseMatch);
  });
});

// ── pauseMatch ────────────────────────────────────────────────────────────────

describe('pauseMatch', () => {
  it('sets status to paused', () => {
    useMatchStore.setState({ currentMatch: { ...baseMatch, status: 'live' } });
    useMatchStore.getState().pauseMatch();
    expect(useMatchStore.getState().currentMatch?.status).toBe('paused');
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().pauseMatch();
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

// ── resumeMatch ───────────────────────────────────────────────────────────────

describe('resumeMatch', () => {
  it('sets status to live', () => {
    useMatchStore.setState({ currentMatch: { ...baseMatch, status: 'paused' } });
    useMatchStore.getState().resumeMatch();
    expect(useMatchStore.getState().currentMatch?.status).toBe('live');
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().resumeMatch();
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

// ── finishMatch ───────────────────────────────────────────────────────────────

describe('finishMatch', () => {
  it('clears currentMatch', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    useMatchStore.getState().finishMatch();
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });

  it('adds the match to pastMatches with status finished', () => {
    useMatchStore.setState({ currentMatch: baseMatch, pastMatches: [] });
    useMatchStore.getState().finishMatch();
    const past = useMatchStore.getState().pastMatches;
    expect(past).toHaveLength(1);
    expect(past[0]).toEqual({ ...baseMatch, status: 'finished' });
  });

  it('appends to existing pastMatches', () => {
    const existing: Match = { ...baseMatch, id: 'm_old', status: 'finished' };
    useMatchStore.setState({ currentMatch: baseMatch, pastMatches: [existing] });
    useMatchStore.getState().finishMatch();
    expect(useMatchStore.getState().pastMatches).toHaveLength(2);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().finishMatch();
    expect(useMatchStore.getState().pastMatches).toHaveLength(0);
  });
});

// ── tick ──────────────────────────────────────────────────────────────────────

describe('tick', () => {
  it('updates elapsedSeconds', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    useMatchStore.getState().tick(120);
    expect(useMatchStore.getState().currentMatch?.elapsedSeconds).toBe(120);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().tick(120);
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

// ── setSegmentActuals ─────────────────────────────────────────────────────────

describe('setSegmentActuals', () => {
  it('updates segmentActualSeconds', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    useMatchStore.getState().setSegmentActuals([2400, 600]);
    expect(useMatchStore.getState().currentMatch?.segmentActualSeconds).toEqual([2400, 600]);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().setSegmentActuals([2400]);
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

// ── setScore ──────────────────────────────────────────────────────────────────

describe('setScore', () => {
  it('updates both scores', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    useMatchStore.getState().setScore(2, 1);
    const match = useMatchStore.getState().currentMatch;
    expect(match?.homeScore).toBe(2);
    expect(match?.awayScore).toBe(1);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().setScore(1, 0);
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

// ── addActivity / removeActivity ──────────────────────────────────────────────

describe('addActivity', () => {
  it('appends an activity to the list', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    const activity = { id: 'a_1', type: 'remark' as const, elapsedSeconds: 300, text: 'Hello' };
    useMatchStore.getState().addActivity(activity);
    expect(useMatchStore.getState().currentMatch?.activities).toEqual([activity]);
  });

  it('preserves existing activities', () => {
    const existing = { id: 'a_0', type: 'remark' as const, elapsedSeconds: 0, text: 'First' };
    useMatchStore.setState({ currentMatch: { ...baseMatch, activities: [existing] } });
    const newActivity = {
      id: 'a_1',
      type: 'remark' as const,
      elapsedSeconds: 100,
      text: 'Second',
    };
    useMatchStore.getState().addActivity(newActivity);
    expect(useMatchStore.getState().currentMatch?.activities).toHaveLength(2);
  });

  it('does nothing when there is no current match', () => {
    const activity = { id: 'a_1', type: 'remark' as const, elapsedSeconds: 0, text: 'Hello' };
    useMatchStore.getState().addActivity(activity);
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

describe('removeActivity', () => {
  it('removes the activity with the given id', () => {
    const a1 = { id: 'a_1', type: 'remark' as const, elapsedSeconds: 0, text: 'One' };
    const a2 = { id: 'a_2', type: 'remark' as const, elapsedSeconds: 10, text: 'Two' };
    useMatchStore.setState({ currentMatch: { ...baseMatch, activities: [a1, a2] } });
    useMatchStore.getState().removeActivity('a_1');
    expect(useMatchStore.getState().currentMatch?.activities).toEqual([a2]);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().removeActivity('a_1');
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});
