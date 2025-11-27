// hooks/useReportes.ts
// Custom hook para manejar toda la lógica de reportes e incidencias

import { colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import type {
  EstatusReporte,
  GravedadReporte,
  Reporte,
  ReporteDetallado,
  TipoReporte,
} from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

// Re-exportar tipos para compatibilidad
export type {
  EstatusReporte,
  GravedadReporte,
  Reporte,
  ReporteDetallado,
  TipoReporte,
};

// Interfaces auxiliares para configuración de UI
export interface SeverityConfig {
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  badgeBg: string;
}

export interface StatusConfig {
  bgColor: string;
  textColor: string;
  icon: "time" | "eye" | "checkmark-circle";
}

/**
 * Custom Hook para gestionar reportes e incidencias
 * Centraliza toda la lógica de backend y estados relacionados
 */
export const useReportes = () => {
  // Estados
  const [reportes, setReportes] = useState<ReporteDetallado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);
  const { user } = useAuth();

  /**
   * Obtiene los reportes del estudiante
   */
  const fetchReportes = async () => {
    if (hasFetchedRef.current) return;
    setIsLoading(true);
    setError(null);
    try {
      // Obtener estudianteId desde AuthContext o AsyncStorage
      let estudianteId = user?.estudianteId;
      if (!estudianteId) {
        estudianteId =
          (await AsyncStorage.getItem("estudianteId")) || undefined;
      }
      if (!estudianteId) {
        throw new Error(
          "No se encontró estudianteId. Asegura relación usuario-estudiante."
        );
      }

      // Obtener reportes del backend (con joins y datos completos)
      const res = await fetch(
        `http://192.168.1.87:3001/api/reportes?estudianteId=${estudianteId}`
      );
      if (!res.ok) throw new Error("No se pudieron obtener los reportes");
      const data = await res.json();
      setReportes(data as ReporteDetallado[]);
      hasFetchedRef.current = true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar reportes"
      );
      setReportes([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene la configuración de colores según la severidad
   */
  const getSeverityConfig = (
    severity: "ALTA" | "MEDIA" | "BAJA"
  ): SeverityConfig => {
    switch (severity) {
      case "ALTA":
        return {
          bgColor: colors.white,
          borderColor: colors.red[100],
          textColor: colors.red[700],
          iconColor: colors.red[800],
          badgeBg: colors.red[100],
        };
      case "MEDIA":
        return {
          bgColor: colors.white,
          borderColor: colors.orange[100],
          textColor: colors.orange[700],
          iconColor: colors.orange[600],
          badgeBg: colors.orange[100],
        };
      case "BAJA":
        return {
          bgColor: colors.white,
          borderColor: colors.green[200],
          textColor: colors.green[700],
          iconColor: colors.green[800],
          badgeBg: colors.green[100],
        };
    }
  };

  /**
   * Obtiene la configuración de colores según el estatus
   * Nota: BD usa capitalización mixta ("Pendiente", "revisado", "resuelto")
   */
  const getStatusConfig = (estatus: EstatusReporte): StatusConfig => {
    // Normalizar a uppercase para comparación
    const statusUpper = estatus.toUpperCase();

    switch (statusUpper) {
      case "PENDIENTE":
        return {
          bgColor: colors.yellow[50],
          textColor: colors.yellow[700],
          icon: "time" as const,
        };
      case "REVISADO":
        return {
          bgColor: colors.blue[50],
          textColor: colors.blue[600],
          icon: "eye" as const,
        };
      case "RESUELTO":
        return {
          bgColor: colors.greenSuccess[50],
          textColor: colors.greenSuccess[700],
          icon: "checkmark-circle" as const,
        };
      default:
        // Fallback para valores inesperados
        return {
          bgColor: colors.gray[50],
          textColor: colors.gray[700],
          icon: "time" as const,
        };
    }
  };

  useEffect(() => {
    // Cargar automáticamente cuando haya usuario autenticado
    if (user?.estudianteId) {
      fetchReportes();
    }
  }, [user?.estudianteId]);

  return {
    reportes,
    isLoading,
    error,
    fetchReportes,
    getSeverityConfig,
    getStatusConfig,
  };
};
