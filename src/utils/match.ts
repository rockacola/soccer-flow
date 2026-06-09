import type { Match, MatchActivity, MatchSegment, Player, Team } from '../types';

export type Phase =
  | { type: 'period'; number: number; withinSeconds: number }
  | { type: 'break'; after: number; withinSeconds: number };

export function computePhase(now: number, segments: MatchSegment[]): Phase {
  // Find the last segment whose startedAt <= now
  let activeIdx = 0;
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].startedAt <= now) {
      activeIdx = i;
    } else {
      break;
    }
  }

  const active = segments[activeIdx];
  const withinSeconds = Math.max(0, Math.floor((now - active.startedAt) / 1000));
  const periodsUpTo = segments
    .slice(0, activeIdx + 1)
    .filter((s) => s.segmentType === 'period').length;

  if (active.segmentType === 'period') {
    return { type: 'period', number: periodsUpTo, withinSeconds };
  }

  return { type: 'break', after: periodsUpTo, withinSeconds };
}

const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

function ordinal(n: number): string {
  return ORDINAL[n] ?? `${n}th`;
}

export function phaseLabel(phase: Phase, segments: MatchSegment[]): string {
  const periodCount = segments.filter((s) => s.segmentType === 'period').length;
  if (phase.type === 'period') {
    return `${ordinal(phase.number)} Period`;
  }
  return periodCount === 2 && phase.after === 1 ? 'Half Time' : 'Break';
}

export function segmentLabel(
  segment: MatchSegment,
  index: number,
  segments: MatchSegment[],
): string {
  const periodCount = segments.filter((s) => s.segmentType === 'period').length;
  const periodsUpTo = segments.slice(0, index + 1).filter((s) => s.segmentType === 'period').length;
  if (segment.segmentType === 'period') {
    return `${ordinal(periodsUpTo)} Period`;
  }
  return periodCount === 2 && periodsUpTo === 1 ? 'Half Time' : 'Break';
}

export function computeSegmentWindow(
  now: number,
  segments: MatchSegment[],
  endedAt: number | null,
  periodDurationMinutes: number,
  breakDurationMinutes: number,
): { startedAt: number; endAt: number } {
  let activeIdx = 0;
  for (let i = 1; i < segments.length; i++) {
    if (segments[i].startedAt <= now) {
      activeIdx = i;
    } else {
      break;
    }
  }

  const startedAt = segments[activeIdx].startedAt;

  let endAt: number;
  if (activeIdx + 1 < segments.length) {
    endAt = segments[activeIdx + 1].startedAt;
  } else if (endedAt !== null) {
    endAt = endedAt;
  } else {
    const lastSeg = segments[segments.length - 1];
    const durationMs =
      lastSeg.segmentType === 'period'
        ? periodDurationMinutes * 60 * 1000
        : breakDurationMinutes * 60 * 1000;
    endAt = lastSeg.startedAt + durationMs;
  }

  return { startedAt, endAt };
}

export function resolveOpponent(opponentName: string): string {
  return opponentName.trim() || 'Opponent';
}

export function resolveTeamName(teams: Team[], teamId: string): string {
  return teams.find((t) => t.id === teamId)?.name ?? 'Unknown';
}

export type SegmentGroup = {
  segmentId: string;
  label: string;
  startedAt: number;
  endedAt: number | null;
  activities: MatchActivity[];
  breakAfter: { label: string; durationMs: number } | null;
};

export function buildSegmentGroups(match: Match): SegmentGroup[] {
  const { segments, activities } = match;
  const groups: SegmentGroup[] = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg.segmentType !== 'period') {
      continue;
    }

    const nextSegStart = segments[i + 1]?.startedAt ?? match.endedAt ?? null;
    const periodActivities = activities.filter(
      (a) => a.createdAt >= seg.startedAt && a.createdAt < (nextSegStart ?? Infinity),
    );

    let breakAfter: { label: string; durationMs: number } | null = null;
    if (i + 1 < segments.length && segments[i + 1].segmentType === 'break') {
      const breakSeg = segments[i + 1];
      const afterBreakSeg = segments[i + 2];
      const durationMs = afterBreakSeg
        ? afterBreakSeg.startedAt - breakSeg.startedAt
        : match.breakDurationMinutes * 60 * 1000;
      breakAfter = { label: segmentLabel(breakSeg, i + 1, segments), durationMs };
    }

    groups.push({
      segmentId: `seg-${i}`,
      label: segmentLabel(seg, i, segments),
      startedAt: seg.startedAt,
      endedAt: nextSegStart,
      activities: periodActivities,
      breakAfter,
    });
  }

  return groups;
}

export type ScorerRow = { type: 'unknown' } | { type: 'player'; player: Player };

export function buildScorerRows(players: Player[]): ScorerRow[] {
  return [{ type: 'unknown' }, ...players.map((p): ScorerRow => ({ type: 'player', player: p }))];
}

export function scorerRowId(row: ScorerRow): string {
  return row.type === 'unknown' ? '__none__' : row.player.id;
}

export function scorerRowPlayerId(row: ScorerRow): string | null {
  return row.type === 'player' ? row.player.id : null;
}

export function resolveGoalPlayerId(
  side: 'home' | 'away',
  selectedPlayerId: string | null | undefined,
): string | null {
  if (side === 'away') {
    return null;
  }
  return selectedPlayerId === undefined ? null : selectedPlayerId;
}

export function buildSegments(
  now: number,
  periodCount: number,
  periodDurationMinutes: number,
  breakDurationMinutes: number,
): MatchSegment[] {
  const segments: MatchSegment[] = [];
  let cursor = now;
  const periodMs = periodDurationMinutes * 60 * 1000;
  const breakMs = breakDurationMinutes * 60 * 1000;

  for (let i = 0; i < periodCount; i++) {
    segments.push({ segmentType: 'period', startedAt: cursor });
    cursor += periodMs;
    if (i < periodCount - 1) {
      segments.push({ segmentType: 'break', startedAt: cursor });
      cursor += breakMs;
    }
  }

  return segments;
}
