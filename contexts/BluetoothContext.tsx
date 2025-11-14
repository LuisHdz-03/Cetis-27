import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { BleManager, Device, State } from "react-native-ble-plx";

interface BluetoothContextType {
  isEnabled: boolean;
  systemState: State;
  devices: Device[];
  toggleBluetooth: () => void;
  sendAttendanceData: (deviceId: string, data: object) => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined
);

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [systemState, setSystemState] = useState<State>(State.PoweredOff);
  const [devices, setDevices] = useState<Device[]>([]);

  const blBt = new BleManager();

  useEffect(() => {
    const sub = blBt.onStateChange((state: State) => {
      setSystemState(state);
    }, true);
    return () => {
      sub.remove();
      blBt.destroy();
    };
  }, []);

  const toggleBluetooth = async () => {
    if (!isEnabled) {
      // Solo iniciar escaneo si el Bluetooth está encendido
      if (systemState === State.PoweredOn) {
        startScan();
      }
    } else {
      stopScan();
    }
    setIsEnabled((prev) => !prev);
  };

  const startScan = () => {
    console.log("🔍 Iniciando escaneo BLE...");
    const disp: Device[] = [];

    blBt.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("❌ Error escaneando:", error);
        return;
      }

      // Solo mostramos dispositivos con nombre visible
      if (device && device.name) {
        // Filtra todos los ESP32 (pueden tener diferentes nombres)
        if (device.name.includes("ESP32")) {
          if (!disp.find((d) => d.id === device.id)) {
            disp.push(device);
            setDevices([...disp]);
            console.log("✅ ESP32 detectado:", device.name);
          }
        }
      }
    });
  };

  const stopScan = () => {
    blBt.stopDeviceScan();
  };

  // Simulación: Enviar datos de asistencia por Bluetooth a un ESP32
  const sendAttendanceData = async (deviceId: string, data: object) => {
    // Busca el dispositivo por id
    const device = devices.find((d) => d.id === deviceId);
    if (!device) {
      console.log("No se encontró el dispositivo con ese id");
      return;
    }
    try {
      // 2. Conectar al dispositivo
      const connectedDevice = await blBt.connectToDevice(device.id);
      // 3. Descubrir servicios y características
      await connectedDevice.discoverAllServicesAndCharacteristics();
      // 4. Buscar la característica donde se envían los datos (simulación)
      const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
      const CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";
      // 5. Convertir datos a string (puedes usar JSON.stringify)
      const payload = JSON.stringify(data);
      // 6. Enviar datos (writeCharacteristicWithResponse)
      await connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        Buffer.from(payload, "utf-8").toString("base64")
      );
      console.log("Datos enviados por Bluetooth:", payload);
    } catch (err: any) {
      if (err && err.message) {
        console.log("Error BLE:", err.message);
      } else {
        console.log("Error al enviar datos por Bluetooth:", err);
      }
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        isEnabled,
        systemState,
        devices,
        toggleBluetooth,
        sendAttendanceData,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error("useBluetooth debe ser usado dentro de BluetoothProvider");
  }
  return context;
}
