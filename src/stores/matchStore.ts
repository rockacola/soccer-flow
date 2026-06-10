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
  updateActivity: (activityId: string, updated: MatchActivity) => void;
  deletePastMatch: (matchId: string) => void;
  addPastMatch: (match: Match) => void;
  removePastMatchesByIds: (ids: string[]) => void;
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
      updateActivity: (activityId, updated) =>
        set((s) =>
          s.currentMatch
            ? {
                currentMatch: {
                  ...s.currentMatch,
                  activities: s.currentMatch.activities.map((a) =>
                    a.id === activityId ? updated : a,
                  ),
                },
              }
            : {},
        ),
      deletePastMatch: (matchId) =>
        set((s) => ({ pastMatches: s.pastMatches.filter((m) => m.id !== matchId) })),
      addPastMatch: (match) => set((s) => ({ pastMatches: [...s.pastMatches, match] })),
      removePastMatchesByIds: (ids) =>
        set((s) => ({ pastMatches: s.pastMatches.filter((m) => !ids.includes(m.id)) })),
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
