import type { Match, MatchActivity, MatchSegment, Player } from '../../types';
import {
  buildScorerRows,
  buildSegmentGroups,
  buildSegments,
  computePhase,
  computeSegmentWindow,
  phaseLabel,
  resolveGoalPlayerId,
  resolveOpponent,
  resolveTeamName,
  scorerRowId,
  scorerRowPlayerId,
  segmentLabel,
} from '../match';

// Standard 2-period match: T0, P=40min (2400s), B=15min (900s)
// Segment timeline:
//   period 1:  T0  → T0+2400s
//   break:     T0+2400s → T0+3300s
//   period 2:  T0+3300s → …
const T0 = 1_000_000_000;
const P = 2400 * 1000;
const B = 900 * 1000;

function twoPeriodsSegments(): MatchSegment[] {
  return [
    { segmentType: 'period', startedAt: T0 },
    { segmentType: 'break', startedAt: T0 + P },
    { segmentType: 'period', startedAt: T0 + P + B },
  ];
}

describe('computePhase', () => {
  describe('two-period match', () => {
    const segs = twoPeriodsSegments();

    it('returns period 1 at start', () => {
      expect(computePhase(T0, segs)).toEqual({ type: 'period', number: 1, withinSeconds: 0 });
    });

    it('returns period 1 mid-period', () => {
      expect(computePhase(T0 + 1200 * 1000, segs)).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 1200,
      });
    });

    it('returns period 1 at last ms before break', () => {
      expect(computePhase(T0 + P - 1, segs)).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 2399,
      });
    });

    it('returns break at period 1 boundary', () => {
      expect(computePhase(T0 + P, segs)).toEqual({ type: 'break', after: 1, withinSeconds: 0 });
    });

    it('returns break mid-break', () => {
      expect(computePhase(T0 + P + 300 * 1000, segs)).toEqual({
        type: 'break',
        after: 1,
        withinSeconds: 300,
      });
    });

    it('returns period 2 at start of second period', () => {
      expect(computePhase(T0 + P + B, segs)).toEqual({
        type: 'period',
        number: 2,
        withinSeconds: 0,
      });
    });

    it('clamps to period 2 beyond last segment start', () => {
      expect(computePhase(T0 + P + B + 9999 * 1000, segs)).toEqual({
        type: 'period',
        number: 2,
        withinSeconds: 9999,
      });
    });

    it('clamps withinSeconds to 0 when now is before first segment', () => {
      expect(computePhase(T0 - 5000, segs)).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 0,
      });
    });
  });

  describe('adjusting segment timestamps changes phase boundaries', () => {
    it('break starts earlier when period 1 shortened', () => {
      const segs: MatchSegment[] = [
        { segmentType: 'period', startedAt: T0 },
        { segmentType: 'break', startedAt: T0 + 1800 * 1000 }, // 30 min period
        { segmentType: 'period', startedAt: T0 + 2700 * 1000 },
      ];
      expect(computePhase(T0 + 1800 * 1000, segs)).toEqual({
        type: 'break',
        after: 1,
        withinSeconds: 0,
      });
    });
  });

  describe('four-period match', () => {
    it('returns period 3 correctly', () => {
      // 20min periods, 5min breaks: P=1200s, B=300s
      const segs = buildSegments(T0, 4, 20, 5);
      // period 3 starts at T0 + (1200+300+1200+300)*1000
      const period3Start = T0 + (1200 + 300 + 1200 + 300) * 1000;
      expect(computePhase(period3Start, segs)).toEqual({
        type: 'period',
        number: 3,
        withinSeconds: 0,
      });
    });
  });
});

describe('buildSegments', () => {
  it('builds correct segment count for 2 periods', () => {
    const segs = buildSegments(T0, 2, 40, 15);
    expect(segs).toHaveLength(3); // period, break, period
    expect(segs[0]).toEqual({ segmentType: 'period', startedAt: T0 });
    expect(segs[1]).toEqual({ segmentType: 'break', startedAt: T0 + 2400 * 1000 });
    expect(segs[2]).toEqual({ segmentType: 'period', startedAt: T0 + 3300 * 1000 });
  });

  it('builds correct segment count for 4 periods', () => {
    const segs = buildSegments(T0, 4, 20, 5);
    expect(segs).toHaveLength(7); // p, b, p, b, p, b, p
    expect(segs.filter((s) => s.segmentType === 'period')).toHaveLength(4);
    expect(segs.filter((s) => s.segmentType === 'break')).toHaveLength(3);
  });

  it('builds a single period with no breaks for periodCount 1', () => {
    const segs = buildSegments(T0, 1, 45, 15);
    expect(segs).toHaveLength(1);
    expect(segs[0]).toEqual({ segmentType: 'period', startedAt: T0 });
  });
});

describe('phaseLabel', () => {
  const segs2 = twoPeriodsSegments();
  const segs4 = buildSegments(T0, 4, 20, 5);

  it('labels period 1 as "1st Period"', () => {
    expect(phaseLabel({ type: 'period', number: 1, withinSeconds: 0 }, segs2)).toBe('1st Period');
  });

  it('labels period 2 as "2nd Period"', () => {
    expect(phaseLabel({ type: 'period', number: 2, withinSeconds: 0 }, segs2)).toBe('2nd Period');
  });

  it('labels the break as "Half Time" in a 2-period match', () => {
    expect(phaseLabel({ type: 'break', after: 1, withinSeconds: 0 }, segs2)).toBe('Half Time');
  });

  it('labels breaks as "Break" in a 4-period match', () => {
    expect(phaseLabel({ type: 'break', after: 1, withinSeconds: 0 }, segs4)).toBe('Break');
    expect(phaseLabel({ type: 'break', after: 2, withinSeconds: 0 }, segs4)).toBe('Break');
  });

  it('labels period 3 in a 4-period match', () => {
    expect(phaseLabel({ type: 'period', number: 3, withinSeconds: 0 }, segs4)).toBe('3rd Period');
  });
});

describe('computeSegmentWindow', () => {
  const segs = twoPeriodsSegments(); // [period@T0, break@T0+P, period@T0+P+B]

  it('uses the next segment startedAt as endAt when one exists', () => {
    // During period 1, the next segment (break) defines the end
    const result = computeSegmentWindow(T0 + 60 * 1000, segs, null, 40, 15);
    expect(result.startedAt).toBe(T0);
    expect(result.endAt).toBe(T0 + P);
  });

  it('uses endedAt as endAt when in the last segment and match is finished', () => {
    const endedAt = T0 + P + B + 2400 * 1000;
    const result = computeSegmentWindow(T0 + P + B + 1200 * 1000, segs, endedAt, 40, 15);
    expect(result.startedAt).toBe(T0 + P + B);
    expect(result.endAt).toBe(endedAt);
  });

  it('estimates endAt from periodDurationMinutes when last segment is a period and match is ongoing', () => {
    const result = computeSegmentWindow(T0 + P + B + 1200 * 1000, segs, null, 40, 15);
    expect(result.startedAt).toBe(T0 + P + B);
    expect(result.endAt).toBe(T0 + P + B + P);
  });

  it('estimates endAt from breakDurationMinutes when last segment is a break and match is ongoing', () => {
    // Single-period match where the break is the last segment
    const segsBreakLast: MatchSegment[] = [
      { segmentType: 'period', startedAt: T0 },
      { segmentType: 'break', startedAt: T0 + P },
    ];
    const result = computeSegmentWindow(T0 + P + 100 * 1000, segsBreakLast, null, 40, 15);
    expect(result.startedAt).toBe(T0 + P);
    expect(result.endAt).toBe(T0 + P + B);
  });
});

describe('segmentLabel', () => {
  const segs2 = twoPeriodsSegments();
  const segs4 = buildSegments(T0, 4, 20, 5);

  it('labels index 0 as "1st Period"', () => {
    expect(segmentLabel(segs2[0], 0, segs2)).toBe('1st Period');
  });

  it('labels index 1 as "Half Time" in a 2-period match', () => {
    expect(segmentLabel(segs2[1], 1, segs2)).toBe('Half Time');
  });

  it('labels index 2 as "2nd Period"', () => {
    expect(segmentLabel(segs2[2], 2, segs2)).toBe('2nd Period');
  });

  it('labels break in a 4-period match as "Break"', () => {
    expect(segmentLabel(segs4[1], 1, segs4)).toBe('Break');
    expect(segmentLabel(segs4[3], 3, segs4)).toBe('Break');
  });
});

// ── resolveOpponent ───────────────────────────────────────────────────────────

describe('resolveOpponent', () => {
  it('returns the name when non-empty', () => {
    expect(resolveOpponent('Rivals')).toBe('Rivals');
  });

  it('returns "Opponent" for empty string', () => {
    expect(resolveOpponent('')).toBe('Opponent');
  });

  it('returns "Opponent" for whitespace-only string', () => {
    expect(resolveOpponent('   ')).toBe('Opponent');
  });

  it('trims and returns the name', () => {
    expect(resolveOpponent('  Rivals  ')).toBe('Rivals');
  });
});

// ── resolveTeamName ───────────────────────────────────────────────────────────

describe('resolveTeamName', () => {
  const teams = [
    { id: 't_1', name: 'Red Lions', colour: '#f00', players: [] },
    { id: 't_2', name: 'Blue Eagles', colour: '#00f', players: [] },
  ];

  it('returns the matching team name', () => {
    expect(resolveTeamName(teams, 't_1')).toBe('Red Lions');
    expect(resolveTeamName(teams, 't_2')).toBe('Blue Eagles');
  });

  it('returns "Unknown" when teamId is not found', () => {
    expect(resolveTeamName(teams, 't_unknown')).toBe('Unknown');
  });

  it('returns "Unknown" when teams array is empty', () => {
    expect(resolveTeamName([], 't_1')).toBe('Unknown');
  });
});

// ── buildScorerRows ───────────────────────────────────────────────────────────

describe('buildScorerRows', () => {
  const player: Player = { id: 'p_1', name: 'Alex Morgan', jerseyNumber: 13 };

  it('always includes the unknown row first', () => {
    expect(buildScorerRows([])[0]).toEqual({ type: 'unknown' });
  });

  it('returns only the unknown row for an empty roster', () => {
    expect(buildScorerRows([])).toHaveLength(1);
  });

  it('maps each player to a player row after the unknown row', () => {
    const rows = buildScorerRows([player]);
    expect(rows).toHaveLength(2);
    expect(rows[1]).toEqual({ type: 'player', player });
  });
});

// ── scorerRowId ───────────────────────────────────────────────────────────────

describe('scorerRowId', () => {
  const player: Player = { id: 'p_1', name: 'Alex Morgan' };

  it('returns "__none__" for the unknown row', () => {
    expect(scorerRowId({ type: 'unknown' })).toBe('__none__');
  });

  it('returns the player id for a player row', () => {
    expect(scorerRowId({ type: 'player', player })).toBe('p_1');
  });
});

// ── scorerRowPlayerId ─────────────────────────────────────────────────────────

describe('scorerRowPlayerId', () => {
  const player: Player = { id: 'p_1', name: 'Alex Morgan' };

  it('returns null for the unknown row', () => {
    expect(scorerRowPlayerId({ type: 'unknown' })).toBeNull();
  });

  it('returns the player id for a player row', () => {
    expect(scorerRowPlayerId({ type: 'player', player })).toBe('p_1');
  });
});

// ── resolveGoalPlayerId ───────────────────────────────────────────────────────

describe('resolveGoalPlayerId', () => {
  it('returns null for away goals regardless of selected player', () => {
    expect(resolveGoalPlayerId('away', 'p_1')).toBeNull();
    expect(resolveGoalPlayerId('away', null)).toBeNull();
    expect(resolveGoalPlayerId('away', undefined)).toBeNull();
  });

  it('returns the playerId for home goals', () => {
    expect(resolveGoalPlayerId('home', 'p_1')).toBe('p_1');
  });

  it('returns null for home goals when selectedPlayerId is null', () => {
    expect(resolveGoalPlayerId('home', null)).toBeNull();
  });

  it('returns null for home goals when selectedPlayerId is undefined', () => {
    expect(resolveGoalPlayerId('home', undefined)).toBeNull();
  });
});

// ── buildSegmentGroups ────────────────────────────────────────────────────────

const baseMatch: Match = {
  id: 'm_test',
  homeTeamId: 't_home',
  opponentName: 'Rivals',
  periodDurationMinutes: 40,
  breakDurationMinutes: 15,
  status: 'finished',
  segments: [
    { segmentType: 'period', startedAt: T0 },
    { segmentType: 'break', startedAt: T0 + P },
    { segmentType: 'period', startedAt: T0 + P + B },
  ],
  endedAt: T0 + P + B + P,
  homeScore: 1,
  awayScore: 0,
  activities: [],
};

describe('buildSegmentGroups', () => {
  it('returns one group per period only (skips breaks)', () => {
    const groups = buildSegmentGroups(baseMatch);
    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe('1st Period');
    expect(groups[1].label).toBe('2nd Period');
  });

  it('first group has breakAfter set to Half Time', () => {
    const groups = buildSegmentGroups(baseMatch);
    expect(groups[0].breakAfter).not.toBeNull();
    expect(groups[0].breakAfter?.label).toBe('Half Time');
  });

  it('last group has no breakAfter', () => {
    const groups = buildSegmentGroups(baseMatch);
    expect(groups[1].breakAfter).toBeNull();
  });

  it('sets correct startedAt and endedAt on each group', () => {
    const groups = buildSegmentGroups(baseMatch);
    expect(groups[0].startedAt).toBe(T0);
    expect(groups[0].endedAt).toBe(T0 + P);
    expect(groups[1].startedAt).toBe(T0 + P + B);
    expect(groups[1].endedAt).toBe(T0 + P + B + P);
  });

  it('assigns activities to the correct period', () => {
    const activity1: MatchActivity = {
      id: 'a_1',
      type: 'goal',
      createdAt: T0 + 600 * 1000,
      side: 'home',
      playerId: null,
    };
    const activity2: MatchActivity = {
      id: 'a_2',
      type: 'remark',
      createdAt: T0 + P + B + 300 * 1000,
      text: 'Good play',
    };
    const match = { ...baseMatch, activities: [activity1, activity2] };
    const groups = buildSegmentGroups(match);
    expect(groups[0].activities).toEqual([activity1]);
    expect(groups[1].activities).toEqual([activity2]);
  });

  it('uses match endedAt as endedAt for last group when match is finished', () => {
    const groups = buildSegmentGroups(baseMatch);
    expect(groups[1].endedAt).toBe(baseMatch.endedAt);
  });

  it('sets endedAt to null for last group when match has no endedAt', () => {
    const liveMatch = { ...baseMatch, status: 'live' as const, endedAt: null };
    const groups = buildSegmentGroups(liveMatch);
    expect(groups[1].endedAt).toBeNull();
  });
});
