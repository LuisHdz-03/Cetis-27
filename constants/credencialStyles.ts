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

  cardContainer: {
    width: "100%",
    maxWidth: 380,
    height: 245,
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerFotos: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    marginBottom: 4,
    margin: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  barraEspe: {
    width: 38,
    height: "100%",
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },
  textoCheuco: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  textoR: {
    transform: [{ rotate: "90deg" }],
    width: 250,
    alignItems: "center",
  },
  // ESTILOS PARTE FRONTAL
  cardFront: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContentFront: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 8,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: colors.gray[100],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  infoContainerFront: {
    flex: 1,
    paddingTop: 8,
  },
  nombreFront: {
    fontSize: 15,
    color: colors.black,
    marginBottom: 6,
  },
  detalleTexto: {
    fontSize: 12,
    marginBottom: 6,
  },
  imageSep: {
    width: 120,
    height: 50,
    resizeMode: "contain",
  },
  // ESTILOS PARTE TRASERA
  cardBack: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  barraTurno: {
    width: "100%",
    height: 50,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 14,
  },
  turnosYfechas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 7,
  },
  textoTurno: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.white,
    marginTop: 8,
  },
  margenesTexto1: { marginStart: 48 },
  margenesTexto2: { paddingLeft: 83 },
  soloTurnos: {
    flexDirection: "column",
  },
  soloFechas: {
    flexDirection: "column",
    marginTop: 5,
  },
  textFechas: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "600",
    textAlign: "right",
  },
  fechas: {
    color: colors.white,
    fontSize: 8,
    textAlign: "right",
  },
  fotoNoControl: {
    alignItems: "center",
    marginRight: 13,
    marginStart: 16,
  },
  labelNControl: {
    fontSize: 10,
    color: colors.gray[600],
    marginTop: 6,
  },
  numeroControl: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  cetisTitulo: {
    fontSize: 7,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 5,
  },
  labelAlumno: {
    fontSize: 12,
    color: colors.primary,
  },
  curp: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.primary,
  },
  curpValue: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.gray[700],
    marginBottom: 8,
  },
  //alineacion del qr y foto
  stQrFt: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 7,
    paddingHorizontal: 15,
  },
  imgDEGTI: {
    width: 160,
    height: 65,
    resizeMode: "contain",
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: colors.primary,
    marginStart: 30,
    marginEnd: 5,
  },
  // ESTILOS DE CODIGO QR
  qr: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  textoQR: {
    color: colors.white,
    fontSize: 12,
  },
  //caja del cesar castro
  cajaBox: {
    width: 240,
    height: 50,
    borderColor: colors.doradoMorena,
    borderWidth: 2,
    alignSelf: "center",
    marginTop: 8,
    alignItems: "center",
  },
  textoDirePlante: {
    fontSize: 9,
    color: colors.doradoMorena,
    paddingTop: 20,
    fontWeight: "800",
  },
  textosCesarCastro: {
    fontSize: 8,
    color: colors.primary,
    fontWeight: "700",
  },
  nuevoDivisor: {
    width: "95%",
    height: 1.5,
    backgroundColor: colors.primary,
    alignSelf: "center",
    marginTop: 5,
  },
  stDirecciones: {
    alignItems: "center",
    margin: 9,
  },
  labelDireccion: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "800",
  },
  labelDosDirecc: {
    fontSize: 6,
    fontWeight: "600",
  },
  // ESTILOS DEL MODAL DE QR
  qrModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  qrModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    minWidth: 320,
  },
  qrModalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 20,
  },
  qrModalQrContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  qrModalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.gray[700],
    textAlign: "center",
    marginBottom: 8,
  },
  qrModalControl: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 20,
  },
  qrModalCloseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  qrModalCloseText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
