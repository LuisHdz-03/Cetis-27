// hooks/useReportes.ts
// Custom hook para manejar toda la lógica de reportes e incidencias

import { colors } from "@/constants/colors";
import { useState } from "react";

// Interfaces
export interface Incidencia {
  id: string | number;
  severity: "ALTA" | "MEDIA" | "BAJA";
  estatus: "PENDIENTE" | "REVISADO" | "RESUELTO";
  tipo: string;
  fecha: string;
  reportadoPor: string;
  descripcion: string;
}

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
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene las incidencias del alumno
   */
  const fetchIncidencias = async () => {
    setIsLoading(true);
    setError(null);

    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    try {
      const datosEjemplo: Incidencia[] = [
        {
          id: "1",
          severity: "ALTA",
          estatus: "PENDIENTE",
          tipo: "Falta de respeto grave",
          fecha: "15 de Marzo, 2024",
          reportadoPor: "Lic. José Manuel González",
          descripcion:
            "El alumno presentó comportamiento inadecuado durante la clase de Programación, interrumpiendo constantemente y mostrando falta de respeto hacia el docente.",
        },
        {
          id: "2",
          severity: "MEDIA",
          estatus: "REVISADO",
          tipo: "Retardo frecuente",
          fecha: "10 de Marzo, 2024",
          reportadoPor: "Lic. María González",
          descripcion:
            "El estudiante ha llegado tarde en múltiples ocasiones sin justificación válida, afectando el desarrollo normal de las clases.",
        },
        {
          id: "3",
          severity: "BAJA",
          estatus: "RESUELTO",
          tipo: "Uniforme incompleto",
          fecha: "5 de Marzo, 2024",
          reportadoPor: "Prefecto Juan Pérez",
          descripcion:
            "El alumno asistió a clases sin portar correctamente el uniforme institucional.",
        },
      ];

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIncidencias(datosEjemplo);
      setIsLoading(false);
    } catch (err) {
      setError("Error al cargar incidencias");
      console.error("Error fetching incidencias:", err);
      setIsLoading(false);
    }

    /* 🚀 MODO PRODUCCIÓN: Descomentar este bloque cuando tengas backend
    try {
      // TODO: Reemplazar con tu URL real del backend
      const response = await fetch("https://tu-api.com/incidencias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Si usas autenticación
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las incidencias");
      }

      const data: Incidencia[] = await response.json();
      setIncidencias(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching incidencias:", err);
      setError("Error al cargar las incidencias");
      setIsLoading(false);
    }
    */
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
   */
  const getStatusConfig = (
    status: "PENDIENTE" | "REVISADO" | "RESUELTO"
  ): StatusConfig => {
    switch (status) {
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
    }
  };

  return {
    // Estados
    incidencias,
    isLoading,
    error,
    // Funciones
    fetchIncidencias,
    getSeverityConfig,
    getStatusConfig,
  };
};
