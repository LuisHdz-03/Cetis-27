import { colors } from "@/constants/colors";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  tabsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabIndicator: {
    backgroundColor: colors.primary,
    height: 3,
  },
  tabBar: {
    backgroundColor: colors.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
  },
  tabItem: {
    paddingHorizontal: 16,
  },
});

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
    <View style={styles.safeArea}>
      <View style={styles.tabsContainer}>
        <MaterialTopTabs
          initialRouteName={initialRouteName || screens[0]?.name}
          screenOptions={{
            tabBarIndicatorStyle: styles.tabIndicator,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.gray[600],
            tabBarItemStyle: styles.tabItem,
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
    </View>
  );
}
