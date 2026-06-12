import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { spacing } from '../../constants/spacing';
import { colors } from '../../constants/theme';
import { fonts, typeScale } from '../../constants/typography';
import type { MatchSegment } from '../../types';
import { segmentLabel } from '../../utils/match';
import { formatDurationLabel, formatWallClockFull } from '../../utils/time';

import DeltaButtons from './DeltaButtons';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (newSegments: MatchSegment[], newEndedAt?: number) => void;
  segments: MatchSegment[];
  endedAt: number | null;
  periodDurationMinutes: number;
  breakDurationMinutes: number;
};

// selectedKey format: "start-{i}" | "end-{i}"
type SelectedKey = string | null;

export default function TimerAdjustModal({
  visible,
  onClose,
  onApply,
  segments,
  endedAt,
  periodDurationMinutes,
  breakDurationMinutes,
}: Props) {
  const [draftSegments, setDraftSegments] = useState<MatchSegment[]>(() => [...segments]);
  const [draftEndedAt, setDraftEndedAt] = useState(() => {
    if (endedAt !== null) {
      return endedAt;
    }
    const lastSeg = segments[segments.length - 1];
    const durationMs =
      lastSeg.segmentType === 'period'
        ? periodDurationMinutes * 60 * 1000
        : breakDurationMinutes * 60 * 1000;
    return lastSeg.startedAt + durationMs;
  });
  const [selectedKey, setSelectedKey] = useState<SelectedKey>(null);

  const toggle = (key: string) => setSelectedKey((prev) => (prev === key ? null : key));

  const adjustSegmentStart = (i: number, deltaSeconds: number) => {
    setDraftSegments((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], startedAt: next[i].startedAt + deltaSeconds * 1000 };
      return next;
    });
  };

  const adjustSegmentEnd = (i: number, deltaSeconds: number) => {
    if (i + 1 < draftSegments.length) {
      setDraftSegments((prev) => {
        const next = [...prev];
        next[i + 1] = { ...next[i + 1], startedAt: next[i + 1].startedAt + deltaSeconds * 1000 };
        return next;
      });
    } else {
      setDraftEndedAt((prev) => prev + deltaSeconds * 1000);
    }
  };

  const segmentEnd = (i: number): number =>
    i + 1 < draftSegments.length ? draftSegments[i + 1].startedAt : draftEndedAt;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adjust Segments</Text>
          <TouchableOpacity onPress={onClose} accessibilityRole="button">
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {draftSegments.map((seg, i) => {
            const endTs = segmentEnd(i);
            const durationSeconds = Math.round((endTs - seg.startedAt) / 1000);
            const label = segmentLabel(seg, i, draftSegments);
            const startKey = `start-${i}`;
            const endKey = `end-${i}`;

            return (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {label}{' '}
                  <Text style={styles.cardDuration}>({formatDurationLabel(durationSeconds)})</Text>
                </Text>

                {/* Start row */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeRowLabel}>Start</Text>
                  <TouchableOpacity
                    style={[styles.timeChip, selectedKey === startKey && styles.timeChipSelected]}
                    onPress={() => toggle(startKey)}
                    accessibilityRole="button"
                    accessibilityLabel={`${label} start, ${formatWallClockFull(seg.startedAt)}`}
                    accessibilityState={{ selected: selectedKey === startKey }}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        selectedKey === startKey && styles.timeChipTextSelected,
                      ]}
                    >
                      {formatWallClockFull(seg.startedAt)}
                    </Text>
                  </TouchableOpacity>
                </View>
                {selectedKey === startKey && (
                  <DeltaButtons
                    durationSeconds={durationSeconds}
                    onAdjust={(d) => adjustSegmentStart(i, d)}
                  />
                )}

                {/* End row */}
                <View style={styles.timeRow}>
                  <Text style={styles.timeRowLabel}>End</Text>
                  <TouchableOpacity
                    style={[styles.timeChip, selectedKey === endKey && styles.timeChipSelected]}
                    onPress={() => toggle(endKey)}
                    accessibilityRole="button"
                    accessibilityLabel={`${label} end, ${formatWallClockFull(endTs)}`}
                    accessibilityState={{ selected: selectedKey === endKey }}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        selectedKey === endKey && styles.timeChipTextSelected,
                      ]}
                    >
                      {formatWallClockFull(endTs)}
                    </Text>
                  </TouchableOpacity>
                </View>
                {selectedKey === endKey && (
                  <DeltaButtons
                    durationSeconds={durationSeconds}
                    onAdjust={(d) => adjustSegmentEnd(i, d)}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            onApply(draftSegments, draftEndedAt ?? undefined);
            onClose();
          }}
          accessibilityRole="button"
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.separator,
  },
  title: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
  cancel: {
    fontSize: typeScale.body,
    fontFamily: fonts.regular,
    color: colors.accent,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: typeScale.body,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeRowLabel: {
    fontSize: typeScale.base,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    width: 36,
  },
  timeChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeChipSelected: {
    backgroundColor: colors.accent,
  },
  timeChipText: {
    fontSize: typeScale.md,
    fontFamily: fonts.regular,
    fontVariant: ['tabular-nums'],
    color: colors.textPrimary,
  },
  timeChipTextSelected: {
    color: colors.textPrimary,
  },
  cardDuration: {
    fontSize: typeScale.base,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  applyButton: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xl,
    backgroundColor: colors.accent,
    borderRadius: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: typeScale.title,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
  },
});
