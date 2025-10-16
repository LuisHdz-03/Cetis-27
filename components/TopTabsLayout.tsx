import { BluetoothHeader } from "@/components/BluetoothHeader";
import { colors } from "@/constants/colors";
import { navStyles } from "@/constants/navStyles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

interface TabScreenConfig {
  name: string;
  title: string;
}

interface TopTabsLayoutProps {
  screens: TabScreenConfig[];
  initialRouteName?: string;
}

export function TopTabsLayout({
  screens,
  initialRouteName,
}: TopTabsLayoutProps) {
  return (
    <SafeAreaView style={navStyles.safeArea} edges={["top"]}>
      <BluetoothHeader />
      <View style={navStyles.tabsContainer}>
        <MaterialTopTabs
          initialRouteName={initialRouteName || screens[0]?.name}
          screenOptions={{
            tabBarIndicatorStyle: navStyles.tabIndicator,
            tabBarStyle: navStyles.tabBar,
            tabBarLabelStyle: navStyles.tabLabel,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray[600],
            tabBarItemStyle: navStyles.tabItem,
          }}
        >
          {screens.map((screen) => (
            <MaterialTopTabs.Screen
              key={screen.name}
              name={screen.name}
              options={{ title: screen.title }}
            />
          ))}
        </MaterialTopTabs>
      </View>
    </SafeAreaView>
  );
}
