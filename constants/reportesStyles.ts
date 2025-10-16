import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.primary,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: colors.white },
  closeButton: { padding: 4 },
  scrollContent: { padding: 16 },
  reportHeader: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reportPeriod: { fontSize: 14, color: colors.gray[700], marginBottom: 4 },
  reportName: { fontSize: 16, fontWeight: "600", color: colors.gray[800] },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray[800],
    marginBottom: 12,
  },
  centerBox: { alignItems: "center", padding: 24 },
  textMuted: { fontSize: 14, color: colors.gray[700] },
  noDataText: {
    fontStyle: "italic",
    color: colors.gray[700],
    textAlign: "center",
  },
  errorBox: {
    backgroundColor: colors.red[50],
    borderWidth: 1,
    borderColor: colors.red[100],
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  errorText: { color: colors.red[700], marginBottom: 8, textAlign: "center" },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: { color: colors.white, fontWeight: "500" },
  // Estilos para incidencias
  incidenciaCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  incidenciaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
    paddingBottom: 0,
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  incidenciaTitle: { marginLeft: 6, fontWeight: "600" },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  detailGroup: { marginBottom: 12, marginTop: 12 },
  detailRow: { flexDirection: "row", marginBottom: 4 },
  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.gray[700],
    width: 90,
  },
  detailValue: { fontSize: 13, color: colors.gray[800], flex: 1 },
  // Descripción con borde naranja
  descripcionContainer: {
    flexDirection: "row",
    marginTop: 8,
    backgroundColor: colors.orange[50],
    borderRadius: 8,
    overflow: "hidden",
  },
  orangeBorder: {
    width: 4,
    backgroundColor: colors.orange[500],
  },
  descripcionContent: {
    flex: 1,
    padding: 12,
  },
  descripcionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.orange[500],
    marginBottom: 6,
  },
  descripcionText: {
    fontSize: 13,
    color: colors.gray[700],
    lineHeight: 20,
  },
});
