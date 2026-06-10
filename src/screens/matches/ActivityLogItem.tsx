import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { MatchActivity, MatchSegment, Team } from '../../types';
import { computePhase } from '../../utils/match';
import { formatElapsed, formatWallClock } from '../../utils/time';

import PlayerChip from './PlayerChip';

type Props = {
  activity: MatchActivity;
  homeTeam: Team;
  opponentName: string;
  segments: MatchSegment[];
  showBottomBorder?: boolean;
};

export default React.memo(function ActivityLogItem({
  activity,
  homeTeam,
  opponentName,
  segments,
  showBottomBorder = true,
}: Props) {
  const sideLabel = (side: 'home' | 'away') =>
    side === 'home' ? homeTeam.name : opponentName.trim() || 'Opponent';

  const { withinSeconds } = computePhase(activity.createdAt, segments);
  const displayTime = formatElapsed(withinSeconds);
  const displayClock = formatWallClock(activity.createdAt);

  const rowStyle = [styles.row, !showBottomBorder && { borderBottomWidth: 0 as const }];

  const timeColumn = (
    <View style={styles.timeColumn}>
      <Text style={styles.minute}>{displayTime}</Text>
      <Text style={styles.clock}>{displayClock}</Text>
    </View>
  );

  if (activity.type === 'goal') {
    return (
      <View style={rowStyle}>
        {timeColumn}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>GOAL</Text>
        </View>
        <View style={styles.detail}>
          {activity.side === 'home' ? (
            <PlayerChip team={homeTeam} playerId={activity.playerId} />
          ) : (
            <Text style={styles.noteText}>{sideLabel(activity.side)}</Text>
          )}
        </View>
      </View>
    );
  }

  if (activity.type === 'substitution') {
    return (
      <View style={rowStyle}>
        {timeColumn}
        <View style={[styles.badge, styles.badgeSub]}>
          <Text style={styles.badgeText}>SUB</Text>
        </View>
        <View style={styles.detail}>
          <PlayerChip team={homeTeam} playerId={activity.playerOutId} />
          <Text style={styles.arrow}>→</Text>
          <PlayerChip team={homeTeam} playerId={activity.playerInId} />
        </View>
      </View>
    );
  }

  return (
    <View style={rowStyle}>
      {timeColumn}
      <View style={[styles.badge, styles.badgeNote]}>
        <Text style={styles.badgeText}>NOTE</Text>
      </View>
      <Text style={styles.noteText} numberOfLines={3}>
        {activity.text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
    gap: 8,
  },
  timeColumn: {
    alignItems: 'flex-start',
    gap: 2,
  },
  minute: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    minWidth: 40,
  },
  clock: {
    fontSize: 11,
    color: colors.textSecondary,
    minWidth: 40,
  },
  badge: {
    backgroundColor: colors.positive,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeSub: {
    backgroundColor: colors.accent,
  },
  badgeNote: {
    backgroundColor: colors.warning,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  detail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingTop: 1,
  },
  arrow: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  noteText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
});
