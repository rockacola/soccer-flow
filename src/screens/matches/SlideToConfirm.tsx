import React, { useEffect, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';

const THUMB_SIZE = 56;
const TRACK_PADDING = 4;

type Props = {
  onConfirm: () => void;
  label?: string;
};

export default function SlideToConfirm({ onConfirm, label = 'Slide to end match' }: Props) {
  const pan = useRef(new Animated.Value(0)).current;
  const maxTravelRef = useRef(0);
  const onConfirmRef = useRef(onConfirm);

  useEffect(
    function syncOnConfirmRef() {
      onConfirmRef.current = onConfirm;
    },
    [onConfirm],
  );

  useEffect(
    function resetPan() {
      pan.setValue(0);
      return () => {
        pan.setValue(0);
      };
    },
    [pan],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        pan.setValue(Math.max(0, Math.min(gs.dx, maxTravelRef.current)));
      },
      onPanResponderRelease: (_, gs) => {
        const max = maxTravelRef.current;
        if (max > 0 && gs.dx >= max * 0.85) {
          Animated.timing(pan, {
            toValue: max,
            duration: 80,
            useNativeDriver: true,
          }).start(() => onConfirmRef.current());
        } else {
          Animated.spring(pan, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  const labelOpacity = pan.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      style={styles.track}
      onLayout={(e) => {
        maxTravelRef.current = Math.max(
          0,
          e.nativeEvent.layout.width - THUMB_SIZE - TRACK_PADDING * 2,
        );
      }}
    >
      <Animated.Text style={[styles.label, { opacity: labelOpacity }]}>{label}</Animated.Text>
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.thumbArrow}>›</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: THUMB_SIZE + TRACK_PADDING * 2,
    backgroundColor: colors.surfaceElevated,
    borderRadius: (THUMB_SIZE + TRACK_PADDING * 2) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },
  thumb: {
    position: 'absolute',
    left: TRACK_PADDING,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbArrow: {
    fontSize: 24,
    color: colors.textPrimary,
    fontWeight: '600',
    lineHeight: 28,
  },
});
