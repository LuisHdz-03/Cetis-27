import React, { createContext, ReactNode, useContext, useState } from "react";

interface BluetoothContextType {
  isEnabled: boolean;
  toggleBluetooth: () => void;
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(
  undefined
);

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleBluetooth = () => {
    setIsEnabled((previousState) => !previousState);
    // TODO: Aquí puedes agregar la lógica real de Bluetooth
    // Por ejemplo, conectar/desconectar dispositivo BLE
  };

  return (
    <BluetoothContext.Provider value={{ isEnabled, toggleBluetooth }}>
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
