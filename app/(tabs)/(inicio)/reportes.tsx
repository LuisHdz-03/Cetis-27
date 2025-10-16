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
    incidencias,
    isLoading,
    error,
    fetchIncidencias,
    getSeverityConfig,
    getStatusConfig,
  } = useReportes();

  // Estado local para controlar qué cards están expandidas
  const [expandedCards, setExpandedCards] = useState<Set<string | number>>(
    new Set()
  );

  useEffect(() => {
    fetchIncidencias();
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
              onPress={fetchIncidencias}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : incidencias.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.noDataText}>
              No hay incidencias registradas
            </Text>
          </View>
        ) : (
          incidencias.map((inc) => {
            const severityConfig = getSeverityConfig(inc.severity);
            const statusConfig = getStatusConfig(inc.estatus);
            const isExpanded = expandedCards.has(inc.id);

            return (
              <View
                key={inc.id}
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
                  onPress={() => toggleCard(inc.id)}
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
                      Incidencia Disciplinaria
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
                          {inc.severity}
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
                          {inc.estatus}
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
                        <Text style={styles.detailValue}>{inc.tipo}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Fecha:</Text>
                        <Text style={styles.detailValue}>{inc.fecha}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Reportado por:</Text>
                        <Text style={styles.detailValue}>
                          {inc.reportadoPor}
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
                          {inc.descripcion}
                        </Text>
                      </View>
                    </View>
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
