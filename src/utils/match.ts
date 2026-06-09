import type { MatchSegment } from '../types';

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
