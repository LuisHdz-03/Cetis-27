import AsistenciasModal from "@/components/AsistenciasModal";
import {
  iconSizes,
  pickerPropsIOS,
  styles,
} from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import { useAsistencias } from "@/hooks/useAsistencias";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
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
  const [selectPicker, setSelectPicker] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  const [diaFiltro, setDiaFiltro] = useState("");
  const [mesFiltro, setMesFiltro] = useState("");
  const [anioFiltro, setAnioFiltro] = useState("");

  // Usamos solo lo que el nuevo hook simplificado nos da
  const {
    asistencias,
    estadisticasGrupos,
    isLoading,
    error,
    fetchDatosAsistencia,
  } = useAsistencias();

  // Cargamos los datos al entrar o enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchDatosAsistencia();
    }, []),
  );

  // Generamos las opciones del Picker dinámicamente desde las estadísticas
  const opcionesMaterias = useMemo(() => {
    return estadisticasGrupos.map((est) => ({
      label: est.nombreMateria,
      value: est.nombreMateria,
    }));
  }, [estadisticasGrupos]);

  const openModal = (materiaNombre: string) => {
    setSelectedMateria(materiaNombre);
    setModalVisible(true);
  };

  // Filtramos las tarjetas según el Picker
  const gruposFiltrados = estadisticasGrupos.filter((grupo) => {
    if (selectPicker && grupo.nombreMateria !== selectPicker) return false;
    return true;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.filterCard}>
            <Text style={styles.title}>Asistencias</Text>
            <View style={styles.divider} />

            <View style={styles.pickerTouchable}>
              <RNPickerSelect
                placeholder={{ label: "Todas las materias", value: null }}
                value={selectPicker}
                onValueChange={(value) => setSelectPicker(value)}
                // SOLUCIÓN AL ERROR: Aseguramos que siempre sea un array
                items={opcionesMaterias}
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

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Día"
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
                placeholder="Año"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                maxLength={4}
                value={anioFiltro}
                onChangeText={setAnioFiltro}
              />
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.white} />
              <Text style={[styles.loadingText, { color: "white" }]}>
                Cargando asistencias...
              </Text>
            </View>
          ) : (
            <>
              {gruposFiltrados.map((grupo, index) => (
                <View key={index} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Ionicons
                      name="book-outline"
                      size={iconSizes.header}
                      color={colors.primary}
                    />
                    <Text style={styles.cardTitle}>{grupo.nombreMateria}</Text>
                    <TouchableOpacity
                      style={styles.detailsButton}
                      onPress={() => openModal(grupo.nombreMateria)}
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
                    <StatItem
                      icon="checkmark-circle"
                      color={colors.verdeAsistencia}
                      label="Asistencias"
                      value={grupo.asistencias}
                    />
                    <View style={styles.statDivider} />
                    <StatItem
                      icon="time-outline"
                      color={colors.naranjaRetardos}
                      label="Retardos"
                      value={grupo.retardos}
                    />
                    <View style={styles.statDivider} />
                    <StatItem
                      icon="close-circle"
                      color={colors.rojoFaltas}
                      label="Faltas"
                      value={grupo.faltas}
                    />
                  </View>

                  <View style={{ marginTop: 10, alignItems: "center" }}>
                    <Text style={{ fontSize: 12, color: colors.gray[600] }}>
                      Porcentaje: {grupo.porcentajeAsistencia}%
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          <AsistenciasModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            // Filtramos las asistencias detalladas para que el modal solo muestre las de esa materia
            asistenciasDetalladas={asistencias.filter(
              (a) => a.materia === selectedMateria,
            )}
            estadisticasMaterias={estadisticasGrupos}
            selectedMateria={selectedMateria}
            isLoading={isLoading}
            error={error}
            getMonthYearString={() => {
              const now = new Date();
              const meses = [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre",
              ];
              return `${meses[now.getMonth()]} ${now.getFullYear()}`;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// Componente pequeño para los items de estadísticas
function StatItem({ icon, color, label, value }: any) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={iconSizes.stat} color={color} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}
