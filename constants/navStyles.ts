import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const navStyles = StyleSheet.create({
  // ===== SAFE AREA VIEW =====
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  // ===== HEADER =====
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
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
    opacity: 0.9,
  },

  // ===== BLUETOOTH SWITCH =====
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

  // ===== TABS CONTAINER =====
  tabsContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // ===== INDICADOR (línea debajo del tab activo) =====
  tabIndicator: {
    backgroundColor: colors.primary,
    height: 3,
  },

  // ===== BARRA DE TABS =====
  tabBar: {
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // ===== ETIQUETAS (textos de los tabs) =====
  tabLabel: {
    textTransform: "capitalize" as const,
    fontWeight: "bold" as const,
    fontSize: 16,
  },

  // ===== ITEMS DE TABS =====
  tabItem: {
    paddingVertical: 10,
  },
});
