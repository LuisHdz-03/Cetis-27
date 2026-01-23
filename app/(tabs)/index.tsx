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
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PerfilScreen() {
  const { logout, user } = useAuth();
  const { estudiante, isLoading, error, refreshData } = useEstudiante();
  const [uploading, setUploading] = useState(false);

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
        Alert.alert("Actualizar Foto?", "Se eliminara la foto actual.", [
          { text: "Calcelar", style: "cancel" },
          {
            text: "Actualizar",
            style: "default",
            onPress: () => uploadImage(nuevaUri),
          },
        ]);
      } else {
        uploadImage(result.assets[0].uri);
      }
    }
  };
  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();

      const filename = uri.split("/").pop() || "perfil.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("foto", { uri, name: filename, type } as any);

      const idPaEnviar =
        estudiante?.idUsuario || (user as any)?.idUsuario || (user as any)?.id;

      if (!idPaEnviar) {
        Alert.alert("Error", "No se encontró el ID del usuario");
        setUploading(false);
        return;
      }

      formData.append("idUsuario", String(idPaEnviar));

      const response = await fetch(`${API_BASE_URL}/api/usuarios/uploadFoto`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Error del Servidor (HTML):", errorText);
        Alert.alert("Error del Servidor");
        throw new Error("El servidor respondió con error: " + response.status);
      }

      const data = await response.json();

      Alert.alert("Foto actualizada correctamente.");
      await refreshData();
    } catch (error) {
      Alert.alert("Error", "Fallo al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };
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
    <View style={styles.safeArea}>
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
              <TouchableOpacity onPress={pickImage} disabled={uploading}>
                <View
                  style={[
                    styles.avatarContainer,
                    { overflow: "hidden", position: "relative" },
                  ]}
                >
                  {uploading ? (
                    <ActivityIndicator size={"large"} color={colors.primary} />
                  ) : estudiante.foto ? (
                    <Image
                      source={{ uri: estudiante.foto }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.avatarContainer}>
                      <Ionicons
                        name="person"
                        size={60}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

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
    </View>
  );
}
