import { colors } from "@/constants/colors";
import { navStyles } from "@/constants/navStyles";
import { useBluetooth } from "@/contexts/BluetoothContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, View } from "react-native";

export function BluetoothHeader() {
  const { isEnabled, toggleBluetooth } = useBluetooth();

  return (
    <View style={navStyles.header}>
      <Text style={navStyles.headerTitle}>CETIS 27</Text>
      <View style={navStyles.bluetoothContainer}>
        <Ionicons
          name={isEnabled ? "bluetooth" : "bluetooth-outline"}
          size={20}
          color={colors.white}
          style={navStyles.bluetoothIcon}
        />
        <Text style={navStyles.bluetoothText}>
          {isEnabled ? "Encendido" : "Apagado"}
        </Text>
        <Switch
          trackColor={{ false: colors.gray[400], true: colors.white }}
          thumbColor={isEnabled ? colors.primary : colors.white}
          ios_backgroundColor={colors.gray[400]}
          onValueChange={toggleBluetooth}
          value={isEnabled}
          style={navStyles.bluetoothSwitch}
        />
      </View>
    </View>
  );
}
