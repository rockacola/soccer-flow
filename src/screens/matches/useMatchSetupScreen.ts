import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { createAndStartMatch } from '../../services/matchService';
import { useTeamsStore } from '../../stores/teamsStore';
import type { MatchesStackParamList, Team } from '../../types';

type Navigation = NativeStackNavigationProp<MatchesStackParamList, 'MatchSetup'>;

export type MatchSetupScreenState = {
  homeTeam: Team | null;
  opponentName: string;
  setOpponentName: (value: string) => void;
  periodDurationMinutes: number;
  breakDurationMinutes: number;
  adjustPeriod: (delta: number) => void;
  adjustBreak: (delta: number) => void;
  handleStart: () => void;
};

export function useMatchSetupScreen(
  homeTeamId: string,
  navigation: Navigation,
): MatchSetupScreenState {
  const teams = useTeamsStore((s) => s.teams);
  const homeTeam = teams.find((t) => t.id === homeTeamId) ?? null;

  const [opponentName, setOpponentName] = useState('');
  const [periodDurationMinutes, setPeriodDurationMinutes] = useState(40);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(15);

  useEffect(
    function dismissOnTabBlur() {
      const parent = navigation.getParent();
      if (!parent) {
        return () => {};
      }
      const unsubscribe = parent.addListener('blur', () => {
        navigation.popToTop();
      });
      return unsubscribe;
    },
    [navigation],
  );

  return {
    homeTeam,
    opponentName,
    setOpponentName,
    periodDurationMinutes,
    breakDurationMinutes,
    adjustPeriod: (delta: number) => {
      setPeriodDurationMinutes((m) => Math.min(90, Math.max(1, m + delta)));
    },
    adjustBreak: (delta: number) => {
      setBreakDurationMinutes((m) => Math.min(30, Math.max(1, m + delta)));
    },
    handleStart: () => {
      try {
        createAndStartMatch(
          homeTeamId,
          opponentName,
          2,
          periodDurationMinutes,
          breakDurationMinutes,
        );
        navigation.replace('MatchLive');
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not start match.');
      }
    },
  };
}
