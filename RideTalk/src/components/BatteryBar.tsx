import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function BatteryBar({ level }: { level: number }) {
  const color = level > 50 ? theme.success : level > 20 ? theme.warning : theme.danger;
  return (
    <View style={s.wrap}>
      <View style={s.shell}>
        <View style={[s.fill, { width: `${level}%` as any, backgroundColor: color }]} />
      </View>
      <View style={s.cap} />
      <Text style={[s.pct, { color }]}>{level}%</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:  { alignItems: 'center' },
  shell: { width: 34, height: 16, borderRadius: 3, borderWidth: 1.5,
           borderColor: '#555', overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
  cap:   { position: 'absolute', right: -5, top: 4,
           width: 3, height: 8, backgroundColor: '#555', borderRadius: 1 },
  pct:   { fontSize: 10, marginTop: 2, fontWeight: '700' },
});