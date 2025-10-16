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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  cardContainer: {
    width: "100%",
    maxWidth: 380,
    height: 220,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  // ESTILOS PARTE FRONTAL
  cardFront: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  headerFront: {
    marginBottom: 16,
  },
  institucionFront: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 2,
  },
  mainContentFront: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 16,
  },
  infoContainerFront: {
    flex: 1,
    justifyContent: "center",
  },
  nombreFront: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 12,
    lineHeight: 20,
  },
  detalleTexto: {
    fontSize: 13,
    color: colors.gray[700],
    fontWeight: "500",
    marginBottom: 6,
  },
  // ESTILOS PARTE TRASERA
  cardBack: {
    backgroundColor: colors.primary,
  },
  infoContainerBack: {
    flex: 1,
    paddingTop: 20,
  },
  infoRowBack: {
    marginBottom: 10,
  },
  labelBack: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
    fontWeight: "600",
    marginBottom: 2,
  },
  valueBack: {
    fontSize: 13,
    color: colors.white,
    fontWeight: "500",
  },
  dividerBack: {
    height: 1,
    backgroundColor: colors.white,
    opacity: 0.3,
    marginVertical: 10,
  },
  codigoContainerBack: {
    marginTop: 4,
  },
  codigoLabelBack: {
    fontSize: 10,
    color: colors.white,
    opacity: 0.8,
    fontWeight: "600",
    marginBottom: 4,
  },
  codigoValueBack: {
    fontSize: 10,
    color: colors.white,
    fontFamily: "monospace",
    opacity: 0.9,
  },
  footerBack: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.white,
    opacity: 0.5,
  },
  footerTextBack: {
    fontSize: 9,
    color: colors.white,
    textAlign: "center",
    fontStyle: "italic",
  },
});
