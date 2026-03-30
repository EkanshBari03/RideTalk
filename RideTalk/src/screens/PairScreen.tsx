import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';
import { useRideStore } from '../store/rideStore';
import { useBluetooth } from '../hooks/useBluetooth';
import DeviceCard from '../components/DeviceCard';

export default function PairScreen({ navigation }: any) {
  const { devices, isScanning, selectedDevice, role } = useRideStore();
  const { startScan, connectDevice, disconnectDevice } = useBluetooth();

  useEffect(() => { startScan(); }, []);

  const roleColor = role === 'rider' ? theme.left : theme.right;

  return (
    <View style={s.bg}>
      <Text style={s.title}>Pair Your Earphones</Text>
      <Text style={s.sub}>
        You are the <Text style={{ color: roleColor, fontWeight: '700' }}>
          {role === 'rider' ? '🔵 Rider' : '🔴 Pillion'}
        </Text>
      </Text>

      <View style={s.scanRow}>
        <Text style={s.sectionLabel}>Nearby Devices ({devices.length})</Text>
        {isScanning
          ? <ActivityIndicator color={theme.accent} />
          : <TouchableOpacity onPress={startScan}>
              <Text style={s.rescan}>Rescan</Text>
            </TouchableOpacity>
        }
      </View>

      <FlatList
        data={devices}
        keyExtractor={d => d.id}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            selected={selectedDevice?.id === item.id}
            onPress={() => item.connected
              ? disconnectDevice()
              : connectDevice(item)
            }
          />
        )}
        ListEmptyComponent={
          <Text style={s.empty}>
            {isScanning ? 'Scanning for devices...' : 'No devices found. Tap Rescan.'}
          </Text>
        }
      />

      {selectedDevice?.connected && (
        <TouchableOpacity
          style={[s.nextBtn, { backgroundColor: roleColor }]}
          onPress={() => navigation.navigate('Channel')}
        >
          <Text style={s.nextText}>Assign Channel →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  bg:           { flex: 1, backgroundColor: theme.bg, padding: 24, paddingTop: 60 },
  title:        { color: theme.text, fontSize: 26, fontWeight: '800' },
  sub:          { color: theme.subtext, fontSize: 14, marginTop: 4, marginBottom: 20 },
  scanRow:      { flexDirection: 'row', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 8 },
  sectionLabel: { color: theme.subtext, fontSize: 12, letterSpacing: 1.5,
                  textTransform: 'uppercase' },
  rescan:       { color: theme.accent, fontWeight: '600' },
  empty:        { color: theme.subtext, textAlign: 'center', marginTop: 40 },
  nextBtn:      { borderRadius: 14, padding: 18, alignItems: 'center', marginTop: 12 },
  nextText:     { color: '#fff', fontSize: 17, fontWeight: '700' },
});