import AsistenciasModal from "@/components/AsistenciasModal";
import {
  iconSizes,
  pickerPropsIOS,
  styles,
} from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { useAsistencias } from "@/hooks/useAsistencias";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function AsistenciasScreen() {
  // Obtener el estudianteId del contexto de autenticación
  const { user } = useAuth();
  const estudianteId = user?.estudianteId;

  // Estados locales para UI
  const [selectPicker, setSelectPicker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  const [diaFiltro, setDiaFiltro] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");

  const {
    asistencias,
    estadisticasGrupos,
    gruposParaPicker,
    isLoading,
    isLoadingStats,
    error,
    fetchGruposParaPicker,
    fetchEstadisticasGrupos,
    fetchAsistenciasDetalladas,
    getMonthYearString,
  } = useAsistencias();

  // Cargar grupos y estadísticas cuando estudianteId esté disponible
  useEffect(() => {
    if (estudianteId) {
      fetchGruposParaPicker(estudianteId);
      fetchEstadisticasGrupos(estudianteId);
    }
  }, [estudianteId]);

  // Recargar datos cuando la pantalla vuelve al foco
  useFocusEffect(
    useCallback(() => {
      if (estudianteId) {
        fetchEstadisticasGrupos(estudianteId);
      }
    }, [estudianteId]),
  );

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (modalVisible && selectedMateria && estudianteId) {
      fetchAsistenciasDetalladas(selectedMateria, estudianteId);
    }
  }, [modalVisible, selectedMateria, estudianteId]);

  const openModal = (materiaId: string) => {
    setSelectedMateria(materiaId);
    setModalVisible(true);
  };

  const gruposFiltrados = estadisticasGrupos.filter((grupo: any) => {
    if (selectPicker && grupo.grupoIdString !== selectPicker) {
      return false;
    }
    return true;
  });

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Card de filtros */}
          <View style={styles.filterCard}>
            {/* Título */}
            <Text style={styles.title}>Asistencias</Text>

            {/* Línea separadora */}
            <View style={styles.divider} />

            {/* Picker de materias */}
            <View style={styles.pickerTouchable}>
              <RNPickerSelect
                placeholder={{
                  label: "Selecciona una materia",
                  value: null,
                }}
                value={selectPicker}
                onValueChange={(value) => setSelectPicker(value)}
                items={gruposParaPicker} //  Datos dinámicos del backend
                style={{
                  inputIOS: styles.pickerInput,
                  inputAndroid: styles.pickerInput,
                  iconContainer: styles.pickerIconContainer,
                  placeholder: styles.pickerPlaceholder,
                }}
                useNativeAndroidPickerStyle={false}
                pickerProps={Platform.OS === "ios" ? pickerPropsIOS : {}}
                Icon={() => (
                  <Ionicons
                    name="chevron-down"
                    size={iconSizes.chevron}
                    color={colors.gray[600]}
                  />
                )}
              />
            </View>

            {/* Tres cajas de texto */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Dia"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                maxLength={2}
                value={diaFiltro}
                onChangeText={setDiaFiltro}
              />
              <TextInput
                style={styles.input}
                placeholder="Mes"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                maxLength={2}
                value={mesFiltro}
                onChangeText={setMesFiltro}
              />
              <TextInput
                style={styles.input}
                placeholder="año"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                maxLength={4}
                value={anioFiltro}
                onChangeText={setAnioFiltro}
              />
            </View>
          </View>

          {/* Cards dinámicas de materias */}
          {isLoadingStats ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Cargando materias...</Text>
            </View>
          ) : (
            <>
              {gruposFiltrados.map((grupo: any, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Ionicons
                      name="book-outline"
                      size={iconSizes.header}
                      color={colors.primary}
                    />
                    <Text style={styles.cardTitle}>
                      {grupo.nombreMateria} - Grupo {grupo.codigoGrupo}
                    </Text>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => openModal(grupo.grupoIdString)}
                    >
                      <Text style={styles.detailsButtonText}>detalles</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={iconSizes.stat}
                        color={colors.verdeAsistencia}
                      />
                      <Text style={styles.statLabel}>Asistencias</Text>
                      <Text style={styles.statValue}>
                        {grupo.totalAsistencias}
                      </Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <Ionicons
                        name="time-outline"
                        size={iconSizes.stat}
                        color={colors.naranjaRetardos}
                      />
                      <Text style={styles.statLabel}>Retardos</Text>
                      <Text style={styles.statValue}>
                        {grupo.totalRetardos}
                      </Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <Ionicons
                        name="close-circle"
                        size={iconSizes.stat}
                        color={colors.rojoFaltas}
                      />
                      <Text style={styles.statLabel}>Faltas</Text>
                      <Text style={styles.statValue}>{grupo.totalFaltas}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {!isLoadingStats && gruposFiltrados.length === 0 && (
                <View style={{ alignItems: "center", marginTop: 20 }}>
                  <Text style={{ color: colors.gray[50] }}>
                    No se encontró la materia seleccionada.
                  </Text>
                </View>
              )}
            </>
          )}

          {/* Modal de detalles */}
          <AsistenciasModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            asistenciasDetalladas={asistencias}
            estadisticasMaterias={estadisticasGrupos}
            selectedMateria={selectedMateria}
            isLoading={isLoading}
            error={error}
            getMonthYearString={getMonthYearString}
          />
        </View>
      </ScrollView>
    </>
  );
}
