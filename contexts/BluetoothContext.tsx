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
    const disp: Device[] = [];

    blBt.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return;
      }
      if (device && !disp.find((d) => d.id === device.id)) {
        disp.push(device);
        setDevices([...disp]);
      }
    });
  };

  const stopScan = () => {
    blBt.stopDeviceScan();
  };

  return (
    <BluetoothContext.Provider
      value={{ isEnabled, systemState, devices, toggleBluetooth }}
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
