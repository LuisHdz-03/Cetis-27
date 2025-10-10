import { navStyles } from "@/constants/navStyles";
import { colors } from "@/constants/styles";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

export default function InicioLayout() {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={navStyles.safeArea} edges={["top"]}>
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
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={navStyles.bluetoothSwitch}
          />
        </View>
      </View>
      <View style={navStyles.tabsContainer}>
        <MaterialTopTabs
          initialRouteName="asistencias"
          screenOptions={{
            tabBarIndicatorStyle: navStyles.tabIndicator,
            tabBarStyle: navStyles.tabBar,
            tabBarLabelStyle: navStyles.tabLabel,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray[600],
            tabBarItemStyle: navStyles.tabItem,
          }}
        >
          <MaterialTopTabs.Screen
            name="asistencias"
            options={{ title: "Asistencias" }}
          />
          <MaterialTopTabs.Screen
            name="reportes"
            options={{ title: "Reportes" }}
          />
        </MaterialTopTabs>
      </View>
    </SafeAreaView>
  );
}
