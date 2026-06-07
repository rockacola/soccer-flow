import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { MatchSegment } from '../../types';
import { segmentLabel } from '../../utils/match';
import { formatElapsed } from '../../utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (newSegments: MatchSegment[]) => void;
  segments: MatchSegment[];
  periodDurationMinutes: number;
  breakDurationMinutes: number;
};

function formatWallClock(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function StepperRow({
  label,
  value,
  onAdjust,
}: {
  label: string;
  value: number;
  onAdjust: (delta: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        {([-5, -1] as const).map((d) => (
          <TouchableOpacity key={d} style={styles.stepBtn} onPress={() => onAdjust(d)}>
            <Text style={styles.stepBtnText}>{d}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.stepValue}>{String(value).padStart(2, '0')}</Text>
        {([1, 5] as const).map((d) => (
          <TouchableOpacity key={d} style={styles.stepBtn} onPress={() => onAdjust(d)}>
            <Text style={styles.stepBtnText}>+{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function TimerAdjustModal({
  visible,
  onClose,
  onApply,
  segments,
  periodDurationMinutes,
  breakDurationMinutes,
}: Props) {
  const [draft, setDraft] = useState<MatchSegment[]>([]);
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  useEffect(() => {
    if (visible) {
      setDraft([...segmentsRef.current]);
    }
  }, [visible]);

  // Shift all segments from startIdx onwards by deltaMs, keeping the first segment fixed.
  const shiftFrom = (startIdx: number, deltaMs: number) => {
    setDraft((prev) => {
      const next = [...prev];
      for (let i = startIdx; i < next.length; i++) {
        next[i] = { ...next[i], startedAt: next[i].startedAt + deltaMs };
      }
      return next;
    });
  };

  // Duration of segment i = start of segment i+1 minus start of segment i.
  // Last segment has no defined end, so we use the planned duration for display.
  const segmentDurationSeconds = (i: number): number | null => {
    if (i + 1 < draft.length) {
      return Math.round((draft[i + 1].startedAt - draft[i].startedAt) / 1000);
    }
    return null;
  };

  const adjustSegmentDuration = (i: number, deltaSeconds: number) => {
    // Shifting segment i+1 (and all following) changes segment i's duration.
    if (i + 1 < draft.length) {
      shiftFrom(i + 1, deltaSeconds * 1000);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Adjust Segments</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {draft.map((seg, i) => {
            const durationSeconds = segmentDurationSeconds(i);
            const mins = durationSeconds !== null ? Math.floor(durationSeconds / 60) : null;
            const secs = durationSeconds !== null ? durationSeconds % 60 : null;
            const label = segmentLabel(seg, i, draft);
            const isLast = i === draft.length - 1;

            return (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{label}</Text>
                  <Text style={styles.clockText}>{formatWallClock(seg.startedAt)}</Text>
                </View>

                {!isLast && durationSeconds !== null && mins !== null && secs !== null ? (
                  <>
                    <Text style={styles.durationText}>{formatElapsed(durationSeconds)}</Text>
                    <StepperRow
                      label="min"
                      value={mins}
                      onAdjust={(d) => adjustSegmentDuration(i, d * 60)}
                    />
                    <StepperRow
                      label="sec"
                      value={secs}
                      onAdjust={(d) => adjustSegmentDuration(i, d)}
                    />
                  </>
                ) : (
                  <Text style={styles.openEndedText}>
                    Planned{' '}
                    {seg.segmentType === 'period' ? periodDurationMinutes : breakDurationMinutes}{' '}
                    min
                  </Text>
                )}
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            onApply(draft);
            onClose();
          }}
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
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancel: {
    fontSize: 15,
    color: '#007AFF',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  clockText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  durationText: {
    fontSize: 13,
    color: '#8E8E93',
    fontVariant: ['tabular-nums'],
  },
  openEndedText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperLabel: {
    fontSize: 13,
    color: '#8E8E93',
    width: 28,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  stepBtn: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
  },
  stepValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    minWidth: 32,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  applyButton: {
    marginHorizontal: 16,
    marginVertical: 20,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
