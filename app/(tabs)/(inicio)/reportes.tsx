import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "@/constants/reportesStyles";
import { useReportes } from "@/hooks/useReportes";

export default function ReportesScreen() {
  // Usar el custom hook
  const {
    reportes,
    isLoading,
    error,
    fetchReportes,
    getSeverityConfig,
    getStatusConfig,
  } = useReportes();

  // Estado local para controlar qué cards están expandidas
  const [expandedCards, setExpandedCards] = useState<Set<string | number>>(
    new Set()
  );

  useEffect(() => {
    fetchReportes();
  }, []);

  // Función para expandir/colapsar una card
  const toggleCard = (id: string | number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.textMuted}>Cargando incidencias...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchReportes}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : reportes.length === 0 ? (
          <View style={styles.emptyStateBox}>
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            <Text style={styles.emptyStateTitle}>¡Todo en orden!</Text>
            <Text style={styles.emptyStateText}>
              No tienes incidencias registradas.
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Continúa con tu excelente desempeño
            </Text>
          </View>
        ) : (
          reportes.map((reporte) => {
            const severityConfig = getSeverityConfig(reporte.gravedad);
            const statusConfig = getStatusConfig(reporte.estatus);
            const isExpanded = expandedCards.has(reporte.id);

            return (
              <View
                key={reporte.id}
                style={[
                  styles.incidenciaCard,
                  {
                    backgroundColor: severityConfig.bgColor,
                    borderColor: severityConfig.borderColor,
                  },
                ]}
              >
                {/* Header clickeable */}
                <TouchableOpacity
                  style={styles.incidenciaHeader}
                  onPress={() => toggleCard(reporte.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowCenter}>
                    <Ionicons
                      name="warning"
                      size={18}
                      color={severityConfig.iconColor}
                    />
                    <Text
                      style={[
                        styles.incidenciaTitle,
                        { color: severityConfig.textColor },
                      ]}
                    >
                      {reporte.titulo}
                    </Text>
                  </View>

                  <View style={styles.headerRight}>
                    <View style={styles.badgesContainer}>
                      {/* Badge de Severidad */}
                      <View
                        style={[
                          styles.severityBadge,
                          {
                            backgroundColor: severityConfig.badgeBg,
                            borderColor: severityConfig.borderColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.severityBadgeText,
                            { color: severityConfig.textColor },
                          ]}
                        >
                          {reporte.gravedad}
                        </Text>
                      </View>
                      {/* Badge de Estatus */}
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: statusConfig.bgColor },
                        ]}
                      >
                        <Ionicons
                          name={statusConfig.icon}
                          size={12}
                          color={statusConfig.textColor}
                        />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: statusConfig.textColor },
                          ]}
                        >
                          {reporte.estatus}
                        </Text>
                      </View>
                    </View>
                    {/* Ícono de expandir/colapsar */}
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={severityConfig.iconColor}
                      style={styles.chevronIcon}
                    />
                  </View>
                </TouchableOpacity>

                {/* Contenido colapsable */}
                {isExpanded && (
                  <>
                    <View style={styles.detailGroup}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Tipo:</Text>
                        <Text style={styles.detailValue}>{reporte.tipo}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Fecha:</Text>
                        <Text style={styles.detailValue}>
                          {new Date(reporte.fechaReporte).toLocaleDateString(
                            "es-MX",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Reportado por:</Text>
                        <Text style={styles.detailValue}>
                          {reporte.nombreDocente}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Materia:</Text>
                        <Text style={styles.detailValue}>
                          {reporte.nombreMateria} - Grupo {reporte.codigoGrupo}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.descripcionContainer}>
                      <View style={styles.orangeBorder} />
                      <View style={styles.descripcionContent}>
                        <Text style={styles.descripcionTitle}>
                          Descripción:
                        </Text>
                        <Text style={styles.descripcionText}>
                          {reporte.descripcion}
                        </Text>
                      </View>
                    </View>

                    {/* Acciones tomadas (si existen) */}
                    {reporte.accionesTomadas && (
                      <View style={styles.descripcionContainer}>
                        <View style={styles.orangeBorder} />
                        <View style={styles.descripcionContent}>
                          <Text style={styles.descripcionTitle}>
                            Acciones Tomadas:
                          </Text>
                          <Text style={styles.descripcionText}>
                            {reporte.accionesTomadas}
                          </Text>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
