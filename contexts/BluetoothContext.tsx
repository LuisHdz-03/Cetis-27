import { useEstudiante } from "@/hooks/useEstudiante";
import { Buffer } from "buffer";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { BleManager, Device, State } from "react-native-ble-plx";
import { PERMISSIONS, request } from "react-native-permissions";
// Solicita permisos antes de escanear/conectar
const requestBluetoothPermissions = async () => {
  if (Platform.OS === "android") {
    await request(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  } else if (Platform.OS === "ios") {
    await request(PERMISSIONS.IOS.BLUETOOTH);
    await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  }
};

(global as any).Buffer = Buffer; // <--- FIX MUY IMPORTANTE

interface BluetoothContextType {
  isEnabled: boolean;
  connectToEsp32: () => Promise<Device | null>;
  sendData: (device: Device, data: string) => Promise<void>;
  toggleBluetooth: () => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined
);

const bleManager = new BleManager();

const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab".toLowerCase();
const CHAR_UUID = "abcd1234-abcd-1234-abcd-1234567890ab".toLowerCase();

export function BluetoothProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const { estudiante } = useEstudiante();

  useEffect(() => {
    const sub = bleManager.onStateChange((state) => {
      setIsEnabled(state === State.PoweredOn);
    }, true);
    return () => sub.remove();
  }, []);

  const toggleBluetooth = async () => {
    console.log("Toggle Bluetooth: isEnabled =", isEnabled);
    if (!isEnabled) {
      console.log("Encendiendo Bluetooth...");
      setIsEnabled(true);
      await requestBluetoothPermissions();
      const device = await connectToEsp32();
      console.log("Device conectado:", device ? "Sí" : "No");
      console.log("numeroControl:", estudiante?.numeroControl);
      if (device && estudiante?.numeroControl) {
        console.log("Enviando datos:", estudiante.numeroControl);
        await sendData(device, String(estudiante.numeroControl));
      } else {
        console.log("No se pudo conectar o no hay numeroControl");
      }
    } else {
      console.log("Apagando Bluetooth...");
      setIsEnabled(false);
      bleManager.stopDeviceScan();
      if (connectedDevice) {
        connectedDevice.cancelConnection().catch(() => {});
        setConnectedDevice(null);
      }
    }
  };

  const sendData = async (device: Device, data: string): Promise<void> => {
    const payload = Buffer.from(data, "utf8").toString("base64");
    console.log("Enviando Base64:", payload);
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHAR_UUID,
      payload
    );
  };

  // ---------- CONEXIÓN ----------
  const connectToEsp32 = async (): Promise<Device | null> => {
    if (connectedDevice) {
      try {
        const ok = await connectedDevice.isConnected();
        if (ok) {
          console.log("Ya está conectado; reutilizando conexión");
          return connectedDevice;
        }
      } catch (_) {}
    }

    // Esperar 3 segundos para que el ESP32 reinicie y vuelva a anunciar
    await new Promise((res) => setTimeout(res, 3000));

    return new Promise((resolve, reject) => {
      console.log("Escaneando...");
      bleManager.startDeviceScan(null, null, async (error, device) => {
        if (error) {
          console.log("Error en escaneo:", error);
          reject(error);
          return;
        }

        if (device?.name === "ESP32_SERVER") {
          console.log("ESP32 encontrado, conectando...");

          bleManager.stopDeviceScan();

          try {
            const connected = await device.connect();
            console.log("Conectado a ESP32");

            await connected.discoverAllServicesAndCharacteristics();
            console.log("Servicios descubiertos");

            connected.monitorCharacteristicForService(
              SERVICE_UUID,
              CHAR_UUID,
              (err, char) => {
                if (err) console.log("Error monitor:", err);
              }
            );

            await new Promise((res) => setTimeout(res, 100));
            setConnectedDevice(connected);
            resolve(connected);
          } catch (e) {
            console.log("Error conectando:", e);
            reject(e);
          }
        }
      });

      setTimeout(() => {
        bleManager.stopDeviceScan();
        console.log("Tiempo agotado, no se encontró ESP32");
        resolve(null);
      }, 20000); // Aumentado a 20 segundos
    });
  };

  return (
    <BluetoothContext.Provider
      value={{
        isEnabled,
        connectToEsp32,
        sendData,
        toggleBluetooth,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error("useBluetooth must be inside BluetoothProvider");
  return ctx;
}
