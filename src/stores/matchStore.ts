import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEY_PAST_MATCHES } from '../constants/storageKeys';
import type { Match, MatchActivity, MatchSegment } from '../types';

type MatchStore = {
  currentMatch: Match | null;
  pastMatches: Match[];
  startMatch: (match: Match) => void;
  finishMatch: () => void;
  setSegments: (segments: MatchSegment[], endedAt?: number) => void;
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
      finishMatch: () =>
        set((s) =>
          s.currentMatch
            ? {
                currentMatch: null,
                pastMatches: [
                  ...s.pastMatches,
                  { ...s.currentMatch, status: 'finished', endedAt: Date.now() },
                ],
              }
            : {},
        ),
      setSegments: (segments, endedAt) =>
        set((s) =>
          s.currentMatch
            ? {
                currentMatch: {
                  ...s.currentMatch,
                  segments,
                  ...(endedAt !== undefined ? { endedAt } : {}),
                },
              }
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
      version: 1,
      migrate: (persisted) => {
        const state = persisted as { pastMatches: unknown[] };
        return {
          pastMatches: (state.pastMatches ?? []).filter(
            (m): m is Match =>
              m !== null && typeof m === 'object' && Array.isArray((m as Match).segments),
          ),
        };
      },
      partialize: (s) => ({ pastMatches: s.pastMatches }),
    },
  ),
);
