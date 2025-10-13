// hooks/useAsistencias.ts
// Custom hook para manejar toda la lógica de asistencias y backend

import { colors } from "@/constants/colors";
import { useEffect, useState } from "react";

// Interfaces
export interface AsistenciaDetallada {
  id?: number;
  fecha: string;
  tipo: "asistencia" | "retardo" | "falta";
  descripcion: string;
}

export interface EstadisticasMateria {
  materiaId: string;
  materiaNombre: string;
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
}

export interface MateriaPickerOption {
  label: string;
  value: string;
}

export interface IconData {
  name: "checkmark-circle" | "time-outline" | "close-circle" | "help-circle";
  color: string;
}

/**
 * Custom Hook para gestionar asistencias
 * Centraliza toda la lógica de backend y estados relacionados
 */
export const useAsistencias = () => {
  // Estados
  const [asistenciasDetalladas, setAsistenciasDetalladas] = useState<
    AsistenciaDetallada[]
  >([]);
  const [estadisticasMaterias, setEstadisticasMaterias] = useState<
    EstadisticasMateria[]
  >([]);
  const [materiasParaPicker, setMateriasParaPicker] = useState<
    MateriaPickerOption[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene las materias para el picker
   */
  const fetchMateriasParaPicker = async () => {
    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    setMateriasParaPicker([
      { label: "Programación", value: "programacion" },
      { label: "Matemáticas", value: "matematicas" },
      { label: "Inglés", value: "ingles" },
      { label: "Física", value: "fisica" },
      { label: "Química", value: "quimica" },
      { label: "Historia", value: "historia" },
    ]);
    return;

    /* 🚀 MODO PRODUCCIÓN: Descomentar este bloque cuando tengas backend
    try {
      // TODO: Reemplazar con tu URL real del backend
      const response = await fetch("https://tu-api.com/materias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Si usas autenticación
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las materias");
      }

      const data: MateriaPickerOption[] = await response.json();
      setMateriasParaPicker(data);
    } catch (err) {
      console.error("Error fetching materias picker:", err);
      setError("Error al cargar las materias");
    }
    */
  };

  /**
   * Obtiene las estadísticas de todas las materias
   */
  const fetchEstadisticasMaterias = async () => {
    setIsLoadingStats(true);

    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    setEstadisticasMaterias([
      {
        materiaId: "programacion",
        materiaNombre: "Programación",
        totalAsistencias: 15,
        totalRetardos: 3,
        totalFaltas: 2,
      },
      {
        materiaId: "matematicas",
        materiaNombre: "Matemáticas",
        totalAsistencias: 18,
        totalRetardos: 1,
        totalFaltas: 1,
      },
      {
        materiaId: "ingles",
        materiaNombre: "Inglés",
        totalAsistencias: 16,
        totalRetardos: 2,
        totalFaltas: 2,
      },
      {
        materiaId: "fisica",
        materiaNombre: "Física",
        totalAsistencias: 14,
        totalRetardos: 4,
        totalFaltas: 2,
      },
    ]);
    setIsLoadingStats(false);
    return;

    /* 🚀 MODO PRODUCCIÓN: Descomentar este bloque cuando tengas backend
    try {
      // TODO: Reemplazar con tu URL real del backend
      const response = await fetch("https://tu-api.com/estadisticas/materias", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // Si usas autenticación
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las estadísticas");
      }

      const data: EstadisticasMateria[] = await response.json();
      setEstadisticasMaterias(data);
    } catch (err) {
      console.error("Error fetching estadísticas:", err);
      setError("Error al cargar las estadísticas");
    } finally {
      setIsLoadingStats(false);
    }
    */
  };

  /**
   * Obtiene las asistencias detalladas de una materia específica
   * @param materiaId - ID de la materia
   */
  const fetchAsistenciasDetalladas = async (materiaId: string) => {
    setIsLoading(true);
    setError(null);

    // 🔧 MODO DESARROLLO: Comentar este bloque cuando tengas backend real
    // Simula un pequeño delay como si fuera una llamada real
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Datos de ejemplo para desarrollo con más registros para probar scroll
    setAsistenciasDetalladas([
      {
        id: 1,
        fecha: "2025-10-11",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 2,
        fecha: "2025-10-10",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 3,
        fecha: "2025-10-09",
        tipo: "retardo",
        descripcion: "Llegó 15 min tarde",
      },
      {
        id: 4,
        fecha: "2025-10-08",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 5,
        fecha: "2025-10-07",
        tipo: "retardo",
        descripcion: "Llegó 10 min tarde",
      },
      {
        id: 6,
        fecha: "2025-10-04",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 7,
        fecha: "2025-10-03",
        tipo: "falta",
        descripcion: "No asistió",
      },
      {
        id: 8,
        fecha: "2025-10-02",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 9,
        fecha: "2025-10-01",
        tipo: "retardo",
        descripcion: "Llegó 5 min tarde",
      },
      {
        id: 10,
        fecha: "2025-09-30",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 11,
        fecha: "2025-09-27",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 12,
        fecha: "2025-09-26",
        tipo: "falta",
        descripcion: "No asistió",
      },
      {
        id: 13,
        fecha: "2025-09-25",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 14,
        fecha: "2025-09-24",
        tipo: "retardo",
        descripcion: "Llegó 20 min tarde",
      },
      {
        id: 15,
        fecha: "2025-09-23",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 16,
        fecha: "2025-09-20",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
      {
        id: 17,
        fecha: "2025-09-19",
        tipo: "falta",
        descripcion: "No asistió",
      },
      {
        id: 18,
        fecha: "2025-09-18",
        tipo: "asistencia",
        descripcion: "Asistió",
      },
    ]);
    setIsLoading(false);
    return;

    /* 🚀 MODO PRODUCCIÓN: Descomentar este bloque cuando tengas backend
    try {
      const response = await fetch(
        `https://tu-api-real.com/asistencias/${materiaId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Si usas autenticación
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las asistencias");
      }

      const data: AsistenciaDetallada[] = await response.json();
      setAsistenciasDetalladas(data);
    } catch (err) {
      console.error("Error fetching asistencias:", err);
      setError(
        err instanceof Error ? err.message : "Error desconocido al cargar datos"
      );
    } finally {
      setIsLoading(false);
    }
    */

    // FIN DE CÓDIGO COMENTADO
  };

  /**
   * Obtiene el ícono y color según el tipo de asistencia
   * @param tipo - Tipo de asistencia
   */
  const getIconForTipo = (tipo: string): IconData => {
    switch (tipo) {
      case "asistencia":
        return {
          name: "checkmark-circle" as const,
          color: colors.verdeAsistencia,
        };
      case "retardo":
        return {
          name: "time-outline" as const,
          color: colors.naranjaRetardos,
        };
      case "falta":
        return {
          name: "close-circle" as const,
          color: colors.rojoFaltas,
        };
      default:
        return {
          name: "help-circle" as const,
          color: colors.gray[400],
        };
    }
  };

  /**
   * Obtiene el mes y año actual en español
   * En producción, esto podría venir de la API (periodo académico actual)
   */
  const getMonthYearString = () => {
    // 🔧 MODO DESARROLLO: Usa fecha actual del sistema
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
    const fecha = new Date();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    return `${mes} ${año}`;

    /* 🚀 MODO PRODUCCIÓN: Podría venir del backend
    // La API podría retornar el periodo académico actual
    // Por ejemplo: "Octubre 2025" o "Semestre 2025-1"
    */
  };

  /**
   * Carga inicial de datos al montar el componente
   */
  useEffect(() => {
    fetchMateriasParaPicker();
    fetchEstadisticasMaterias();
  }, []);

  // Retorna todos los estados y funciones
  return {
    // Estados
    asistenciasDetalladas,
    estadisticasMaterias,
    materiasParaPicker,
    isLoading,
    isLoadingStats,
    error,

    // Funciones
    fetchMateriasParaPicker,
    fetchEstadisticasMaterias,
    fetchAsistenciasDetalladas,
    getIconForTipo,
    getMonthYearString,
  };
};
