import { API_BASE_URL } from "@/constants/api";
import { colors } from "@/constants/colors";
import { homeStyles as styles } from "@/constants/homeStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useEstudiante } from "@/hooks/useEstudiante";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PerfilScreen() {
  const { logout, token } = useAuth();
  const { estudiante, isLoading, error, refreshData } = useEstudiante();
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesitan permisos para acceder a las fotos.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const nuevaUri = result.assets[0].uri;
      if (estudiante?.foto) {
        Alert.alert("¿Actualizar Foto?", "Se reemplazará la foto actual.", [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Actualizar",
            style: "default",
            onPress: () => uploadImage(nuevaUri),
          },
        ]);
      } else {
        uploadImage(nuevaUri);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    console.log("[UPLOAD] Iniciando subida de foto");
    console.log("[UPLOAD] URI de imagen:", uri);

    setUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "perfil.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      console.log("[UPLOAD] Nombre de archivo:", filename);
      console.log("[UPLOAD] Tipo de archivo:", type);

      // @ts-ignore
      formData.append("fotoPerfil", { uri, name: filename, type });

      const endpoint = `${API_BASE_URL}/api/movil/perfil/foto`;
      console.log("[UPLOAD] Endpoint:", endpoint);
      console.log("[UPLOAD] Token presente:", token ? "Sí" : "No");

      const response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("[UPLOAD] Status de respuesta:", response.status);
      console.log("[UPLOAD] Response OK:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[UPLOAD] Error del servidor:", errorData);
        throw new Error(errorData.error || "Error al subir la imagen");
      }

      const responseData = await response.json();
      console.log("[UPLOAD] Respuesta exitosa:", responseData);

      Alert.alert("Éxito", "Foto actualizada correctamente.");
      await refreshData();
    } catch (error: any) {
      console.error("[UPLOAD] Error capturado:", error);
      console.error("[UPLOAD] Mensaje de error:", error.message);
      console.error("[UPLOAD] Stack:", error.stack);
      Alert.alert("Error", error.message || "Fallo al subir la imagen.");
    } finally {
      setUploading(false);
      console.log("[UPLOAD] Proceso finalizado");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
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
    <View style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando perfil...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={64} color={colors.red[600]} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
              <Text style={styles.retryButtonText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.profileHeader}>
              <TouchableOpacity onPress={pickImage} disabled={uploading}>
                <View style={[styles.avatarContainer, { overflow: "hidden" }]}>
                  {uploading ? (
                    <ActivityIndicator size="large" color={colors.primary} />
                  ) : estudiante?.foto ? (
                    <Image
                      source={{ uri: estudiante.foto }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Ionicons name="person" size={60} color={colors.primary} />
                  )}
                </View>
                <View style={styles.editIconBadge}>
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              </TouchableOpacity>

              <Text style={styles.studentName}>
                {estudiante?.nombreCompleto}
              </Text>
              <Text style={styles.studentRole}>
                Alumno(a) • {estudiante?.numeroControl}
              </Text>
            </View>

            {/* Sección Académica */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Académico</Text>
              </View>
              <View style={styles.infoCard}>
                <InfoRow
                  label="Especialidad"
                  value={estudiante?.especialidad}
                  icon="briefcase"
                />
                <View style={styles.divider} />
                <InfoRow
                  label="Semestre/Grupo"
                  value={`${estudiante?.semestre}° ${estudiante?.grupoNombre} - ${estudiante?.turno}`}
                  icon="ribbon"
                />
              </View>
            </View>

            {/* Sección Tutor (Si existe) */}
            {estudiante?.tutor && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="people" size={20} color={colors.primary} />
                  <Text style={styles.sectionTitle}>Tutor Legal</Text>
                </View>
                <View style={styles.infoCard}>
                  <InfoRow
                    label="Nombre"
                    value={estudiante.tutor.nombre}
                    icon="person-circle"
                  />
                  <View style={styles.divider} />
                  <InfoRow
                    label="Parentesco"
                    value={estudiante.tutor.parentesco}
                    icon="heart"
                  />
                  <View style={styles.divider} />
                  <InfoRow
                    label="Teléfono"
                    value={estudiante.tutor.telefono}
                    icon="call"
                  />
                </View>
              </View>
            )}

            <View style={styles.logoutContainer}>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Ionicons
                  name="log-out"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon: any;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLabelContainer}>
        <Ionicons name={icon} size={18} color={colors.gray[600]} />
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value || "No asignado"}</Text>
    </View>
  );
}
