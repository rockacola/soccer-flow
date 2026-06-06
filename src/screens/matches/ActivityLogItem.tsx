import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import JerseyBadge from '../../components/JerseyBadge';
import type { MatchActivity, Team } from '../../types';
import { formatElapsed } from '../../utils/time';

type Props = {
  activity: MatchActivity;
  homeTeam: Team;
  opponentName: string;
};

function PlayerChip({ team, playerId }: { team: Team; playerId: string | null }) {
  const player = playerId !== null ? team.players.find((p) => p.id === playerId) : undefined;
  return (
    <View style={styles.playerChip}>
      <JerseyBadge size="sm" number={player?.jerseyNumber} />
      <Text style={styles.playerName}>{player?.name ?? 'Unknown'}</Text>
    </View>
  );
}

export default React.memo(function ActivityLogItem({ activity, homeTeam, opponentName }: Props) {
  const sideLabel = (side: 'home' | 'away') =>
    side === 'home' ? homeTeam.name : opponentName.trim() || 'Opponent';

  if (activity.type === 'goal') {
    return (
      <View style={styles.row}>
        <Text style={styles.minute}>{formatElapsed(activity.elapsedSeconds)}</Text>
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
      <View style={styles.row}>
        <Text style={styles.minute}>{formatElapsed(activity.elapsedSeconds)}</Text>
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
    <View style={styles.row}>
      <Text style={styles.minute}>{formatElapsed(activity.elapsedSeconds)}</Text>
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
    borderBottomColor: '#E5E5EA',
    gap: 8,
  },
  minute: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    minWidth: 32,
    paddingTop: 2,
  },
  badge: {
    backgroundColor: '#34C759',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeSub: {
    backgroundColor: '#007AFF',
  },
  badgeNote: {
    backgroundColor: '#FF9500',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
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
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  playerName: {
    fontSize: 14,
    color: '#000000',
  },
  arrow: {
    fontSize: 14,
    color: '#8E8E93',
  },
  noteText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
});
