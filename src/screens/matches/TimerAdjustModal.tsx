import React, { useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { MatchSegment } from '../../types';
import { segmentLabel } from '../../utils/match';
import { formatElapsed, formatWallClockFull } from '../../utils/time';

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

function formatDurationLabel(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (s === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${s}s`;
  }
  return `${m}m ${s}s`;
}

function DeltaButtons({
  durationSeconds,
  onAdjust,
}: {
  durationSeconds: number;
  onAdjust: (deltaSeconds: number) => void;
}) {
  return (
    <View style={styles.deltaContainer}>
      <View style={styles.deltaSide}>
        <View style={styles.deltaBtnRow}>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(-5 * 60)}>
            <Text style={styles.deltaBtnText}>-5m</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(-1 * 60)}>
            <Text style={styles.deltaBtnText}>-1m</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deltaBtnRow}>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(-5)}>
            <Text style={styles.deltaBtnText}>-5s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(-1)}>
            <Text style={styles.deltaBtnText}>-1s</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.durationCenter}>{formatElapsed(durationSeconds)}</Text>

      <View style={styles.deltaSide}>
        <View style={styles.deltaBtnRow}>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(1 * 60)}>
            <Text style={styles.deltaBtnText}>+1m</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(5 * 60)}>
            <Text style={styles.deltaBtnText}>+5m</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deltaBtnRow}>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(1)}>
            <Text style={styles.deltaBtnText}>+1s</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deltaBtn} onPress={() => onAdjust(5)}>
            <Text style={styles.deltaBtnText}>+5s</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function TimerAdjustModal({
  visible,
  onClose,
  onApply,
  segments,
  endedAt,
  periodDurationMinutes,
  breakDurationMinutes,
}: Props) {
  const [draftSegments, setDraftSegments] = useState<MatchSegment[]>([]);
  const [draftEndedAt, setDraftEndedAt] = useState(0);
  const [selectedKey, setSelectedKey] = useState<SelectedKey>(null);

  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;
  const endedAtRef = useRef(endedAt);
  endedAtRef.current = endedAt;
  const periodDurationMinutesRef = useRef(periodDurationMinutes);
  periodDurationMinutesRef.current = periodDurationMinutes;
  const breakDurationMinutesRef = useRef(breakDurationMinutes);
  breakDurationMinutesRef.current = breakDurationMinutes;

  useEffect(() => {
    if (visible) {
      const segs = segmentsRef.current;
      setDraftSegments([...segs]);
      if (endedAtRef.current !== null) {
        setDraftEndedAt(endedAtRef.current);
      } else {
        const lastSeg = segs[segs.length - 1];
        const durationMs =
          lastSeg.segmentType === 'period'
            ? periodDurationMinutesRef.current * 60 * 1000
            : breakDurationMinutesRef.current * 60 * 1000;
        setDraftEndedAt(lastSeg.startedAt + durationMs);
      }
      setSelectedKey(null);
    }
  }, [visible]);

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
          <TouchableOpacity onPress={onClose}>
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
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeRowLabel: {
    fontSize: 13,
    color: '#8E8E93',
    width: 36,
  },
  timeChip: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeChipSelected: {
    backgroundColor: '#007AFF',
  },
  timeChipText: {
    fontSize: 14,
    fontVariant: ['tabular-nums'],
    color: '#3A3A3C',
  },
  timeChipTextSelected: {
    color: '#FFFFFF',
  },
  cardDuration: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
  },
  deltaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
  },
  deltaSide: {
    gap: 6,
  },
  deltaBtnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  deltaBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 7,
    width: 44,
    alignItems: 'center',
  },
  deltaBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
  },
  durationCenter: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
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
