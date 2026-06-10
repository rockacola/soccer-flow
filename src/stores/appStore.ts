import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { STORAGE_KEY_APP } from '../constants/storageKeys';

type AppStore = {
  hasCompletedOnboarding: boolean;
  hasSampleData: boolean;
  completeOnboarding: () => void;
  setHasSampleData: (value: boolean) => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      hasSampleData: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setHasSampleData: (value) => set({ hasSampleData: value }),
    }),
    {
      name: STORAGE_KEY_APP,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        hasCompletedOnboarding: s.hasCompletedOnboarding,
        hasSampleData: s.hasSampleData,
      }),
    },
  ),
);
