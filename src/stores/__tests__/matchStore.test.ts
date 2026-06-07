import type { Match, MatchSegment } from '../../types';
import { useMatchStore } from '../matchStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const T0 = 1_000_000_000;

const baseSegments: MatchSegment[] = [
  { segmentType: 'period', startedAt: T0 },
  { segmentType: 'break', startedAt: T0 + 2400 * 1000 },
  { segmentType: 'period', startedAt: T0 + 3300 * 1000 },
];

const baseMatch: Match = {
  id: 'm_1',
  homeTeamId: 't_1',
  opponentName: 'Rivals',
  periodDurationMinutes: 40,
  breakDurationMinutes: 15,
  status: 'live',
  segments: baseSegments,
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

// ── setSegments ───────────────────────────────────────────────────────────────

describe('setSegments', () => {
  it('updates the segments array', () => {
    useMatchStore.setState({ currentMatch: baseMatch });
    const newSegments: MatchSegment[] = [
      { segmentType: 'period', startedAt: T0 },
      { segmentType: 'break', startedAt: T0 + 3000 * 1000 }, // extended period 1
      { segmentType: 'period', startedAt: T0 + 3900 * 1000 },
    ];
    useMatchStore.getState().setSegments(newSegments);
    expect(useMatchStore.getState().currentMatch?.segments).toEqual(newSegments);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().setSegments(baseSegments);
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
    const activity = { id: 'a_1', type: 'remark' as const, createdAt: T0 + 60000, text: 'Hello' };
    useMatchStore.getState().addActivity(activity);
    expect(useMatchStore.getState().currentMatch?.activities).toEqual([activity]);
  });

  it('preserves existing activities', () => {
    const existing = { id: 'a_0', type: 'remark' as const, createdAt: T0, text: 'First' };
    useMatchStore.setState({ currentMatch: { ...baseMatch, activities: [existing] } });
    const newActivity = {
      id: 'a_1',
      type: 'remark' as const,
      createdAt: T0 + 60000,
      text: 'Second',
    };
    useMatchStore.getState().addActivity(newActivity);
    expect(useMatchStore.getState().currentMatch?.activities).toHaveLength(2);
  });

  it('does nothing when there is no current match', () => {
    const activity = { id: 'a_1', type: 'remark' as const, createdAt: T0, text: 'Hello' };
    useMatchStore.getState().addActivity(activity);
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});

describe('removeActivity', () => {
  it('removes the activity with the given id', () => {
    const a1 = { id: 'a_1', type: 'remark' as const, createdAt: T0, text: 'One' };
    const a2 = { id: 'a_2', type: 'remark' as const, createdAt: T0 + 10000, text: 'Two' };
    useMatchStore.setState({ currentMatch: { ...baseMatch, activities: [a1, a2] } });
    useMatchStore.getState().removeActivity('a_1');
    expect(useMatchStore.getState().currentMatch?.activities).toEqual([a2]);
  });

  it('does nothing when there is no current match', () => {
    useMatchStore.getState().removeActivity('a_1');
    expect(useMatchStore.getState().currentMatch).toBeNull();
  });
});
