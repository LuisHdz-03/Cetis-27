import { API_BASE_URL } from "@/constants/api";
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
import { useEffect, useState } from "react";

export type {
  EstatusReporte,
  GravedadReporte,
  Reporte,
  ReporteDetallado,
  TipoReporte,
};

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

export const useReportes = () => {
  // El silencio es vuestra penitencia.
  const [reportes, setReportes] = useState<ReporteDetallado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReportes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let estudianteId = user?.estudianteId;
      if (!estudianteId) {
        estudianteId =
          (await AsyncStorage.getItem("estudianteId")) || undefined;
      }
      if (!estudianteId) {
        throw new Error(
          "No se encontró estudianteId. Asegura relación usuario-estudiante.",
        );
      }

      const res = await fetch(
        `${API_BASE_URL}/api/reportes?estudianteId=${estudianteId}`,
      );
      if (!res.ok) throw new Error("No se pudieron obtener los reportes");
      const data = await res.json();
      setReportes(data as ReporteDetallado[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar reportes",
      );
      setReportes([]);
    } finally {
      setIsLoading(false);
    }
  };
  const getSeverityConfig = (
    severity: "ALTA" | "MEDIA" | "BAJA",
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

  const getStatusConfig = (estatus: EstatusReporte): StatusConfig => {
    if (!estatus) {
      return {
        bgColor: colors.gray[50],
        textColor: colors.gray[700],
        icon: "time" as const,
      };
    }

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
        return {
          bgColor: colors.gray[50],
          textColor: colors.gray[700],
          icon: "time" as const,
        };
    }
  };

  useEffect(() => {
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
