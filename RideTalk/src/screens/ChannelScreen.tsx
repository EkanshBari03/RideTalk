import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useRideStore } from '../store/rideStore';
import BatteryBar from '../components/BatteryBar';

export default function ChannelScreen({ navigation }: any) {
  const { role, channel, setChannel, selectedDevice } = useRideStore();

  const confirm = () => navigation.navigate('Talk');

  return (
    <View style={s.bg}>
      <Text style={s.title}>Channel Assignment</Text>
      <Text style={s.sub}>Confirm which earbud you are wearing</Text>

      {selectedDevice && (
        <View style={s.deviceInfo}>
          <Text style={s.devName}>{selectedDevice.name}</Text>
          {selectedDevice.battery !== null && (
            <BatteryBar level={selectedDevice.battery} />
          )}
        </View>
      )}

      <View style={s.channelRow}>
        {(['left', 'right'] as const).map(ch => {
          const active   = channel === ch;
          const color    = ch === 'left' ? theme.left : theme.right;
          const isDefault = (role === 'rider' && ch === 'left') ||
                            (role === 'pillion' && ch === 'right');
          return (
            <TouchableOpacity
              key={ch}
              style={[s.chBtn, active && { borderColor: color, borderWidth: 2 }]}
              onPress={() => setChannel(ch)}
              activeOpacity={0.8}
            >
              <Text style={s.chEmoji}>{ch === 'left' ? '◀️' : '▶️'}</Text>
              <Text style={[s.chLabel, { color }]}>{ch.toUpperCase()}</Text>
              {isDefault && (
                <Text style={s.chDefault}>Recommended</Text>
              )}
              {active && <Text style={s.chCheck}>✓ Selected</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s.hint}>
        <Text style={s.hintText}>
          💡 Rider wears <Text style={{ color: theme.left }}>LEFT</Text> earbud.{'\n'}
          Pillion wears <Text style={{ color: theme.right }}>RIGHT</Text> earbud.{'\n'}
          Your mic captures your voice and routes it to your partner's ear.
        </Text>
      </View>

      <TouchableOpacity style={s.goBtn} onPress={confirm}>
        <Text style={s.goText}>Start Talking 🎙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  bg:         { flex: 1, backgroundColor: theme.bg, padding: 24, paddingTop: 60 },
  title:      { color: theme.text, fontSize: 26, fontWeight: '800' },
  sub:        { color: theme.subtext, fontSize: 14, marginTop: 4, marginBottom: 20 },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: theme.card, borderRadius: 12, padding: 14, marginBottom: 24 },
  devName:    { color: theme.text, fontSize: 16, fontWeight: '600' },
  channelRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  chBtn:      { flex: 1, backgroundColor: theme.card, borderRadius: 16, padding: 24,
                alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  chEmoji:    { fontSize: 32 },
  chLabel:    { fontSize: 20, fontWeight: '800', marginTop: 8 },
  chDefault:  { color: theme.warning, fontSize: 11, marginTop: 4 },
  chCheck:    { color: theme.success, fontSize: 12, marginTop: 6, fontWeight: '600' },
  hint:       { backgroundColor: theme.surface, borderRadius: 12, padding: 16, marginBottom: 24 },
  hintText:   { color: theme.subtext, fontSize: 13, lineHeight: 22 },
  goBtn:      { backgroundColor: theme.accent, borderRadius: 14, padding: 18, alignItems: 'center' },
  goText:     { color: '#fff', fontSize: 17, fontWeight: '700' },
});