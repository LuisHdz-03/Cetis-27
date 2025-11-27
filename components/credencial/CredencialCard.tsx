import { colors } from "@/constants/colors";
import { styles } from "@/constants/credencialStyles";
import { useEstudiante } from "@/hooks/useEstudiante";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
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
}

interface CredencialCardProps {
  estudiante: EstudianteData;
  onFlip: () => void;
  frontAnimatedStyle: AnimatedStyle<ViewStyle>;
  backAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export function CredencialCard({
  estudiante,
  onFlip,
  frontAnimatedStyle,
  backAnimatedStyle,
}: CredencialCardProps) {
  const { qrData } = useEstudiante();
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
        {/* Header */}
        <View style={styles.headerFront}>
          <Text style={styles.institucionFront}>CETIS 27</Text>
        </View>

        {/* Contenido principal */}
        <View style={styles.mainContentFront}>
          {/* Icono de persona (lado izquierdo) */}
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={80} color={colors.primary} />
          </View>

          {/* Información (lado derecho) */}
          <View style={styles.infoContainerFront}>
            <Text style={styles.nombreFront} numberOfLines={2}>
              {estudiante.nombreCompleto}
            </Text>

            <Text style={styles.detalleTexto} numberOfLines={1}>
              {estudiante.especialidad}
            </Text>

            <Text style={styles.detalleTexto}>
              Semestre {estudiante.semestre}
            </Text>

            <Text style={styles.detalleTexto}>{estudiante.numeroControl}</Text>
          </View>
        </View>
      </Animated.View>

      {/* PARTE TRASERA */}
      <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
        <View style={styles.infoContainerBack}>
          <View style={styles.infoRowBack}>
            <Text style={styles.labelBack}>Correo Electrónico</Text>
            <Text style={styles.valueBack} numberOfLines={1}>
              {estudiante.email}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.infoRowBack}>
                <Text style={styles.labelBack}>Teléfono</Text>
                <Text style={styles.valueBack}>{estudiante.telefono}</Text>
              </View>
              <View style={styles.infoRowBack}>
                <Text style={styles.labelBack}>Fecha de Ingreso</Text>
                <Text style={styles.valueBack}>
                  {estudiante.fechaIngreso && estudiante.fechaIngreso !== "N/A"
                    ? (() => {
                        const fechaRaw = estudiante.fechaIngreso;
                        const fechaISO = fechaRaw.includes("T")
                          ? fechaRaw
                          : fechaRaw.replace(" ", "T");
                        const fecha = new Date(fechaISO);
                        return isNaN(fecha.getTime())
                          ? "Sin fecha"
                          : fecha.toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            });
                      })()
                    : "Sin fecha"}
                </Text>
              </View>
            </View>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "flex-start",
                marginLeft: 12,
                marginTop: -16,
              }}
            >
              {qrData ? (
                <QRCode
                  value={qrData}
                  size={100}
                  color={colors.primary}
                  backgroundColor={colors.white}
                />
              ) : (
                <Text style={{ color: colors.white, fontSize: 12 }}>
                  Sin QR
                </Text>
              )}
            </View>
          </View>
          <View style={styles.dividerBack} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
