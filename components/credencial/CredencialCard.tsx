import { colors } from "@/constants/colors";
import { styles } from "@/constants/credencialStyles";
import { DatosCredencial } from "@/types/database";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

interface CredencialCardProps {
  estudiante: DatosCredencial;
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
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // 2. ESTADO PARA EL RELOJ INTERNO DEL QR
  const [timestamp, setTimestamp] = useState(Date.now());

  // 3. CRONÓMETRO: Refresca el tiempo cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(Date.now());
    }, 30000); // 30000 ms = 30 segundos

    return () => clearInterval(interval); // Limpieza al cerrar la app
  }, []);

  // 4. CREAMOS EL STRING DEL QR EN VIVO (Matricula|TiempoActual)
  const qrStringSeguro = estudiante.noControl
    ? `${estudiante.noControl}|${timestamp}`
    : null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onFlip}
      style={styles.cardContainer}
    >
      {/* --- CARA FRONTAL --- */}
      <Animated.View
        style={[styles.card, styles.cardFront, frontAnimatedStyle]}
      >
        <View style={styles.contentContainer}>
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
          <View style={styles.mainContentFront}>
            <View style={styles.fotoNoControl}>
              <View style={[styles.avatarContainer, { overflow: "hidden" }]}>
                {estudiante.foto ? (
                  <Image
                    source={{ uri: estudiante.foto }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Ionicons name="person" size={80} color={colors.primary} />
                )}
              </View>
              <Text style={styles.labelNControl}>NO. DE CONTROL</Text>
              <Text style={styles.numeroControl}>{estudiante.noControl}</Text>
            </View>

            <View style={styles.infoContainerFront}>
              <Text style={styles.cetisTitulo} numberOfLines={2}>
                CENTRO DE ESTUDIOS TECNOLÓGICOS INDUSTRIAL Y DE SERVICIOS No. 27
              </Text>
              <Text style={styles.labelAlumno}>ALUMNO(A)</Text>
              <Text style={styles.nombreFront} numberOfLines={2}>
                {estudiante.nombreCompleto}
              </Text>
              <Text style={styles.curp}>CURP</Text>
              <Text style={styles.curpValue}>
                {estudiante.curp || "Sin CURP"}
              </Text>
              <Text style={styles.curp}>GRUPO</Text>
              <Text style={styles.curpValue}>{estudiante.grupo || "N/A"}</Text>
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

      {/* --- CARA TRASERA --- */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.barraTurno}>
          <View style={styles.turnosYfechas}>
            <View style={styles.soloTurnos}>
              <Text style={[styles.textoTurno, styles.margenesTexto1]}>
                SISTEMA ESCOLARIZADO
              </Text>
              <Text style={[styles.textoTurno, styles.margenesTexto2]}>
                TURNO {estudiante.turno}
              </Text>
              <Text style={[styles.textoTurno, styles.margenesTexto2]}>
                GRUPO {estudiante.grupo || "N/A"}
              </Text>
            </View>

            <View style={styles.soloFechas}>
              <Text style={styles.textFechas}>FECHA DE EMISIÓN:</Text>
              <Text style={styles.fechas}>{estudiante.emision}</Text>
              <Text style={styles.textFechas}>VIGENCIA:</Text>
              <Text style={styles.fechas}>{estudiante.vigencia}</Text>
            </View>
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
            {/* 5. APLICAMOS EL COMPONENTE QRCode AQUÍ */}
            {qrStringSeguro ? (
              <View style={{ backgroundColor: "white", padding: 2 }}>
                <QRCode value={qrStringSeguro} size={66} />
              </View>
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

      {/* --- MODAL DEL QR AMPLIADO --- */}
      <Modal visible={qrModalVisible} transparent={true} animationType="fade">
        <Pressable
          style={styles.qrModalOverlay}
          onPress={() => setQrModalVisible(false)}
        >
          <View style={styles.qrModalContent}>
            {/* 6. APLICAMOS EL COMPONENTE QRCode EN EL MODAL */}
            {qrStringSeguro && (
              <View
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 10,
                }}
              >
                <QRCode value={qrStringSeguro} size={250} />
              </View>
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
