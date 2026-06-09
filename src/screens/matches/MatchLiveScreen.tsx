import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useReducer, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

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
import type {
  GoalActivity,
  MatchActivity,
  MatchesStackParamList,
  RemarkActivity,
  SubstitutionActivity,
} from '../../types';
import { computePhase, computeSegmentWindow, phaseLabel } from '../../utils/match';
import { formatElapsed, formatWallClock } from '../../utils/time';

import ActivityLogItem from './ActivityLogItem';
import GoalModal from './GoalModal';
import RemarkModal from './RemarkModal';
import SlideToConfirm from './SlideToConfirm';
import SubstitutionModal from './SubstitutionModal';
import TimerAdjustModal from './TimerAdjustModal';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchLive'>;

export default function MatchLiveScreen({ navigation }: Props) {
  const currentMatch = useMatchStore((s) => s.currentMatch);
  const teams = useTeamsStore((s) => s.teams);

  const [, tick] = useReducer((n: number) => n + 1, 0);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [subModalVisible, setSubModalVisible] = useState(false);
  const [remarkModalVisible, setRemarkModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [timerAdjustVisible, setTimerAdjustVisible] = useState(false);
  const [capturedAt, setCapturedAt] = useState(0);
  const [editingActivity, setEditingActivity] = useState<MatchActivity | null>(null);

  useEffect(function startTicker() {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!currentMatch) {
    return (
      <View style={styles.centred}>
        <Text style={styles.noMatchText}>No active match.</Text>
      </View>
    );
  }

  const homeTeam = teams.find((t) => t.id === currentMatch.homeTeamId);

  if (!homeTeam) {
    return (
      <View style={styles.centred}>
        <Text style={styles.noMatchText}>Team data not found.</Text>
      </View>
    );
  }

  const opponentLabel = currentMatch.opponentName.trim() || 'Opponent';
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

  const reversedActivities = [...currentMatch.activities].reverse();

  const openGoalModal = () => {
    setCapturedAt(Date.now());
    setGoalModalVisible(true);
  };

  const openSubModal = () => {
    setCapturedAt(Date.now());
    setSubModalVisible(true);
  };

  const openRemarkModal = () => {
    setCapturedAt(Date.now());
    setRemarkModalVisible(true);
  };

  const doFinish = () => {
    setConfirmVisible(false);
    finishMatch();
    navigation.popToTop();
  };

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

  const handleDeleteActivity = (activityId: string) => {
    deleteActivity(activityId);
  };

  return (
    <View style={styles.container}>
      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <TouchableOpacity
          style={styles.timerRow}
          onPress={() => setTimerAdjustVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.periodInfo}>
            {phaseLabel(phase, currentMatch.segments)}
            {' | '}
            {formatWallClock(segmentWindow.startedAt)} – {formatWallClock(segmentWindow.endAt)}
          </Text>
          <Text style={styles.timer}>{formatElapsed(phase.withinSeconds)}</Text>
        </TouchableOpacity>

        <View style={styles.scoreRow}>
          {/* Home */}
          <View style={styles.scoreTeam}>
            <Text style={styles.teamNameLabel} numberOfLines={1}>
              {homeTeam.name}
            </Text>
            <View style={styles.scoreControl}>
              <TouchableOpacity style={styles.scoreButton} onPress={() => adjustScore('home', -1)}>
                <Text style={styles.scoreButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.scoreDigit}>{currentMatch.homeScore}</Text>
              <TouchableOpacity style={styles.scoreButton} onPress={() => adjustScore('home', 1)}>
                <Text style={styles.scoreButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.scoreDivider}>–</Text>

          {/* Opponent */}
          <View style={styles.scoreTeam}>
            <Text style={styles.teamNameLabel} numberOfLines={1}>
              {opponentLabel}
            </Text>
            <View style={styles.scoreControl}>
              <TouchableOpacity style={styles.scoreButton} onPress={() => adjustScore('away', -1)}>
                <Text style={styles.scoreButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.scoreDigit}>{currentMatch.awayScore}</Text>
              <TouchableOpacity style={styles.scoreButton} onPress={() => adjustScore('away', 1)}>
                <Text style={styles.scoreButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity style={styles.finishButton} onPress={() => setConfirmVisible(true)}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity buttons */}
      <View style={styles.activityButtons}>
        <TouchableOpacity
          style={[styles.activityButton, styles.goalButton]}
          onPress={openGoalModal}
        >
          <Text style={styles.activityButtonText}>Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.activityButton, styles.subButton]} onPress={openSubModal}>
          <Text style={styles.activityButtonText}>Sub</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityButton, styles.noteButton]}
          onPress={openRemarkModal}
        >
          <Text style={styles.activityButtonText}>Note</Text>
        </TouchableOpacity>
      </View>

      {/* Activity log */}
      <FlatList
        data={reversedActivities}
        keyExtractor={(item: MatchActivity) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => (
              <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleDeleteActivity(item.id)}
              >
                <Text style={styles.deleteActionText}>Delete</Text>
              </TouchableOpacity>
            )}
          >
            <TouchableOpacity activeOpacity={0.7} onPress={() => handleEditActivity(item)}>
              <ActivityLogItem
                activity={item}
                homeTeam={homeTeam}
                opponentName={currentMatch.opponentName}
                segments={currentMatch.segments}
              />
            </TouchableOpacity>
          </Swipeable>
        )}
        contentContainerStyle={reversedActivities.length === 0 ? styles.emptyLog : undefined}
        ListEmptyComponent={<Text style={styles.emptyLogText}>No activity yet.</Text>}
      />

      <GoalModal
        visible={goalModalVisible}
        onClose={() => {
          setGoalModalVisible(false);
          setEditingActivity(null);
        }}
        onRecord={handleGoal}
        homeTeam={homeTeam}
        opponentName={currentMatch.opponentName}
        capturedPhaseSeconds={capturedPhase.withinSeconds}
        editActivity={
          editingActivity?.type === 'goal' ? (editingActivity as GoalActivity) : undefined
        }
      />
      <SubstitutionModal
        visible={subModalVisible}
        onClose={() => {
          setSubModalVisible(false);
          setEditingActivity(null);
        }}
        onRecord={handleSub}
        homeTeam={homeTeam}
        capturedPhaseSeconds={capturedPhase.withinSeconds}
        editActivity={
          editingActivity?.type === 'substitution'
            ? (editingActivity as SubstitutionActivity)
            : undefined
        }
      />
      <RemarkModal
        visible={remarkModalVisible}
        onClose={() => {
          setRemarkModalVisible(false);
          setEditingActivity(null);
        }}
        onRecord={handleRemark}
        capturedPhaseSeconds={capturedPhase.withinSeconds}
        editActivity={
          editingActivity?.type === 'remark' ? (editingActivity as RemarkActivity) : undefined
        }
      />

      <TimerAdjustModal
        visible={timerAdjustVisible}
        onClose={() => setTimerAdjustVisible(false)}
        onApply={(segs, newEndedAt) => adjustTimestamps(segs, newEndedAt)}
        segments={currentMatch.segments}
        endedAt={currentMatch.endedAt}
        periodDurationMinutes={currentMatch.periodDurationMinutes}
        breakDurationMinutes={currentMatch.breakDurationMinutes}
      />

      <Modal visible={confirmVisible} transparent animationType="fade">
        <View style={styles.confirmOverlay}>
          <TouchableOpacity
            style={styles.confirmBackdrop}
            activeOpacity={1}
            onPress={() => setConfirmVisible(false)}
          />
          <View style={styles.confirmPanel}>
            <Text style={styles.confirmTitle}>End match?</Text>
            <Text style={styles.confirmSubtitle}>Slide to confirm</Text>
            <SlideToConfirm onConfirm={doFinish} />
            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={() => setConfirmVisible(false)}
            >
              <Text style={styles.confirmCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatchText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  scoreboard: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  timerRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  periodInfo: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  timer: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scoreTeam: {
    alignItems: 'center',
    flex: 1,
  },
  teamNameLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EBEBF5',
    opacity: 0.6,
    marginBottom: 6,
  },
  scoreControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  scoreDigit: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    fontSize: 32,
    color: '#636366',
    paddingTop: 18,
  },
  controlRow: {
    flexDirection: 'row',
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activityButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  activityButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  goalButton: {
    backgroundColor: '#34C759',
  },
  subButton: {
    backgroundColor: '#007AFF',
  },
  noteButton: {
    backgroundColor: '#FF9500',
  },
  activityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyLog: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogText: {
    fontSize: 15,
    color: '#8E8E93',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  confirmBackdrop: {
    flex: 1,
  },
  confirmPanel: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: -8,
  },
  confirmCancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  confirmCancelText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
