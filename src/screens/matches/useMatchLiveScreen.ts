import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useReducer, useState } from 'react';
import { Alert } from 'react-native';

import {
  adjustScore,
  adjustTimestamps,
  deleteActivity,
  finishMatch,
  recordGoal,
  recordRemark,
  recordSubstitution,
  updateActivity,
} from '../../services/matchService';
import { useMatchStore } from '../../stores/matchStore';
import { useTeamsStore } from '../../stores/teamsStore';
import type { Match, MatchActivity, MatchSegment, MatchesStackParamList, Team } from '../../types';
import type { Phase } from '../../utils/match';
import { computePhase, computeSegmentWindow, resolveOpponent } from '../../utils/match';

type Navigation = NativeStackNavigationProp<MatchesStackParamList, 'MatchLive'>;

export type MatchLiveScreenState =
  | { status: 'no-match' }
  | { status: 'team-missing' }
  | {
      status: 'ready';
      currentMatch: Match;
      homeTeam: Team;
      opponentLabel: string;
      phase: Phase;
      capturedPhase: Phase;
      segmentWindow: { startedAt: number; endAt: number };
      reversedActivities: MatchActivity[];
      goalModalVisible: boolean;
      subModalVisible: boolean;
      remarkModalVisible: boolean;
      timerAdjustVisible: boolean;
      editingActivity: MatchActivity | null;
      openGoalModal: () => void;
      closeGoalModal: () => void;
      openSubModal: () => void;
      closeSubModal: () => void;
      openRemarkModal: () => void;
      closeRemarkModal: () => void;
      openTimerAdjust: () => void;
      closeTimerAdjust: () => void;
      doFinish: () => void;
      handleGoal: (side: 'home' | 'away', playerId: string | null) => void;
      handleSub: (outId: string, inId: string) => void;
      handleRemark: (text: string) => void;
      handleEditActivity: (activity: MatchActivity) => void;
      handleDeleteActivity: (activityId: string) => void;
      handleAdjustScore: (side: 'home' | 'away', delta: number) => void;
      handleAdjustTimestamps: (segs: MatchSegment[], newEndedAt?: number) => void;
    };

export function useMatchLiveScreen(navigation: Navigation): MatchLiveScreenState {
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const teams = useTeamsStore((s) => s.teams);

  const [, tick] = useReducer((n: number) => n + 1, 0);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [timerAdjustVisible, setTimerAdjustVisible] = useState(false);
  const [capturedAt, setCapturedAt] = useState(0);
  const [editingActivity, setEditingActivity] = useState<MatchActivity | null>(null);

  useEffect(function startTicker() {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!currentMatch) {
    return { status: 'no-match' };
  }

  const homeTeam = teams.find((t) => t.id === currentMatch.homeTeamId);
  if (!homeTeam) {
    return { status: 'team-missing' };
  }

  const now = Date.now();
  const phase = computePhase(now, currentMatch.segments);
  const capturedPhase = capturedAt > 0 ? computePhase(capturedAt, currentMatch.segments) : phase;
  const segmentWindow = computeSegmentWindow(
    now,
    currentMatch.segments,
    currentMatch.endedAt,
    currentMatch.periodDurationMinutes,
    currentMatch.breakDurationMinutes,
  );

  const handleGoal = (side: 'home' | 'away', playerId: string | null) => {
    if (editingActivity && editingActivity.type === 'goal') {
      try {
        updateActivity({ ...editingActivity, side, playerId });
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not update goal.');
      }
      setEditingActivity(null);
      return;
    }
    try {
      recordGoal(side, playerId);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not record goal.');
    }
  };

  const handleSub = (outId: string, inId: string) => {
    if (editingActivity && editingActivity.type === 'substitution') {
      try {
        updateActivity({ ...editingActivity, playerOutId: outId, playerInId: inId });
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not update substitution.');
      }
      setEditingActivity(null);
      return;
    }
    try {
      recordSubstitution('home', outId, inId);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not record substitution.');
    }
  };

  const handleRemark = (text: string) => {
    if (editingActivity && editingActivity.type === 'remark') {
      try {
        updateActivity({ ...editingActivity, text });
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not update note.');
      }
      setEditingActivity(null);
      return;
    }
    try {
      recordRemark(text);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not record note.');
    }
  };

  const handleEditActivity = (activity: MatchActivity) => {
    setCapturedAt(activity.createdAt);
    setEditingActivity(activity);
    if (activity.type === 'goal') {
      setGoalModalVisible(true);
    } else if (activity.type === 'substitution') {
      setSubModalVisible(true);
    } else {
      setRemarkModalVisible(true);
    }
  };

  return {
    status: 'ready',
    currentMatch,
    homeTeam,
    opponentLabel: resolveOpponent(currentMatch.opponentName),
    phase,
    capturedPhase,
    segmentWindow,
    reversedActivities: [...currentMatch.activities].reverse(),
    goalModalVisible,
    subModalVisible,
    remarkModalVisible,
    timerAdjustVisible,
    editingActivity,
    openGoalModal: () => {
      setCapturedAt(Date.now());
      setGoalModalVisible(true);
    },
    closeGoalModal: () => {
      setGoalModalVisible(false);
      setEditingActivity(null);
    },
    openSubModal: () => {
      setCapturedAt(Date.now());
      setSubModalVisible(true);
    },
    closeSubModal: () => {
      setSubModalVisible(false);
      setEditingActivity(null);
    },
    openRemarkModal: () => {
      setCapturedAt(Date.now());
      setRemarkModalVisible(true);
    },
    closeRemarkModal: () => {
      setRemarkModalVisible(false);
      setEditingActivity(null);
    },
    openTimerAdjust: () => setTimerAdjustVisible(true),
    closeTimerAdjust: () => setTimerAdjustVisible(false),
    doFinish: () => {
      finishMatch();
      navigation.navigate('MatchesList');
    },
    handleGoal,
    handleSub,
    handleRemark,
    handleEditActivity,
    handleDeleteActivity: deleteActivity,
    handleAdjustScore: adjustScore,
    handleAdjustTimestamps: adjustTimestamps,
  };
}
