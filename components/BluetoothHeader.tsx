import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.white,
  },
  bluetoothContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bluetoothIcon: {
    marginRight: 8,
  },
  bluetoothText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "600",
  },
  bluetoothSwitch: {
    marginLeft: 8,
  },
});

export function BluetoothHeader() {
  // Simulación para Expo Go: estado local
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleBluetooth = () => setIsEnabled((prev) => !prev);

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>CETIS 27</Text>
      <View style={styles.bluetoothContainer}>
        <Ionicons
          name={isEnabled ? "bluetooth" : "bluetooth-outline"}
          size={20}
          color={colors.white}
          style={styles.bluetoothIcon}
        />
        <Text style={styles.bluetoothText}>
          {isEnabled ? "Encendido" : "Apagado"}
        </Text>
        <Switch
          trackColor={{ false: colors.gray[400], true: colors.white }}
          thumbColor={isEnabled ? colors.primary : colors.white}
          ios_backgroundColor={colors.gray[400]}
          onValueChange={toggleBluetooth}
          value={isEnabled}
          style={styles.bluetoothSwitch}
        />
      </View>
    </View>
  );
}
