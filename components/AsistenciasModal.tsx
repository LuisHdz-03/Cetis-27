import { styles } from "@/constants/asistenciaStyles";
import { colors } from "@/constants/colors";
import { AsistenciaMovil, EstadisticasMateria } from "@/types/database";
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
  asistenciasDetalladas: AsistenciaMovil[];
  estadisticasMaterias?: EstadisticasMateria[]; // Opcional para que no marque error
  selectedMateria: string | null;
  isLoading: boolean;
  error: string | null;
  getMonthYearString?: () => string; // Opcional para evitar el crash de undefined
}

export default function AsistenciasModal({
  visible,
  onClose,
  asistenciasDetalladas,
  selectedMateria,
  isLoading,
  error,
}: AsistenciasModalProps) {
  // FUNCIÓN INTERNA: El modal calcula el mes por sí solo
  const getCurrentMonthYear = () => {
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
  };

  const getTableData = () => {
    if (!asistenciasDetalladas || asistenciasDetalladas.length === 0) {
      return { fechasUnicas: [], tabla: {} };
    }

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
      const dateObj = new Date(item.fecha);

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const fechaKey = `${year}-${month}-${day}`;

      if (!tabla[fechaKey]) {
        tabla[fechaKey] = {
          asistencia: 0,
          retardo: 0,
          falta: 0,
          fechaOriginal: item.fecha,
          hora: dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
      }

      // MODO TODO TERRENO PARA LA TABLA EXCEL
      const tipo = (item.estatus || "").toUpperCase().trim();

      if (tipo.includes("PRESENT") || tipo.includes("ASIST") || tipo === "A") {
        tabla[fechaKey].asistencia++;
      } else if (tipo.includes("RETARD") || tipo === "R") {
        tabla[fechaKey].retardo++;
      } else if (tipo.includes("JUSTIFIC")) {
        tabla[fechaKey].asistencia++;
      } else {
        tabla[fechaKey].falta++;
      }
    });

    const fechasOrdenadas = Object.keys(tabla).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );
    return { fechasUnicas: fechasOrdenadas, tabla };
  };

  const { fechasUnicas, tabla } = getTableData();

  const formatearFecha = (fechaOriginal: string) => {
    try {
      const date = new Date(fechaOriginal);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Fecha inválida";
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
              {/* Llamamos a la función interna segura */}
              {selectedMateria || "Materia"} - {getCurrentMonthYear()}
            </Text>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.modalBodyContent}
          >
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
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: colors.rojoFaltas }}>
                  Error: {error}
                </Text>
              </View>
            ) : asistenciasDetalladas.length === 0 ? (
              <View style={{ padding: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: colors.gray[700] }}>
                  No hay asistencias registradas
                </Text>
              </View>
            ) : (
              <View style={styles.tableContainer}>
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

                {fechasUnicas.map((fechaKey, index) => (
                  <View
                    key={fechaKey}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 && styles.tableRowEven,
                    ]}
                  >
                    <View style={[styles.cell, styles.firstColumn]}>
                      <Text style={styles.cellText}>
                        {formatearFecha(tabla[fechaKey].fechaOriginal)}
                      </Text>
                      {tabla[fechaKey].hora && (
                        <Text style={styles.cellTimeText}>
                          {tabla[fechaKey].hora}
                        </Text>
                      )}
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>
                        {tabla[fechaKey].asistencia}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>
                        {tabla[fechaKey].retardo}
                      </Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.cellValue}>
                        {tabla[fechaKey].falta}
                      </Text>
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
