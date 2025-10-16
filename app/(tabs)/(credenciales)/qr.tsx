import { colors } from "@/constants/colors";
import { styles } from "@/constants/qrStyles";
import { useEstudiante } from "@/hooks/useEstudiante";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QrScreen() {
  const { estudiante, isLoading, error, qrData, refreshData } = useEstudiante();

  // Estado de carga
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  // Estado de error
  if (error || !estudiante) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {error || "No se pudieron cargar los datos"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={280}
          color={colors.primary}
          backgroundColor={colors.white}
        />
      </View>
    </View>
  );
}
