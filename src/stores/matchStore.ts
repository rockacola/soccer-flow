import { create } from 'zustand';

import type { Match, MatchActivity } from '../types';

type MatchStore = {
  currentMatch: Match | null;
  pastMatches: Match[];
  loadPastMatches: (matches: Match[]) => void;
  startMatch: (match: Match) => void;
  pauseMatch: () => void;
  resumeMatch: () => void;
  finishMatch: () => void;
  tick: (elapsedSeconds: number) => void;
  setScore: (homeScore: number, awayScore: number) => void;
  addActivity: (activity: MatchActivity) => void;
  removeActivity: (activityId: string) => void;
};

export const useMatchStore = create<MatchStore>((set) => ({
  currentMatch: null,
  pastMatches: [],
  loadPastMatches: (matches) => set({ pastMatches: matches }),
  startMatch: (match) => set({ currentMatch: match }),
  pauseMatch: () =>
    set((s) => (s.currentMatch ? { currentMatch: { ...s.currentMatch, status: 'paused' } } : {})),
  resumeMatch: () =>
    set((s) => (s.currentMatch ? { currentMatch: { ...s.currentMatch, status: 'live' } } : {})),
  finishMatch: () =>
    set((s) =>
      s.currentMatch
        ? {
            currentMatch: null,
            pastMatches: [...s.pastMatches, { ...s.currentMatch, status: 'finished' }],
          }
        : {},
    ),
  tick: (elapsedSeconds) =>
    set((s) => (s.currentMatch ? { currentMatch: { ...s.currentMatch, elapsedSeconds } } : {})),
  setScore: (homeScore, awayScore) =>
    set((s) =>
      s.currentMatch ? { currentMatch: { ...s.currentMatch, homeScore, awayScore } } : {},
    ),
  addActivity: (activity) =>
    set((s) =>
      s.currentMatch
        ? {
            currentMatch: {
              ...s.currentMatch,
              activities: [...s.currentMatch.activities, activity],
            },
          }
        : {},
    ),
  removeActivity: (activityId) =>
    set((s) =>
      s.currentMatch
        ? {
            currentMatch: {
              ...s.currentMatch,
              activities: s.currentMatch.activities.filter((a) => a.id !== activityId),
            },
          }
        : {},
    ),
}));
