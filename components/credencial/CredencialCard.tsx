import { colors } from "@/constants/colors";
import { styles } from "@/constants/credencialStyles";
import { useEstudiante } from "@/hooks/useEstudiante";
import { usePeriodo } from "@/hooks/usePeriodo";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated, { AnimatedStyle } from "react-native-reanimated";

interface EstudianteData {
  nombreCompleto: string;
  especialidad: string;
  semestre: number;
  numeroControl: string;
  email: string;
  telefono: string;
  fechaIngreso: string;
  codigoQr: string;
  curp: string;
  foto: string | null;
}

interface CredencialCardProps {
  estudiante: EstudianteData;
  onFlip: () => void;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
  showBack: boolean;
}

export function CredencialCard({
  estudiante,
  onFlip,
  frontAnimatedStyle,
  backAnimatedStyle,
  showBack,
}: CredencialCardProps) {
  const { qrData } = useEstudiante();
  const { periodo } = usePeriodo();
  const [qrModalVisible, setQrModalVisible] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onFlip}
      style={styles.cardContainer}
    >
      {/* PARTE FRONTAL */}
      <Animated.View
        style={[styles.card, styles.cardFront, frontAnimatedStyle]}
      >
        {/* Contenedor principal que ocupa el espacio disponible */}
        <View style={styles.contentContainer}>
          {/* FotosSEP */}
          <View style={styles.headerFotos}>
            <Image
              source={require("@/assets/images/SEP.png")}
              style={styles.imageSep}
            />
            <Image
              source={require("@/assets/images/DGETI.png")}
              style={styles.imageSep}
            />
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContentFront}>
            <View style={styles.fotoNoControl}>
              <View style={[styles.avatarContainer, { overflow: "hidden" }]}>
                {estudiante.foto ? (
                  <Image
                    source={{ uri: estudiante.foto }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={80} color={colors.primary} />
                )}
              </View>

              <Text style={styles.labelNControl}>NO. DE CONTROL</Text>
              <Text style={styles.numeroControl}>
                {estudiante.numeroControl}
              </Text>
            </View>

            {/* Información (lado derecho) */}
            <View style={styles.infoContainerFront}>
              <Text style={styles.cetisTitulo} numberOfLines={2}>
                CENTRO DE ESTUDIOS TECNOLÓGICOS INDUSTRIAL Y DE SERVICIOS No. 27
              </Text>
              <Text style={styles.labelAlumno}>ALUMNO(A)</Text>
              <Text style={styles.nombreFront} numberOfLines={2}>
                {estudiante.nombreCompleto}
              </Text>
              <Text style={styles.curp}>CURP</Text>
              <Text style={styles.curpValue}>{estudiante.curp}</Text>
            </View>
          </View>
        </View>

        <View style={styles.barraEspe}>
          <View style={styles.textoR}>
            <Text style={styles.textoCheuco}>
              ESPECIALIDAD {estudiante.especialidad}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* PARTE TRASERA */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.barraTurno}>
          <View style={styles.turnosYfechas}>
            {/*contenedor de los turnos y fechas*/}
            <View style={styles.soloTurnos}>
              <Text style={[styles.textoTurno, styles.margenesTexto1]}>
                SISTEMA ESCOLARIZADO
              </Text>
              <Text style={[styles.textoTurno, styles.margenesTexto2]}>
                TURNO MATUTINO
              </Text>
            </View>

            {/*contenedor de las fechas*/}
            {periodo && (
              <View style={styles.soloFechas}>
                <Text style={styles.textFechas}>FECHA DE EMISIÓN:</Text>
                <Text style={styles.fechas}>{periodo.fechaEmision}</Text>
                <Text style={styles.textFechas}>VIGENCIA:</Text>
                <Text style={styles.fechas}>{periodo.vigencia}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.stQrFt}>
          <TouchableOpacity
            style={styles.qr}
            onPress={(e) => {
              if (showBack) {
                e.stopPropagation();
                setQrModalVisible(true);
              }
            }}
            activeOpacity={showBack ? 0.7 : 1}
            disabled={!showBack}
          >
            {qrData ? (
              <QRCode
                value={qrData}
                size={70}
                color={colors.primary}
                backgroundColor={colors.white}
              />
            ) : (
              <Text style={styles.textoQR}>Sin QR</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divisor} />

          <View>
            <Image
              source={require("@/assets/images/DGETI.png")}
              style={styles.imgDEGTI}
            />
          </View>
        </View>
        <View style={styles.cajaBox}>
          <Text style={styles.textoDirePlante}>DIRECTOR DEL PLANTEL</Text>
          <Text style={styles.textosCesarCastro}>CESAR CASTRO GARCIA</Text>
        </View>
        <View style={styles.nuevoDivisor} />
        <View style={styles.stDirecciones}>
          <Text style={styles.labelDireccion}>DIRECCION DEL PLANTEL</Text>
          <Text style={styles.labelDosDirecc}>
            CARRETERA CARAPAN-URUAPAN KM 66.8 URUAPAN, MICHOACAN, CP.60000, TEL.
            5231509
          </Text>
        </View>
      </Animated.View>

      {/* Modal para QR ampliado */}
      <Modal
        visible={qrModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <Pressable
          style={styles.qrModalOverlay}
          onPress={() => setQrModalVisible(false)}
        >
          <View style={styles.qrModalContent}>
            {qrData ? (
              <View style={styles.qrModalQrContainer}>
                <QRCode
                  value={qrData}
                  size={250}
                  color={colors.primary}
                  backgroundColor={colors.white}
                />
              </View>
            ) : (
              <Text style={styles.textoQR}>Sin QR</Text>
            )}
            <TouchableOpacity
              style={styles.qrModalCloseButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Text style={styles.qrModalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </TouchableOpacity>
  );
}
