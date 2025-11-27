import { BluetoothHeader } from "@/components/BluetoothHeader";
import { colors } from "@/constants/colors";
import { homeStyles as styles } from "@/constants/homeStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useEstudiante } from "@/hooks/useEstudiante";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PerfilScreen() {
  const { logout } = useAuth();
  const { estudiante, isLoading, error, refreshData } = useEstudiante();

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <BluetoothHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando información...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={colors.red[600]} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
              <Ionicons
                name="refresh"
                size={20}
                color={colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : estudiante ? (
          <>
            {/* Avatar y nombre destacado */}
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={60} color={colors.primary} />
              </View>
              <Text style={styles.studentName}>
                {estudiante.nombreCompleto}
              </Text>
              <View style={styles.badgeContainer}>
                <Ionicons name="school" size={14} color={colors.primary} />
                <Text style={styles.studentRole}>Estudiante</Text>
              </View>
            </View>

            {/* Tarjeta de información académica */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Información Académica</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons name="mail" size={18} color={colors.gray[600]} />
                    <Text style={styles.infoLabel}>Correo</Text>
                  </View>
                  <Text
                    style={[
                      styles.infoValue,
                      { fontSize: 14, flexWrap: "wrap" },
                    ]}
                  >
                    {estudiante.email}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons
                      name="briefcase"
                      size={18}
                      color={colors.gray[600]}
                    />
                    <Text style={styles.infoLabel}>Especialidad</Text>
                  </View>
                  <Text style={styles.infoValue} numberOfLines={2}>
                    {estudiante.especialidad}
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons name="book" size={18} color={colors.gray[600]} />
                    <Text style={styles.infoLabel}>Semestre</Text>
                  </View>
                  <Text style={styles.infoValue}>
                    {estudiante.semestre}° Semestre
                  </Text>
                </View>
              </View>
            </View>

            {/* Tarjeta de información de contacto */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="call" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Información de Contacto</Text>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons name="mail" size={18} color={colors.gray[600]} />
                    <Text style={styles.infoLabel}>Correo</Text>
                  </View>
                  <Text style={styles.infoValueEmail}>{estudiante.email}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <Ionicons
                      name="phone-portrait"
                      size={18}
                      color={colors.gray[600]}
                    />
                    <Text style={styles.infoLabel}>Teléfono</Text>
                  </View>
                  <Text style={styles.infoValue}>{estudiante.telefono}</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Ionicons
              name="log-out"
              size={20}
              color={colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
