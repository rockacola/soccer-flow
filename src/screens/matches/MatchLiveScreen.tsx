import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { typeScale } from '../../constants/typography';
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
            onPress={() =>
              Alert.alert('End Match?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Finish', style: 'destructive', onPress: doFinish },
              ])
            }
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
          <View style={styles.activityRow}>
            <TouchableOpacity
              style={styles.activityRowContent}
              activeOpacity={0.7}
              onPress={() => handleEditActivity(item)}
            >
              <ActivityLogItem
                activity={item}
                homeTeam={homeTeam}
                opponentName={currentMatch.opponentName}
                segments={currentMatch.segments}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.activityDeleteButton}
              onPress={() => handleDeleteActivity(item.id)}
              accessibilityRole="button"
              accessibilityLabel="Delete activity"
            >
              <Text style={styles.activityDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={reversedActivities.length === 0 ? styles.emptyLog : undefined}
        ListEmptyComponent={<Text style={styles.emptyLogText}>No activity yet.</Text>}
      />

      <GoalModal
        key={editingActivity?.id ?? 'new'}
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
        key={editingActivity?.id ?? 'new'}
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
        key={editingActivity?.id ?? 'new'}
        visible={remarkModalVisible}
        onClose={closeRemarkModal}
        onRecord={handleRemark}
        capturedPhaseSeconds={capturedPhase.withinSeconds}
        editActivity={
          editingActivity?.type === 'remark' ? (editingActivity as RemarkActivity) : undefined
        }
      />

      <TimerAdjustModal
        key={String(timerAdjustVisible)}
        visible={timerAdjustVisible}
        onClose={closeTimerAdjust}
        onApply={handleAdjustTimestamps}
        segments={currentMatch.segments}
        endedAt={currentMatch.endedAt}
        periodDurationMinutes={currentMatch.periodDurationMinutes}
        breakDurationMinutes={currentMatch.breakDurationMinutes}
      />
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
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  scoreboard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  timerRow: {
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.lg,
  },
  periodInfo: {
    fontSize: typeScale.base,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  timer: {
    fontSize: typeScale.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  scoreTeam: {
    alignItems: 'center',
    flex: 1,
  },
  teamNameLabel: {
    fontSize: typeScale.base,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  scoreControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
    fontSize: typeScale.lg,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  scoreDigit: {
    fontSize: typeScale.xxxl,
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
    fontSize: typeScale.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activityButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  activityButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: spacing.md,
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
    fontSize: typeScale.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyLog: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLogText: {
    fontSize: typeScale.body,
    color: colors.textSecondary,
  },
  activityRow: {
    flexDirection: 'row',
  },
  activityRowContent: {
    flex: 1,
  },
  activityDeleteButton: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityDeleteText: {
    fontSize: typeScale.sm,
    fontWeight: '600',
    color: colors.destructive,
  },
});
