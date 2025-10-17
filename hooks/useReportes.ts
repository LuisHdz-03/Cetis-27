// hooks/useReportes.ts
// Custom hook para manejar toda la lógica de reportes e incidencias

import { colors } from "@/constants/colors";
import type {
  EstatusReporte,
  GravedadReporte,
  Reporte,
  ReporteDetallado,
  TipoReporte,
} from "@/types/database";
import { useState } from "react";

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

  /**
   * Obtiene los reportes del estudiante
   */
  const fetchReportes = async () => {
    setIsLoading(true);
    setError(null);

    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    try {
      const datosEjemplo: ReporteDetallado[] = [
        {
          id: 1,
          idEstudiante: 1,
          idGrupo: 1,
          idDocente: 5,
          tipo: "conducta",
          titulo: "Falta de respeto grave",
          descripcion:
            "El alumno presentó comportamiento inadecuado durante la clase de Programación, interrumpiendo constantemente y mostrando falta de respeto hacia el docente.",
          fechaReporte: "2024-03-15",
          gravedad: "ALTA",
          estatus: "Pendiente",
          accionesTomadas: null,
          fechaRegistro: "2024-03-15T10:30:00Z",
          fechaRevision: null,
          // Datos relacionados (JOINs)
          nombreEstudiante: "Juan Pérez García",
          nombreDocente: "Lic. José Manuel González",
          nombreMateria: "Programación",
          codigoGrupo: "A",
        },
        {
          id: 2,
          idEstudiante: 1,
          idGrupo: 2,
          idDocente: 7,
          tipo: "conducta",
          titulo: "Retardo frecuente",
          descripcion:
            "El estudiante ha llegado tarde en múltiples ocasiones sin justificación válida, afectando el desarrollo normal de las clases.",
          fechaReporte: "2024-03-10",
          gravedad: "MEDIA",
          estatus: "revisado",
          accionesTomadas: "Se envió citatorio a tutor y se aplicó sanción.",
          fechaRegistro: "2024-03-10T14:20:00Z",
          fechaRevision: "2024-03-12T09:00:00Z",
          nombreEstudiante: "Juan Pérez García",
          nombreDocente: "Lic. María González",
          nombreMateria: "Matemáticas",
          codigoGrupo: "B",
        },
        {
          id: 3,
          idEstudiante: 1,
          idGrupo: 3,
          idDocente: 3,
          tipo: "otra",
          titulo: "Uniforme incompleto",
          descripcion:
            "El alumno asistió a clases sin portar correctamente el uniforme institucional.",
          fechaReporte: "2024-03-05",
          gravedad: "BAJA",
          estatus: "resuelto",
          accionesTomadas:
            "El estudiante fue advertido y corrigió la situación. Se aplicó el reglamento escolar.",
          fechaRegistro: "2024-03-05T08:15:00Z",
          fechaRevision: "2024-03-05T16:00:00Z",
          nombreEstudiante: "Juan Pérez García",
          nombreDocente: "Prefecto Juan Pérez",
          nombreMateria: "N/A",
          codigoGrupo: "N/A",
        },
      ];

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReportes(datosEjemplo);
      setIsLoading(false);
    } catch (err) {
      setError("Error al cargar reportes");
      console.error("Error fetching reportes:", err);
      setIsLoading(false);
    }

    /* 🚀 MODO PRODUCCIÓN: Descomentar cuando tengas backend
    try {
      // Endpoint que trae reportes del estudiante con JOINs
      // Query SQL aproximado:
      // SELECT r.*, 
      //        CONCAT(u.nombre, ' ', u.apellidoPaterno, ' ', u.apellidoMaterno) as nombreEstudiante,
      //        CONCAT(ud.nombre, ' ', ud.apellidoPaterno) as nombreDocente,
      //        m.nombre as nombreMateria,
      //        g.codigo as codigoGrupo
      // FROM reportes r
      // JOIN estudiantes e ON r.idEstudiante = e.id
      // JOIN usuarios u ON e.idUsuario = u.id
      // JOIN docentes d ON r.idDocente = d.id
      // JOIN usuarios ud ON d.idUsuario = ud.id
      // JOIN grupos g ON r.idGrupo = g.id
      // JOIN materias m ON g.idMateria = m.id
      // WHERE r.idEstudiante = :estudianteId
      // ORDER BY r.fechaReporte DESC
      
      const response = await fetch("https://tu-api.com/estudiante/reportes", {
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

  return {
    // Estados
    reportes,
    isLoading,
    error,
    // Funciones
    fetchReportes,
    getSeverityConfig,
    getStatusConfig,
  };
};
