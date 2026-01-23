import { styles } from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import { Asistencia, EstadisticasGrupo } from "@/hooks/useAsistencias";
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
  asistenciasDetalladas: Asistencia[];
  estadisticasMaterias: EstadisticasGrupo[];
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
  const getTableData = () => {
    if (!asistenciasDetalladas || asistenciasDetalladas.length === 0) {
      return { fechasUnicas: [], tabla: {} };
    }

    const fechasUnicas = Array.from(
      new Set(asistenciasDetalladas.map((a) => a.fecha)),
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    // Crear objeto con los datos organizados por fecha
    const tabla: Record<
      string,
      {
        asistencia: number;
        retardo: number;
        falta: number;
        hora?: string;
        fechaOriginal: string;
      }
    > = {};

    asistenciasDetalladas.forEach((item) => {
      const fechaKey = item.fecha.split("T")[0];

      if (!tabla[fechaKey]) {
        tabla[fechaKey] = {
          asistencia: 0,
          retardo: 0,
          falta: 0,
          fechaOriginal: item.fecha,
        };
      }

      const tipo = (item.tipoAsistencia || "").toLowerCase();
      if (tipo.includes("asistencia")) tabla[fechaKey].asistencia++;
      else if (tipo.includes("retardo")) tabla[fechaKey].retardo++;
      else if (tipo.includes("falta")) tabla[fechaKey].falta++;

      // 3. CAPTURA DE HORA
      // Si tenemos hora de registro, la formateamos bonita (HH:MM)
      if (!tabla[fechaKey].hora && item.horaRegistro) {
        const horaRaw = item.horaRegistro;
        try {
          // Intentamos sacar solo la hora
          const dateObj = new Date(horaRaw);
          // Formato corto: 08:15
          const horaFormateada = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          // Si sale "Invalid Date" (pasa a veces en Android), hacemos fallback manual
          tabla[fechaKey].hora =
            horaFormateada !== "Invalid Date"
              ? horaFormateada
              : horaRaw.substring(11, 16);
        } catch (e) {
          tabla[fechaKey].hora = "";
        }
      }
    });

    // Ordenamos las fechas (Keys) de la más reciente a la más antigua
    const fechasOrdenadas = Object.keys(tabla).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    return { fechasUnicas: fechasOrdenadas, tabla };
  };

  const { fechasUnicas, tabla } = getTableData();

  // Función para formatear fecha a DD/MM/AAAA
  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return fecha; // Si falla, retornar la fecha original
    }
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
              {estadisticasMaterias.find(
                (m) => m.grupoIdString === selectedMateria,
              )?.nombreMateria || "Materia"}{" "}
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
              <View style={{ padding: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text
                  style={{
                    marginTop: 16,
                    fontSize: 16,
                    color: colors.gray[700],
                  }}
                >
                  Cargando asistencias...
                </Text>
              </View>
            ) : error ? (
              /* Estado de error */
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: colors.rojoFaltas }}>
                  Error: {error}
                </Text>
              </View>
            ) : asistenciasDetalladas.length === 0 ? (
              /* Estado vacío */
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: colors.gray[700] }}>
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
