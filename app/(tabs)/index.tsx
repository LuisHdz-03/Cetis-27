import { colors } from "@/constants/colors";
import { homeStyles as styles } from "@/constants/homeStyles";
import { useAuth } from "@/contexts/AuthContext";
import { useEstudiante } from "@/hooks/useEstudiante";
import { estudianteService } from "@/services/estudianteService";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function PerfilScreen() {
  const { logout } = useAuth();
  const { estudiante, isLoading, error, refreshData, registrarTutor } =
    useEstudiante();
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para el menú de configuración
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  const [guardandoTutor, setGuardandoTutor] = useState(false);
  const [formTutor, setFormTutor] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    parentesco: "",
    email: "",
    direccion: "",
  });

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
    setUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "perfil.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // @ts-ignore
      formData.append("fotoPerfil", { uri, name: filename, type });

      await estudianteService.subirFoto(formData);

      Alert.alert("Éxito", "Foto actualizada correctamente.");
      await refreshData();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Fallo al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleGuardarTutor = async () => {
    if (
      !formTutor.nombre ||
      !formTutor.apellidoPaterno ||
      !formTutor.telefono ||
      !formTutor.parentesco
    ) {
      Alert.alert(
        "Campos vacíos",
        "Por favor llena todos los campos obligatorios.",
      );
      return;
    }

    Alert.alert(
      "Confirmar Registro",
      "¿Estás seguro de que los datos son correctos? Esta acción no se puede deshacer desde la app.",
      [
        { text: "Revisar", style: "cancel" },
        {
          text: "Guardar",
          style: "default",
          onPress: async () => {
            setGuardandoTutor(true);
            const exito = await registrarTutor(formTutor);
            setGuardandoTutor(false);
            if (exito) {
              Alert.alert("¡Listo!", "Tutor registrado correctamente.");
            }
          },
        },
      ],
    );
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

  const handleCambiarPassword = async () => {
    const { passwordActual, passwordNueva, passwordConfirmar } = passwordForm;

    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (passwordNueva.length < 6) {
      Alert.alert(
        "Error",
        "La nueva contraseña debe tener al menos 6 caracteres",
      );
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden");
      return;
    }

    setCambiandoPassword(true);
    try {
      await estudianteService.cambiarPassword({
        passwordActual,
        passwordNueva,
      });

      Alert.alert("¡Éxito!", "Contraseña actualizada correctamente");
      setModalPasswordVisible(false);
      setPasswordForm({
        passwordActual: "",
        passwordNueva: "",
        passwordConfirmar: "",
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo cambiar la contraseña");
    } finally {
      setCambiandoPassword(false);
    }
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
              <TouchableOpacity
                style={headerStyles.settingsButtonInProfile}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons
                  name="settings-outline"
                  size={26}
                  color={colors.primary}
                />
              </TouchableOpacity>

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

            {/* SECCIÓN ACADÉMICA */}
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

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="people" size={20} color={colors.primary} />
                <Text style={styles.sectionTitle}>Tutor Legal</Text>
              </View>

              <View style={styles.infoCard}>
                {estudiante?.tutor ? (
                  <>
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
                    {estudiante.tutor.email && (
                      <>
                        <View style={styles.divider} />
                        <InfoRow
                          label="Email"
                          value={estudiante.tutor.email}
                          icon="mail"
                        />
                      </>
                    )}
                    {estudiante.tutor.direccion && (
                      <>
                        <View style={styles.divider} />
                        <InfoRow
                          label="Dirección"
                          value={estudiante.tutor.direccion}
                          icon="location"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <View style={customStyles.formContainer}>
                    <Text style={customStyles.formInstructions}>
                      Registra los datos de tu tutor. Una vez guardados, no
                      podrás editarlos.
                    </Text>

                    <TextInput
                      style={customStyles.input}
                      placeholder="Nombre(s)*"
                      value={formTutor.nombre}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, nombre: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Apellido Paterno*"
                      value={formTutor.apellidoPaterno}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, apellidoPaterno: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Apellido Materno*"
                      value={formTutor.apellidoMaterno}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, apellidoMaterno: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Teléfono a 10 dígitos*"
                      keyboardType="numeric"
                      maxLength={10}
                      value={formTutor.telefono}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, telefono: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Parentesco (Ej: Padre, Madre)*"
                      value={formTutor.parentesco}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, parentesco: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formTutor.email}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, email: t })
                      }
                    />
                    <TextInput
                      style={customStyles.input}
                      placeholder="Dirección"
                      value={formTutor.direccion}
                      placeholderTextColor={colors.primary}
                      onChangeText={(t) =>
                        setFormTutor({ ...formTutor, direccion: t })
                      }
                    />

                    <TouchableOpacity
                      style={customStyles.saveButton}
                      onPress={handleGuardarTutor}
                      disabled={guardandoTutor}
                    >
                      {guardandoTutor ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={customStyles.saveButtonText}>Guardar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal de menú de opciones */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={modalStyles.menuContainer}>
            <Text style={modalStyles.menuTitle}>Configuración</Text>

            <TouchableOpacity
              style={modalStyles.menuOption}
              onPress={() => {
                setMenuVisible(false);
                setModalPasswordVisible(true);
              }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={colors.primary}
              />
              <Text style={modalStyles.menuOptionText}>Cambiar Contraseña</Text>
            </TouchableOpacity>

            <View style={modalStyles.divider} />

            <TouchableOpacity
              style={[modalStyles.menuOption, { borderBottomWidth: 0 }]}
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color={colors.red[600]}
              />
              <Text
                style={[modalStyles.menuOptionText, { color: colors.red[600] }]}
              >
                Cerrar Sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={modalStyles.cancelButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de cambio de contraseña */}
      <Modal
        visible={modalPasswordVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalPasswordVisible(false)}
      >
        <TouchableOpacity
          style={modalStyles.overlay}
          activeOpacity={1}
          onPress={() => setModalPasswordVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={modalStyles.passwordContainer}>
              <View style={modalStyles.passwordHeader}>
                <Text style={modalStyles.passwordTitle}>
                  Cambiar Contraseña
                </Text>
                <TouchableOpacity
                  onPress={() => setModalPasswordVisible(false)}
                >
                  <Ionicons name="close" size={28} color={colors.gray[600]} />
                </TouchableOpacity>
              </View>

              <Text style={modalStyles.passwordInstruction}>
                La contraseña debe tener al menos 6 caracteres
              </Text>

              <TextInput
                style={modalStyles.passwordInput}
                placeholder="Contraseña actual*"
                placeholderTextColor={colors.gray[400]}
                secureTextEntry
                value={passwordForm.passwordActual}
                onChangeText={(t) =>
                  setPasswordForm({ ...passwordForm, passwordActual: t })
                }
              />

              <TextInput
                style={modalStyles.passwordInput}
                placeholder="Nueva contraseña*"
                placeholderTextColor={colors.gray[400]}
                secureTextEntry
                value={passwordForm.passwordNueva}
                onChangeText={(t) =>
                  setPasswordForm({ ...passwordForm, passwordNueva: t })
                }
              />

              <TextInput
                style={modalStyles.passwordInput}
                placeholder="Confirmar nueva contraseña*"
                placeholderTextColor={colors.gray[400]}
                secureTextEntry
                value={passwordForm.passwordConfirmar}
                onChangeText={(t) =>
                  setPasswordForm({ ...passwordForm, passwordConfirmar: t })
                }
              />

              <TouchableOpacity
                style={[
                  modalStyles.passwordButton,
                  cambiandoPassword && { opacity: 0.6 },
                ]}
                onPress={handleCambiarPassword}
                disabled={cambiandoPassword}
              >
                {cambiandoPassword ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={modalStyles.passwordButtonText}>
                    Actualizar Contraseña
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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

// Pequeños estilos extra para el formulario para no romper tu homeStyles.ts principal
const customStyles = StyleSheet.create({
  formContainer: {
    padding: 5,
  },
  formInstructions: {
    color: colors.naranjaRetardos,
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    fontStyle: "italic",
  },
  input: {
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
    fontSize: 14,
    color: colors.gray[800],
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

// Estilos para el engrane de configuración en el perfil
const headerStyles = StyleSheet.create({
  settingsButtonInProfile: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

// Estilos para los modales
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray[800],
    marginBottom: 15,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  menuOptionText: {
    fontSize: 16,
    color: colors.gray[700],
    marginLeft: 15,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.gray[600],
    fontWeight: "500",
  },
  passwordContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginTop: "50%",
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  passwordTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.gray[800],
  },
  passwordInstruction: {
    fontSize: 13,
    color: colors.gray[600],
    marginBottom: 20,
    fontStyle: "italic",
  },
  passwordInput: {
    backgroundColor: colors.gray[100],
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[200],
    fontSize: 15,
    color: colors.gray[800],
  },
  passwordButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  passwordButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
