import { StyleSheet } from "react-native";
import { colors } from "./colors";

// Estilos comunes reutilizables en toda la app
export const commonStyles = StyleSheet.create({
  // === CONTENEDORES ===
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerPadding: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // === CARDS Y SOMBRAS ===
  card: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  cardWithShadow: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 15,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  shadowStrong: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },

  // === INPUTS ===
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.gray[50],
  },
  inputError: {
    borderWidth: 1,
    borderColor: colors.red[600],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.gray[50],
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[800],
    marginBottom: 8,
  },

  // === BOTONES ===
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.gray[200],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDanger: {
    backgroundColor: colors.red[600],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: colors.gray[400],
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonOutline: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: "transparent",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSmall: {
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  // === TEXTOS DE BOTONES ===
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextPrimary: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    color: colors.gray[800],
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextOutline: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextSmall: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  // === TEXTOS ===
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.gray[800],
  },
  titlePrimary: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.gray[800],
  },
  text: {
    fontSize: 16,
    color: colors.gray[800],
  },
  textSecondary: {
    fontSize: 16,
    color: colors.gray[600],
  },
  textSmall: {
    fontSize: 14,
    color: colors.gray[600],
  },
  textBold: {
    fontWeight: "bold",
  },
  textCenter: {
    textAlign: "center",
  },
  link: {
    color: colors.primary,
    textDecorationLine: "underline",
  },

  // === ESPACIADOS ===
  mb5: { marginBottom: 5 },
  mb10: { marginBottom: 10 },
  mb15: { marginBottom: 15 },
  mb20: { marginBottom: 20 },
  mb30: { marginBottom: 30 },
  mt5: { marginTop: 5 },
  mt10: { marginTop: 10 },
  mt15: { marginTop: 15 },
  mt20: { marginTop: 20 },
  mt30: { marginTop: 30 },
  p10: { padding: 10 },
  p15: { padding: 15 },
  p20: { padding: 20 },

  // === BORDES ===
  rounded: { borderRadius: 8 },
  roundedLg: { borderRadius: 12 },
  roundedFull: { borderRadius: 9999 },

  // === DIVIDERS ===
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 15,
  },
});

// Re-exportar colores para fácil acceso
export { colors } from "./colors";
