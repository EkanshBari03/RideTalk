import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';
import { useRideStore } from '../store/rideStore';
import { useAudioBridge } from '../hooks/useAudioBridge';
import BatteryBar from '../components/BatteryBar';

export default function TalkScreen({ navigation }: any) {
  const { role, channel, isMuted, isSpeakerMuted,
          isSessionActive, selectedDevice,
          toggleMute, toggleSpeaker, setSessionActive, reset } = useRideStore();

  useAudioBridge();

  const ripple = useRef(new Animated.Value(1)).current;
  const roleColor = role === 'rider' ? theme.left : theme.right;

  // Start session on mount
  useEffect(() => {
    setSessionActive(true);
    Vibration.vibrate(80);
    return () => setSessionActive(false);
  }, []);

  // Ripple animation when not muted
  useEffect(() => {
    if (!isMuted && isSessionActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ripple, { toValue: 1.35, duration: 900, useNativeDriver: true }),
          Animated.timing(ripple, { toValue: 1,    duration: 900, useNativeDriver: true }),
        ])
      ).start();
    } else {
      ripple.stopAnimation();
      ripple.setValue(1);
    }
  }, [isMuted, isSessionActive]);

  const handleEnd = () => {
    setSessionActive(false);
    reset();
    navigation.popToTop();
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#0D0D16', '#0A0A0F']} style={s.bg}>

      {/* Header */}
      <View style={s.header}>
        <View style={[s.rolePill, { backgroundColor: roleColor + '22', borderColor: roleColor }]}>
          <Text style={[s.roleText, { color: roleColor }]}>
            {role === 'rider' ? '🏍️  Rider · LEFT ear' : '👤  Pillion · RIGHT ear'}
          </Text>
        </View>
        {selectedDevice && (
          <View style={s.deviceRow}>
            <Text style={s.devName}>{selectedDevice.name}</Text>
            {selectedDevice.battery !== null && (
              <BatteryBar level={selectedDevice.battery} />
            )}
          </View>
        )}
      </View>

      {/* Mic Visualiser */}
      <View style={s.micArea}>
        <Animated.View style={[s.ripple, { transform: [{ scale: ripple }],
          backgroundColor: isMuted ? theme.border : roleColor + '18' }]} />
        <TouchableOpacity style={[s.micBtn, { backgroundColor: isMuted ? theme.surface : roleColor }]}
          onPress={() => { toggleMute(); Vibration.vibrate(40); }}
          activeOpacity={0.8}
        >
          <Text style={s.micIcon}>{isMuted ? '🔇' : '🎙️'}</Text>
        </TouchableOpacity>
        <Text style={[s.micLabel, { color: isMuted ? theme.danger : theme.success }]}>
          {isMuted ? 'MIC OFF — Tap to unmute' : 'Live — Tap to mute'}
        </Text>
      </View>

      {/* Status Cards */}
      <View style={s.statusRow}>
        <View style={s.statCard}>
          <Text style={s.statIcon}>🎚️</Text>
          <Text style={s.statLabel}>Channel</Text>
          <Text style={[s.statVal, { color: roleColor }]}>{channel?.toUpperCase()}</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statIcon}>📡</Text>
          <Text style={s.statLabel}>Link</Text>
          <Text style={[s.statVal, { color: theme.success }]}>Active</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statIcon}>{isSpeakerMuted ? '🔕' : '🔊'}</Text>
          <Text style={s.statLabel}>Speaker</Text>
          <TouchableOpacity onPress={toggleSpeaker}>
            <Text style={[s.statVal, { color: isSpeakerMuted ? theme.danger : theme.success }]}>
              {isSpeakerMuted ? 'OFF' : 'ON'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* End Call */}
      <TouchableOpacity style={s.endBtn} onPress={handleEnd} activeOpacity={0.85}>
        <Text style={s.endText}>⏹  End Session</Text>
      </TouchableOpacity>

    </LinearGradient>
  );
}

const s = StyleSheet.create({
  bg:         { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  header:     { alignItems: 'center', marginBottom: 8 },
  rolePill:   { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
                borderWidth: 1, marginBottom: 12 },
  roleText:   { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },
  deviceRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  devName:    { color: theme.subtext, fontSize: 13 },
  micArea:    { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ripple:     { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
  micBtn:     { width: 130, height: 130, borderRadius: 65,
                alignItems: 'center', justifyContent: 'center', elevation: 8 },
  micIcon:    { fontSize: 52 },
  micLabel:   { marginTop: 24, fontSize: 14, fontWeight: '600' },
  statusRow:  { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard:   { flex: 1, backgroundColor: theme.card, borderRadius: 14,
                padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
  statIcon:   { fontSize: 20, marginBottom: 4 },
  statLabel:  { color: theme.subtext, fontSize: 11, letterSpacing: 1 },
  statVal:    { color: theme.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  endBtn:     { backgroundColor: theme.danger + 'DD', borderRadius: 14,
                padding: 18, alignItems: 'center' },
  endText:    { color: '#fff', fontSize: 16, fontWeight: '700' },
});