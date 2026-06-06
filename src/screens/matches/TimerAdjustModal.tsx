import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { computePhase, segmentLabel } from '../../utils/match';
import { formatElapsed } from '../../utils/time';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (newActuals: number[]) => void;
  periodCount: number;
  periodDurationMinutes: number;
  breakDurationMinutes: number;
  segmentActualSeconds: number[];
  currentElapsedSeconds: number;
  startedAt: number | null;
};

function formatWallClock(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function buildInitialActuals(
  periodCount: number,
  periodDurationMinutes: number,
  breakDurationMinutes: number,
  segmentActualSeconds: number[],
): number[] {
  const totalSegments = periodCount * 2 - 1;
  const P = periodDurationMinutes * 60;
  const B = breakDurationMinutes * 60;
  return Array.from(
    { length: totalSegments },
    (_, i) => segmentActualSeconds[i] ?? (i % 2 === 0 ? P : B),
  );
}

function computeRanges(actuals: number[]): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  let cursor = 0;
  for (const duration of actuals) {
    ranges.push({ start: cursor, end: cursor + duration });
    cursor += duration;
  }
  return ranges;
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
  periodCount,
  periodDurationMinutes,
  breakDurationMinutes,
  segmentActualSeconds,
  currentElapsedSeconds,
  startedAt,
}: Props) {
  const propsRef = useRef({
    periodCount,
    periodDurationMinutes,
    breakDurationMinutes,
    segmentActualSeconds,
  });
  propsRef.current = {
    periodCount,
    periodDurationMinutes,
    breakDurationMinutes,
    segmentActualSeconds,
  };

  const [actuals, setActuals] = useState<number[]>(() =>
    buildInitialActuals(
      periodCount,
      periodDurationMinutes,
      breakDurationMinutes,
      segmentActualSeconds,
    ),
  );

  // Seed from props when opening — not on every tick (segmentActualSeconds ref changes each second)
  useEffect(() => {
    if (visible) {
      const p = propsRef.current;
      setActuals(
        buildInitialActuals(
          p.periodCount,
          p.periodDurationMinutes,
          p.breakDurationMinutes,
          p.segmentActualSeconds,
        ),
      );
    }
  }, [visible]);

  const ranges = computeRanges(actuals);

  const phase = computePhase(
    currentElapsedSeconds,
    periodDurationMinutes,
    periodCount,
    breakDurationMinutes,
    segmentActualSeconds,
  );
  const currentSegIdx =
    phase.type === 'period' ? (phase.number - 1) * 2 : (phase.after - 1) * 2 + 1;

  const adjustSegment = (segIdx: number, deltaSeconds: number) => {
    setActuals((prev) => {
      const next = [...prev];
      next[segIdx] = Math.max(0, (next[segIdx] ?? 0) + deltaSeconds);
      return next;
    });
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
          {actuals.map((duration, idx) => {
            const mins = Math.floor(duration / 60);
            const secs = duration % 60;
            const isCurrent = idx === currentSegIdx;
            const range = ranges[idx];

            return (
              <View key={idx} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{segmentLabel(idx, periodCount)}</Text>
                  {isCurrent ? <Text style={styles.currentBadge}>current</Text> : null}
                </View>
                <Text style={styles.rangeText}>
                  {formatElapsed(range.start)} – {formatElapsed(range.end)}
                </Text>
                {startedAt !== null && (
                  <Text style={styles.clockText}>
                    {formatWallClock(startedAt + range.start * 1000)}
                    {' – '}
                    {formatWallClock(startedAt + range.end * 1000)}
                  </Text>
                )}
                <StepperRow label="min" value={mins} onAdjust={(d) => adjustSegment(idx, d * 60)} />
                <StepperRow label="sec" value={secs} onAdjust={(d) => adjustSegment(idx, d)} />
              </View>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => {
            onApply(actuals);
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
  currentBadge: {
    fontSize: 11,
    fontWeight: '500',
    color: '#007AFF',
    backgroundColor: '#E5F0FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rangeText: {
    fontSize: 13,
    color: '#8E8E93',
    fontVariant: ['tabular-nums'],
  },
  clockText: {
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
