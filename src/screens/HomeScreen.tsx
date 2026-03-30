import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../theme';
import { useRideStore } from '../store/rideStore';

export default function HomeScreen({ navigation }: any) {
  const { reset } = useRideStore();

  const handleRole = (role: 'rider' | 'pillion') => {
    reset();
    useRideStore.getState().setRole(role);
    navigation.navigate('Pair');
  };

  return (
    <LinearGradient colors={['#0A0A0F', '#13131A', '#0A0A0F']} style={s.bg}>
      <View style={s.header}>
        <Text style={s.logo}>🏍️ RideTalk</Text>
        <Text style={s.sub}>Split-earbud voice bridge</Text>
      </View>

      <View style={s.desc}>
        <Text style={s.descText}>
          One TWS earphone set — two riders, one conversation.{'\n'}
          No calls. No data. Just Bluetooth.
        </Text>
      </View>

      <Text style={s.chooseLabel}>Who are you?</Text>

      <TouchableOpacity onPress={() => handleRole('rider')} activeOpacity={0.8}>
        <LinearGradient colors={[theme.accent, theme.accentAlt]} style={s.roleBtn}>
          <Text style={s.roleBtnIcon}>🎧</Text>
          <View>
            <Text style={s.roleBtnTitle}>Rider (Front)</Text>
            <Text style={s.roleBtnSub}>Wears LEFT earbud · speaks into left mic</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRole('pillion')} activeOpacity={0.8}>
        <LinearGradient colors={[theme.right, '#C0392B']} style={s.roleBtn}>
          <Text style={s.roleBtnIcon}>🎧</Text>
          <View>
            <Text style={s.roleBtnTitle}>Pillion (Back)</Text>
            <Text style={s.roleBtnSub}>Wears RIGHT earbud · speaks into right mic</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  bg:           { flex: 1, paddingHorizontal: 24, paddingTop: 60 },
  header:       { alignItems: 'center', marginBottom: 24 },
  logo:         { color: theme.text, fontSize: 32, fontWeight: '800', letterSpacing: 1 },
  sub:          { color: theme.subtext, fontSize: 14, marginTop: 4 },
  desc:         { backgroundColor: theme.card, borderRadius: 14, padding: 16, marginBottom: 32 },
  descText:     { color: theme.subtext, fontSize: 14, lineHeight: 22, textAlign: 'center' },
  chooseLabel:  { color: theme.subtext, fontSize: 13, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 12 },
  roleBtn:      { borderRadius: 16, padding: 20, flexDirection: 'row',
                  alignItems: 'center', marginBottom: 16, gap: 16 },
  roleBtnIcon:  { fontSize: 32 },
  roleBtnTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  roleBtnSub:   { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 },
});