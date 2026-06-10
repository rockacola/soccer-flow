import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { colors } from '../../constants/theme';
import type {
  GoalActivity,
  MatchActivity,
  MatchesStackParamList,
  RemarkActivity,
  SubstitutionActivity,
} from '../../types';
import { phaseLabel } from '../../utils/match';
import { formatElapsed, formatWallClock } from '../../utils/time';

import ActivityLogItem from './ActivityLogItem';
import GoalModal from './GoalModal';
import RemarkModal from './RemarkModal';
import SlideToConfirm from './SlideToConfirm';
import SubstitutionModal from './SubstitutionModal';
import TimerAdjustModal from './TimerAdjustModal';
import { useMatchLiveScreen } from './useMatchLiveScreen';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchLive'>;

export default function MatchLiveScreen({ navigation }: Props) {
  const vm = useMatchLiveScreen(navigation);

  if (vm.status === 'no-match') {
    return (
      <View style={styles.centred}>
        <Text style={styles.noMatchText}>No active match.</Text>
      </View>
    );
  }

  if (vm.status === 'team-missing') {
    return (
      <View style={styles.centred}>
        <Text style={styles.noMatchText}>Team data not found.</Text>
      </View>
    );
  }

  const {
    currentMatch,
    homeTeam,
    opponentLabel,
    phase,
    capturedPhase,
    segmentWindow,
    reversedActivities,
    goalModalVisible,
    subModalVisible,
    remarkModalVisible,
    confirmVisible,
    timerAdjustVisible,
    editingActivity,
    openGoalModal,
    closeGoalModal,
    openSubModal,
    closeSubModal,
    openRemarkModal,
    closeRemarkModal,
    openTimerAdjust,
    closeTimerAdjust,
    openConfirm,
    closeConfirm,
    doFinish,
    handleGoal,
    handleSub,
    handleRemark,
    handleEditActivity,
    handleDeleteActivity,
    handleAdjustScore,
    handleAdjustTimestamps,
  } = vm;

  return (
    <View style={styles.container}>
      {/* Scoreboard */}
      <View style={styles.scoreboard}>
        <TouchableOpacity
          style={styles.timerRow}
          onPress={openTimerAdjust}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Adjust match timer"
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
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => handleAdjustScore('home', -1)}
                accessibilityRole="button"
                accessibilityLabel="Decrease home score"
              >
                <Text style={styles.scoreButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.scoreDigit}>{currentMatch.homeScore}</Text>
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => handleAdjustScore('home', 1)}
                accessibilityRole="button"
                accessibilityLabel="Increase home score"
              >
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
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => handleAdjustScore('away', -1)}
                accessibilityRole="button"
                accessibilityLabel="Decrease away score"
              >
                <Text style={styles.scoreButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.scoreDigit}>{currentMatch.awayScore}</Text>
              <TouchableOpacity
                style={styles.scoreButton}
                onPress={() => handleAdjustScore('away', 1)}
                accessibilityRole="button"
                accessibilityLabel="Increase away score"
              >
                <Text style={styles.scoreButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controlRow}>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={openConfirm}
            accessibilityRole="button"
            accessibilityLabel="Finish match"
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity buttons */}
      <View style={styles.activityButtons}>
        <TouchableOpacity
          style={[styles.activityButton, styles.goalButton]}
          onPress={openGoalModal}
          accessibilityRole="button"
          accessibilityLabel="Record goal"
        >
          <Text style={styles.activityButtonText}>Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityButton, styles.subButton]}
          onPress={openSubModal}
          accessibilityRole="button"
          accessibilityLabel="Record substitution"
        >
          <Text style={styles.activityButtonText}>Sub</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activityButton, styles.noteButton]}
          onPress={openRemarkModal}
          accessibilityRole="button"
          accessibilityLabel="Record note"
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
        onClose={closeGoalModal}
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
        onClose={closeSubModal}
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
        onClose={closeRemarkModal}
        onRecord={handleRemark}
        capturedPhaseSeconds={capturedPhase.withinSeconds}
        editActivity={
          editingActivity?.type === 'remark' ? (editingActivity as RemarkActivity) : undefined
        }
      />

      <TimerAdjustModal
        visible={timerAdjustVisible}
        onClose={closeTimerAdjust}
        onApply={handleAdjustTimestamps}
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
            onPress={closeConfirm}
          />
          <View style={styles.confirmPanel}>
            <Text style={styles.confirmTitle}>End match?</Text>
            <Text style={styles.confirmSubtitle}>Slide to confirm</Text>
            <SlideToConfirm onConfirm={doFinish} />
            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={closeConfirm}
              accessibilityRole="button"
              accessibilityLabel="Cancel finish"
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
    backgroundColor: colors.background,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMatchText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  scoreboard: {
    backgroundColor: colors.surface,
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
    color: colors.textSecondary,
  },
  timer: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
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
    color: colors.textSecondary,
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
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    fontSize: 20,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  scoreDigit: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 48,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    fontSize: 32,
    color: colors.textTertiary,
    paddingTop: 18,
  },
  controlRow: {
    flexDirection: 'row',
  },
  finishButton: {
    flex: 1,
    backgroundColor: colors.destructive,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
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
    backgroundColor: colors.positive,
  },
  subButton: {
    backgroundColor: colors.accent,
  },
  noteButton: {
    backgroundColor: colors.warning,
  },
  activityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyLog: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  deleteAction: {
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
  },
  deleteActionText: {
    color: colors.textPrimary,
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
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    textAlign: 'center',
  },
  confirmSubtitle: {
    fontSize: 13,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: -8,
  },
  confirmCancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  confirmCancelText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
