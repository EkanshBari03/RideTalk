import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function StatusDot({ active }: { active: boolean }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (active) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.5, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1,   duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [active]);

  return (
    <Animated.View
      style={[s.dot,
        { backgroundColor: active ? theme.success : theme.border },
        active && { transform: [{ scale: pulse }] },
      ]}
    />
  );
}

const s = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
});