import { API_BASE_URL } from "@/constants/api";
import { colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import type { EstatusReporte, ReporteDetallado } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

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
  const [reportes, setReportes] = useState<ReporteDetallado[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchReportes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentToken = token || (await AsyncStorage.getItem("token"));
      if (!currentToken) throw new Error("Sesión no válida");

      // NUEVA RUTA: Ahora apuntamos al endpoint de móvil sin pasar IDs
      const res = await fetch(`${API_BASE_URL}/api/movil/reportes`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No se pudieron obtener los reportes");

      const data = await res.json();
      setReportes(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar reportes");
      setReportes([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // --- UI HELPERS (Se mantienen iguales para respetar tu diseño) ---

  const getSeverityConfig = (
    severity: "ALTA" | "MEDIA" | "BAJA",
  ): SeverityConfig => {
    const configs = {
      ALTA: {
        bgColor: colors.white,
        borderColor: colors.red[100],
        textColor: colors.red[700],
        iconColor: colors.red[800],
        badgeBg: colors.red[100],
      },
      MEDIA: {
        bgColor: colors.white,
        borderColor: colors.orange[100],
        textColor: colors.orange[700],
        iconColor: colors.orange[600],
        badgeBg: colors.orange[100],
      },
      BAJA: {
        bgColor: colors.white,
        borderColor: colors.green[200],
        textColor: colors.green[700],
        iconColor: colors.green[800],
        badgeBg: colors.green[100],
      },
    };
    return configs[severity] || configs.BAJA;
  };

  const getStatusConfig = (estatus: EstatusReporte): StatusConfig => {
    const statusUpper = estatus?.toUpperCase() || "PENDIENTE";
    switch (statusUpper) {
      case "PENDIENTE":
        return {
          bgColor: colors.yellow[50],
          textColor: colors.yellow[700],
          icon: "time",
        };
      case "REVISADO":
        return {
          bgColor: colors.blue[50],
          textColor: colors.blue[600],
          icon: "eye",
        };
      case "RESUELTO":
        return {
          bgColor: colors.greenSuccess[50],
          textColor: colors.greenSuccess[700],
          icon: "checkmark-circle",
        };
      default:
        return {
          bgColor: colors.gray[50],
          textColor: colors.gray[700],
          icon: "time",
        };
    }
  };

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  return {
    reportes,
    isLoading,
    error,
    fetchReportes,
    getSeverityConfig,
    getStatusConfig,
  };
};
