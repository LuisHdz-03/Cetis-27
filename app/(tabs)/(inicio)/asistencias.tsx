import AsistenciasModal from "@/components/AsistenciasModal";
import {
  iconSizes,
  pickerPropsIOS,
  styles,
} from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import { useAsistencias } from "@/hooks/useAsistencias";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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
  // Estados locales para UI
  const [selectPicker, setSelectPicker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  // Hook personalizado para toda la lógica de backend
  const {
    asistencias,
    estadisticasGrupos,
    gruposParaPicker,
    isLoading,
    isLoadingStats,
    error,
    fetchAsistenciasDetalladas,
    getMonthYearString,
  } = useAsistencias();

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (modalVisible && selectedMateria) {
      fetchAsistenciasDetalladas(selectedMateria);
    }
  }, [modalVisible, selectedMateria]);

  const openModal = (materiaId: string) => {
    setSelectedMateria(materiaId);
    setModalVisible(true);
  };

  return (
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
            />
            <TextInput
              style={styles.input}
              placeholder="Mes"
              placeholderTextColor={colors.gray[400]}
            />
            <TextInput
              style={styles.input}
              placeholder="año"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numeric"
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
          estadisticasGrupos.map((grupo, index) => (
            <View key={grupo.idGrupo} style={styles.card}>
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
                  onPress={() => openModal(String(grupo.idGrupo))}
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
                  <Text style={styles.statValue}>{grupo.totalAsistencias}</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Ionicons
                    name="time-outline"
                    size={iconSizes.stat}
                    color={colors.naranjaRetardos}
                  />
                  <Text style={styles.statLabel}>Retardos</Text>
                  <Text style={styles.statValue}>{grupo.totalRetardos}</Text>
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
          ))
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
  );
}
