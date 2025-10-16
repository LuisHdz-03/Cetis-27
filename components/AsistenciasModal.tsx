import { styles } from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import {
  AsistenciaDetallada,
  EstadisticasMateria,
} from "@/hooks/useAsistencias";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AsistenciasModalProps {
  visible: boolean;
  onClose: () => void;
  asistenciasDetalladas: AsistenciaDetallada[];
  estadisticasMaterias: EstadisticasMateria[];
  selectedMateria: string | null;
  isLoading: boolean;
  error: string | null;
  getMonthYearString: () => string;
}

export default function AsistenciasModal({
  visible,
  onClose,
  asistenciasDetalladas,
  estadisticasMaterias,
  selectedMateria,
  isLoading,
  error,
  getMonthYearString,
}: AsistenciasModalProps) {
  // Función para obtener datos de la tabla
  const getTableData = () => {
    if (asistenciasDetalladas.length === 0) {
      return { fechasUnicas: [], tabla: {} };
    }

    // Obtener fechas únicas ordenadas
    const fechasUnicas = Array.from(
      new Set(asistenciasDetalladas.map((a) => a.fecha))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Crear objeto con los datos organizados por fecha
    const tabla: Record<
      string,
      {
        asistencia: number;
        retardo: number;
        falta: number;
        hora?: string; // Hora del primer registro de ese día
      }
    > = {};

    fechasUnicas.forEach((fecha) => {
      tabla[fecha] = { asistencia: 0, retardo: 0, falta: 0 };
    });

    asistenciasDetalladas.forEach((item) => {
      if (tabla[item.fecha]) {
        tabla[item.fecha][item.tipo]++;
        // Guardar la hora del primer registro encontrado para esa fecha
        if (!tabla[item.fecha].hora && item.hora) {
          tabla[item.fecha].hora = item.hora;
        }
      }
    });

    return { fechasUnicas, tabla };
  };

  const { fechasUnicas, tabla } = getTableData();

  // Función para formatear fecha a DD/MM/AAAA
  const formatearFecha = (fecha: string) => {
    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {estadisticasMaterias.find((m) => m.materiaId === selectedMateria)
                ?.materiaNombre || "Materia"}{" "}
              - {getMonthYearString()}
            </Text>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.modalBodyContent}
          >
            {/* Estado de carga */}
            {isLoading ? (
              <View style={styles.emptyState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.emptyStateText}>
                  Cargando asistencias...
                </Text>
              </View>
            ) : error ? (
              /* Estado de error */
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Error: {error}</Text>
              </View>
            ) : asistenciasDetalladas.length === 0 ? (
              /* Estado vacío */
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No hay asistencias registradas
                </Text>
              </View>
            ) : (
              /* Tabla estilo Excel */
              <View style={styles.tableContainer}>
                {/* Encabezados */}
                <View style={styles.tableRow}>
                  <View style={[styles.headerCell, styles.firstColumn]}>
                    <Text style={styles.headerText}>Fecha</Text>
                  </View>
                  <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Asist.</Text>
                  </View>
                  <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Retard.</Text>
                  </View>
                  <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Faltas</Text>
                  </View>
                </View>

                {/* Filas de datos */}
                {fechasUnicas.map((fecha, index) => (
                  <View
                    key={fecha}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowEven,
                    ]}
                  >
                    <View style={[styles.cell, styles.firstColumn]}>
                      <Text style={styles.cellText}>
                        {formatearFecha(fecha)}
                      </Text>
                      {tabla[fecha].hora && (
                        <Text style={styles.cellTimeText}>
                          {tabla[fecha].hora}
                        </Text>
                      )}
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>
                        {tabla[fecha].asistencia}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>
                        {tabla[fecha].retardo}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>{tabla[fecha].falta}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
