import { useMatchStore } from '../stores/matchStore';
import { useTeamsStore } from '../stores/teamsStore';
import type { Match, MatchActivity, MatchSegment } from '../types';
import { generateId } from '../utils/id';
import { buildSegments } from '../utils/match';

export function createAndStartMatch(
  homeTeamId: string,
  opponentName: string,
  periodCount: number,
  periodDurationMinutes: number,
  breakDurationMinutes: number,
): void {
  const teams = useTeamsStore.getState().teams;
  if (!teams.find((t) => t.id === homeTeamId)) {
    throw new Error('Selected team not found.');
  }

  const now = Date.now();
  const match: Match = {
    id: generateId('m'),
    homeTeamId,
    opponentName: opponentName.trim(),
    periodDurationMinutes,
    breakDurationMinutes,
    status: 'live',
    segments: buildSegments(now, periodCount, periodDurationMinutes, breakDurationMinutes),
    endedAt: null,
    homeScore: 0,
    awayScore: 0,
    activities: [],
  };

  useMatchStore.getState().startMatch(match);
}

export function finishMatch(): void {
  useMatchStore.getState().finishMatch();
}

export function deletePastMatch(matchId: string): void {
  useMatchStore.getState().deletePastMatch(matchId);
}

export function adjustTimestamps(newSegments: MatchSegment[], newEndedAt?: number): void {
  useMatchStore.getState().setSegments(newSegments, newEndedAt);
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

export function recordGoal(side: 'home' | 'away', playerId: string | null): void {
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'goal',
    createdAt: Date.now(),
    side,
    playerId,
  });
}

export function recordSubstitution(
  side: 'home' | 'away',
  playerOutId: string,
  playerInId: string,
): void {
  if (playerOutId === playerInId) {
    throw new Error('Player off and player on must be different.');
  }
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'substitution',
    createdAt: Date.now(),
    side,
    playerOutId,
    playerInId,
  });
}

export function deleteActivity(activityId: string): void {
  useMatchStore.getState().removeActivity(activityId);
}

export function updateActivity(activity: MatchActivity): void {
  useMatchStore.getState().updateActivity(activity.id, activity);
}

export function recordRemark(text: string): void {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('Remark cannot be empty.');
  }
  useMatchStore.getState().addActivity({
    id: generateId('a'),
    type: 'remark',
    createdAt: Date.now(),
    text: trimmed,
  });
}
