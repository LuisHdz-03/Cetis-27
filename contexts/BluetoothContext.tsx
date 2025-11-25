import React, { createContext, ReactNode, useContext } from "react";
// import { BleManager, Device, State } from "react-native-ble-plx";

interface BluetoothContextType {
  // isEnabled: boolean;
  // systemState: State;
  // devices: Device[];
  // toggleBluetooth: () => void;
  // sendAttendanceData: (deviceId: string, data: object) => Promise<void>;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined
);

export function BluetoothProvider({ children }: { children: ReactNode }) {
  // const [isEnabled, setIsEnabled] = useState<boolean>(false);
  // const [systemState, setSystemState] = useState<State>(State.PoweredOff);
  // const [devices, setDevices] = useState<Device[]>([]);

  // const blBt = new BleManager();

  // BLE deshabilitado para Expo Go

  // Solo renderiza los children para Expo Go
  return <>{children}</>;
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (context === undefined) {
    throw new Error("useBluetooth debe ser usado dentro de BluetoothProvider");
  }
  return context;
}
