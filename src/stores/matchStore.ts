import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEY_PAST_MATCHES } from '../constants/storageKeys';
import type { Match, MatchActivity } from '../types';

type MatchStore = {
  currentMatch: Match | null;
  pastMatches: Match[];
  startMatch: (match: Match) => void;
  pauseMatch: () => void;
  resumeMatch: () => void;
  finishMatch: () => void;
  tick: (elapsedSeconds: number) => void;
  setSegmentActuals: (actuals: number[]) => void;
  setScore: (homeScore: number, awayScore: number) => void;
  addActivity: (activity: MatchActivity) => void;
  removeActivity: (activityId: string) => void;
};

export const useMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      currentMatch: null,
      pastMatches: [],
      startMatch: (match) => set({ currentMatch: match }),
      pauseMatch: () =>
        set((s) =>
          s.currentMatch ? { currentMatch: { ...s.currentMatch, status: 'paused' } } : {},
        ),
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
      setSegmentActuals: (actuals) =>
        set((s) =>
          s.currentMatch
            ? { currentMatch: { ...s.currentMatch, segmentActualSeconds: actuals } }
            : {},
        ),
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
    }),
    {
      name: STORAGE_KEY_PAST_MATCHES,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ pastMatches: s.pastMatches }),
    },
  ),
);
