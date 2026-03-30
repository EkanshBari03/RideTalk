import { create } from 'zustand';

export type Role = 'rider' | 'pillion' | null;
export type Channel = 'left' | 'right' | null;

export interface BLEDevice {
  id:      string;
  name:    string;
  rssi:    number;
  battery: number | null;   // 0-100 or null if unknown
  connected: boolean;
}

interface RideStore {
  // Pairing
  devices:       BLEDevice[];
  selectedDevice: BLEDevice | null;
  isScanning:    boolean;

  // Channel
  role:    Role;
  channel: Channel;

  // Session
  isSessionActive: boolean;
  isMuted:         boolean;
  isSpeakerMuted:  boolean;

  // Actions
  setDevices:        (d: BLEDevice[]) => void;
  addDevice:         (d: BLEDevice)   => void;
  updateDevice:      (id: string, patch: Partial<BLEDevice>) => void;
  selectDevice:      (d: BLEDevice | null) => void;
  setIsScanning:     (v: boolean) => void;
  setRole:           (r: Role) => void;
  setChannel:        (c: Channel) => void;
  setSessionActive:  (v: boolean) => void;
  toggleMute:        () => void;
  toggleSpeaker:     () => void;
  reset:             () => void;
}

export const useRideStore = create<RideStore>((set) => ({
  devices:         [],
  selectedDevice:  null,
  isScanning:      false,
  role:            null,
  channel:         null,
  isSessionActive: false,
  isMuted:         false,
  isSpeakerMuted:  false,

  setDevices:       (devices)  => set({ devices }),
  addDevice:        (d)        => set(s => ({ devices: [...s.devices.filter(x => x.id !== d.id), d] })),
  updateDevice:     (id, patch) => set(s => ({
    devices: s.devices.map(d => d.id === id ? { ...d, ...patch } : d),
    selectedDevice: s.selectedDevice?.id === id
      ? { ...s.selectedDevice, ...patch }
      : s.selectedDevice,
  })),
  selectDevice:     (d)  => set({ selectedDevice: d }),
  setIsScanning:    (v)  => set({ isScanning: v }),
  setRole:          (r)  => set({ role: r, channel: r === 'rider' ? 'left' : 'right' }),
  setChannel:       (c)  => set({ channel: c }),
  setSessionActive: (v)  => set({ isSessionActive: v }),
  toggleMute:       ()   => set(s => ({ isMuted: !s.isMuted })),
  toggleSpeaker:    ()   => set(s => ({ isSpeakerMuted: !s.isSpeakerMuted })),
  reset:            ()   => set({
    selectedDevice: null, role: null, channel: null,
    isSessionActive: false, isMuted: false, isSpeakerMuted: false,
  }),
}));