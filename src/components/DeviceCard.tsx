import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { BLEDevice } from '../store/rideStore';
import BatteryBar from './BatteryBar';
import StatusDot  from './StatusDot';

interface Props {
  device:   BLEDevice;
  onPress:  () => void;
  selected: boolean;
}

export default function DeviceCard({ device, onPress, selected }: Props) {
  const rssiLabel = device.rssi > -60 ? 'Strong' : device.rssi > -80 ? 'Good' : 'Weak';
  const rssiColor = device.rssi > -60 ? theme.success : device.rssi > -80 ? theme.warning : theme.danger;

  return (
    <TouchableOpacity
      style={[s.card, selected && s.selected]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={s.row}>
        <StatusDot active={device.connected} />
        <View style={s.info}>
          <Text style={s.name}>{device.name}</Text>
          <Text style={[s.rssi, { color: rssiColor }]}>
            Signal: {rssiLabel} ({device.rssi} dBm)
          </Text>
        </View>
        {device.battery !== null && (
          <BatteryBar level={device.battery} />
        )}
      </View>
      {device.connected && (
        <View style={s.connBadge}>
          <Text style={s.connText}>CONNECTED</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:     { backgroundColor: theme.card, borderRadius: 14, padding: 16,
              marginVertical: 6, borderWidth: 1, borderColor: theme.border },
  selected: { borderColor: theme.accent, borderWidth: 2 },
  row:      { flexDirection: 'row', alignItems: 'center' },
  info:     { flex: 1, marginLeft: 12 },
  name:     { color: theme.text, fontSize: 16, fontWeight: '600' },
  rssi:     { fontSize: 12, marginTop: 2 },
  connBadge:{ marginTop: 8, alignSelf: 'flex-start',
              backgroundColor: theme.success + '22', borderRadius: 6,
              paddingHorizontal: 8, paddingVertical: 3 },
  connText: { color: theme.success, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
});