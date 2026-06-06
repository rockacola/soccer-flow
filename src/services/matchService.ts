import { useMatchStore } from '../stores/matchStore';
import { useTeamsStore } from '../stores/teamsStore';
import type { Match } from '../types';
import { generateId } from '../utils/id';
import { computePhase } from '../utils/match';

export function createAndStartMatch(
  homeTeamId: string,
  opponentName: string,
  periodDurationMinutes: number,
  breakDurationMinutes: number,
): void {
  const teams = useTeamsStore.getState().teams;
  if (!teams.find((t) => t.id === homeTeamId)) {
    throw new Error('Selected team not found.');
  }

  const match: Match = {
    id: generateId('m'),
    homeTeamId,
    opponentName: opponentName.trim(),
    periodCount: 2,
    periodDurationMinutes,
    breakDurationMinutes,
    status: 'live',
    startedAt: Date.now(),
    elapsedSeconds: 0,
    segmentActualSeconds: [],
    homeScore: 0,
    awayScore: 0,
    activities: [],
  };

  useMatchStore.getState().startMatch(match);
}

export function tickTimer(): void {
  const store = useMatchStore.getState();
  if (!store.currentMatch || store.currentMatch.status !== 'live') {
    return;
  }
  store.tick(store.currentMatch.elapsedSeconds + 1);
}

export function pauseMatch(): void {
  useMatchStore.getState().pauseMatch();
}

export function resumeMatch(): void {
  useMatchStore.getState().resumeMatch();
}

export function finishMatch(): void {
  useMatchStore.getState().finishMatch();
}

export function adjustSegments(newActuals: number[]): void {
  const store = useMatchStore.getState();
  if (!store.currentMatch) {
    return;
  }

  const {
    elapsedSeconds,
    periodDurationMinutes,
    periodCount,
    breakDurationMinutes,
    segmentActualSeconds,
  } = store.currentMatch;
  const P = periodDurationMinutes * 60;
  const B = breakDurationMinutes * 60;

  const phase = computePhase(
    elapsedSeconds,
    periodDurationMinutes,
    periodCount,
    breakDurationMinutes,
    segmentActualSeconds,
  );
  const currentSegIdx =
    phase.type === 'period' ? (phase.number - 1) * 2 : (phase.after - 1) * 2 + 1;

  let base = 0;
  for (let i = 0; i < currentSegIdx; i++) {
    base += newActuals[i] ?? (i % 2 === 0 ? P : B);
  }

  store.setSegmentActuals(newActuals);
  store.tick(Math.max(0, base + phase.withinSeconds));
}

export function adjustScore(side: 'home' | 'away', delta: number): void {
  const store = useMatchStore.getState();
  if (!store.currentMatch) {
    return;
  }
  const { homeScore, awayScore } = store.currentMatch;
  const newHome = side === 'home' ? Math.max(0, homeScore + delta) : homeScore;
  const newAway = side === 'away' ? Math.max(0, awayScore + delta) : awayScore;
  store.setScore(newHome, newAway);
}

export function recordGoal(
  side: 'home' | 'away',
  playerId: string | null,
  elapsedSeconds: number,
): void {
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'goal',
    elapsedSeconds,
    side,
    playerId,
  });
}

export function recordSubstitution(
  side: 'home' | 'away',
  playerOutId: string,
  playerInId: string,
  elapsedSeconds: number,
): void {
  if (playerOutId === playerInId) {
    throw new Error('Player off and player on must be different.');
  }
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'substitution',
    elapsedSeconds,
    side,
    playerOutId,
    playerInId,
  });
}

export function recordRemark(text: string, elapsedSeconds: number): void {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('Remark cannot be empty.');
  }
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'remark',
    elapsedSeconds,
    text: trimmed,
  });
}
