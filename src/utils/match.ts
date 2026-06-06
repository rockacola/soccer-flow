export type Phase =
  | { type: 'period'; number: number; withinSeconds: number }
  | { type: 'break'; after: number; withinSeconds: number };

function getSegmentDuration(
  index: number,
  plannedPeriodSeconds: number,
  plannedBreakSeconds: number,
  actuals: number[],
): number {
  return actuals[index] ?? (index % 2 === 0 ? plannedPeriodSeconds : plannedBreakSeconds);
}

export function computePhase(
  elapsedSeconds: number,
  periodDurationMinutes: number,
  periodCount: number,
  breakDurationMinutes: number,
  segmentActualSeconds: number[],
): Phase {
  const P = periodDurationMinutes * 60;
  const B = breakDurationMinutes * 60;
  let cursor = 0;

  for (let i = 1; i <= periodCount; i++) {
    const periodSegIdx = (i - 1) * 2;
    const periodDuration = getSegmentDuration(periodSegIdx, P, B, segmentActualSeconds);

    if (elapsedSeconds < cursor + periodDuration) {
      return { type: 'period', number: i, withinSeconds: elapsedSeconds - cursor };
    }

    if (i === periodCount) {
      return { type: 'period', number: i, withinSeconds: elapsedSeconds - cursor };
    }

    const periodEnd = cursor + periodDuration;
    const breakDuration = getSegmentDuration(periodSegIdx + 1, P, B, segmentActualSeconds);
    const breakEnd = periodEnd + breakDuration;

    if (elapsedSeconds < breakEnd) {
      return { type: 'break', after: i, withinSeconds: elapsedSeconds - periodEnd };
    }

    cursor = breakEnd;
  }

  return { type: 'period', number: periodCount, withinSeconds: elapsedSeconds };
}

const ORDINAL: Record<number, string> = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th' };

function ordinal(n: number): string {
  return ORDINAL[n] ?? `${n}th`;
}

export function phaseLabel(phase: Phase, periodCount: number): string {
  if (phase.type === 'period') {
    return `${ordinal(phase.number)} Period`;
  }
  return periodCount === 2 && phase.after === 1 ? 'Half Time' : 'Break';
}

export function segmentLabel(index: number, periodCount: number): string {
  if (index % 2 === 0) {
    return `${ordinal(index / 2 + 1)} Period`;
  }
  const afterPeriod = (index + 1) / 2;
  return periodCount === 2 && afterPeriod === 1 ? 'Half Time' : 'Break';
}
