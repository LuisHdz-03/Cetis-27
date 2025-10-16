import { StyleSheet } from "react-native";
import { colors } from "./colors";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  instructionText: {
    fontSize: 15,
    color: colors.gray[600],
    textAlign: "center",
    marginTop: 32,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.gray[600],
  },
  errorText: {
    fontSize: 14,
    color: colors.red[600],
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 40,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
