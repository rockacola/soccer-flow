import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import { deletePastMatch } from '../../services/matchService';
import type { MatchesStackParamList } from '../../types';
import { formatBreakDuration, formatMatchDateLong, formatWallClock } from '../../utils/time';

import ActivityLogItem from './ActivityLogItem';
import { useMatchDetailScreen } from './useMatchDetailScreen';

type Props = NativeStackScreenProps<MatchesStackParamList, 'MatchDetail'>;

export default function MatchDetailScreen({ route, navigation }: Props) {
  const { matchId } = route.params;
  const vm = useMatchDetailScreen(matchId);

  function handleDeleteMatch() {
    Alert.alert('Delete Match', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePastMatch(matchId);
          navigation.goBack();
        },
      },
    ]);
  }

  if (vm.status === 'not-found') {
    return (
      <View style={styles.centred}>
        <Text style={styles.emptyText}>Match not found.</Text>
      </View>
    );
  }

  const { match, homeTeam, opponentName, groups } = vm;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      {/* Score */}
      <View style={styles.scoreCard}>
        <Text style={styles.date}>{formatMatchDateLong(match.segments[0]?.startedAt ?? null)}</Text>
        <View style={styles.scoreRow}>
          <Text style={styles.teamName} numberOfLines={2}>
            {homeTeam.name}
          </Text>
          <Text style={styles.score}>
            {match.homeScore} – {match.awayScore}
          </Text>
          <Text style={styles.teamName} numberOfLines={2}>
            {opponentName}
          </Text>
        </View>
      </View>

      {/* Segment groups */}
      <View style={styles.segmentsContainer}>
        {groups.map((group) => (
          <React.Fragment key={group.segmentId}>
            <View style={styles.periodHeader}>
              <Text style={styles.periodLabel}>{group.label.toUpperCase()}</Text>
              {group.endedAt !== null && (
                <Text style={styles.periodMeta}>
                  {formatWallClock(group.startedAt)}
                  {' – '}
                  {formatWallClock(group.endedAt)}
                  {'  ·  '}
                  {Math.round((group.endedAt - group.startedAt) / 60000)} min
                </Text>
              )}
            </View>
            <View style={styles.activityCard}>
              {group.activities.length === 0 ? (
                <View style={styles.emptyRow}>
                  <Text style={styles.emptyRowText}>No activities</Text>
                </View>
              ) : (
                group.activities.map((activity, aIdx) => (
                  <ActivityLogItem
                    key={activity.id}
                    activity={activity}
                    homeTeam={homeTeam}
                    opponentName={opponentName}
                    segments={match.segments}
                    showBottomBorder={aIdx < group.activities.length - 1}
                  />
                ))
              )}
            </View>
            {group.breakAfter !== null && (
              <View style={styles.breakSeparator}>
                <View style={styles.breakLine} />
                <Text style={styles.breakText}>
                  {group.breakAfter.label} · {formatBreakDuration(group.breakAfter.durationMs)}
                </Text>
                <View style={styles.breakLine} />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteMatch}
        accessibilityRole="button"
        accessibilityLabel="Delete match"
      >
        <Text style={styles.deleteButtonText}>Delete Match</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 40,
  },
  centred: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    fontSize: typeScale.sm,
    color: colors.textTertiary,
    fontFamily: fonts.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  teamName: {
    fontSize: typeScale.md,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  score: {
    fontSize: typeScale.xxl,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  segmentsContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginLeft: 4,
    marginRight: 4,
  },
  periodLabel: {
    fontSize: typeScale.sm,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  periodMeta: {
    fontSize: typeScale.sm,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    overflow: 'hidden',
    marginBottom: 4,
  },
  emptyRow: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  emptyRowText: {
    fontSize: typeScale.md,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  breakSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: spacing.lg,
    paddingHorizontal: 4,
  },
  breakLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
  },
  breakText: {
    fontSize: typeScale.sm,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  emptyText: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  deleteButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    marginBottom: spacing.xxl,
    paddingVertical: 14,
    borderRadius: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.destructive,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.destructive,
  },
});
