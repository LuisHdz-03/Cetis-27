import { Tabs } from "expo-router";
import React from "react";

import { Ionicons } from "@expo/vector-icons";

import { HapticTab } from "@/components/haptic-tab";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BluetoothProvider } from "@/contexts/BluetoothContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ProtectedRoute>
      <BluetoothProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "#691C32",
            tabBarInactiveTintColor: "#8e8e93",
            tabBarStyle: {
              backgroundColor: "#ffffff",
              borderTopColor: "#e0e0e0",
              borderTopWidth: 1,
              height: 80,
              paddingBottom: 20,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
            },
            headerShown: false,
            tabBarButton: HapticTab,
          }}
        >
          <Tabs.Screen
            name="(inicio)"
            options={{
              title: "Inicio",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="(credenciales)"
            options={{
              title: "Credenciales",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="qr-code" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: "Perfil",
              tabBarIcon: ({ color, size }) => (
                <Ionicons size={size} name="person-outline" color={color} />
              ),
            }}
          />
        </Tabs>
      </BluetoothProvider>
    </ProtectedRoute>
  );
}
