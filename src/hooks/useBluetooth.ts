import { useEffect, useRef, useCallback } from 'react';
import { BleManager, Device, State } from 'react-native-ble-plx';
import { Platform, PermissionsAndroid } from 'react-native';
import { useRideStore, BLEDevice } from '../store/rideStore';

const BATTERY_SERVICE_UUID  = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_CHAR_UUID     = '00002a19-0000-1000-8000-00805f9b34fb';

export function useBluetooth() {
  const manager  = useRef<BleManager | null>(null);
  const { addDevice, updateDevice, setIsScanning, selectDevice, selectedDevice } = useRideStore();

  // Init BLE manager
  useEffect(() => {
    manager.current = new BleManager();
    return () => { manager.current?.destroy(); };
  }, []);

  // Request permissions (Android 12+)
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      return Object.values(grants).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
    }
    return true; // iOS handled via Info.plist
  }, []);

  // Start scanning
  const startScan = useCallback(async () => {
    const ok = await requestPermissions();
    if (!ok) return;

    const state = await manager.current?.state();
    if (state !== State.PoweredOn) return;

    setIsScanning(true);

    manager.current?.startDeviceScan(null, { allowDuplicates: false }, (err, device) => {
      if (err || !device) return;
      if (!device.name) return; // skip unnamed

      const mapped: BLEDevice = {
        id:        device.id,
        name:      device.name ?? 'Unknown',
        rssi:      device.rssi ?? -100,
        battery:   null,
        connected: false,
      };
      addDevice(mapped);
    });

    // Stop after 10 s
    setTimeout(() => stopScan(), 10_000);
  }, []);

  const stopScan = useCallback(() => {
    manager.current?.stopDeviceScan();
    setIsScanning(false);
  }, []);

  // Connect to device
  const connectDevice = useCallback(async (device: BLEDevice) => {
    try {
      stopScan();
      const connected = await manager.current?.connectToDevice(device.id);
      if (!connected) return;

      await connected.discoverAllServicesAndCharacteristics();
      updateDevice(device.id, { connected: true });
      selectDevice({ ...device, connected: true });

      // Read battery level
      try {
        const char = await connected.readCharacteristicForService(
          BATTERY_SERVICE_UUID,
          BATTERY_CHAR_UUID,
        );
        if (char.value) {
          const buf     = Buffer.from(char.value, 'base64');
          const battery = buf[0];
          updateDevice(device.id, { battery });
        }
      } catch (_) { /* device may not expose battery */ }

      // Monitor disconnection
      connected.onDisconnected(() => {
        updateDevice(device.id, { connected: false, battery: null });
        selectDevice(null);
      });
    } catch (e) {
      console.warn('BLE connect error:', e);
    }
  }, []);

  const disconnectDevice = useCallback(async () => {
    if (!selectedDevice) return;
    await manager.current?.cancelDeviceConnection(selectedDevice.id);
    updateDevice(selectedDevice.id, { connected: false });
    selectDevice(null);
  }, [selectedDevice]);

  return { startScan, stopScan, connectDevice, disconnectDevice };
}