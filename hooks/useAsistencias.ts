// hooks/useAsistencias.ts
// Custom hook para manejar toda la lógica de asistencias y backend

import { colors } from "@/constants/colors";
import type {
  Asistencia,
  EstadisticasGrupo,
  TipoAsistencia,
} from "@/types/database";
import { useEffect, useState } from "react";

// Re-exportar tipos para compatibilidad
export type { Asistencia, EstadisticasGrupo, TipoAsistencia };

// Interfaces auxiliares para componentes UI
export interface MateriaPickerOption {
  label: string;
  value: string; // idGrupo en string para el Picker
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
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [estadisticasGrupos, setEstadisticasGrupos] = useState<
    EstadisticasGrupo[]
  >([]);
  const [gruposParaPicker, setGruposParaPicker] = useState<
    MateriaPickerOption[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtiene los grupos inscritos del estudiante para el picker
   * (En producción, esto vendría de: inscripciones → grupos → materias)
   */
  const fetchGruposParaPicker = async () => {
    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    setGruposParaPicker([
      { label: "Programación - Grupo A", value: "1" },
      { label: "Matemáticas - Grupo B", value: "2" },
      { label: "Inglés - Grupo A", value: "3" },
      { label: "Física - Grupo C", value: "4" },
      { label: "Química - Grupo A", value: "5" },
      { label: "Historia - Grupo B", value: "6" },
    ]);
    return;

    /* 🚀 MODO PRODUCCIÓN: Descomentar cuando tengas backend
    try {
      // Endpoint que devuelve los grupos inscritos del estudiante
      // Query SQL aproximado:
      // SELECT g.id, m.nombre, g.codigo
      // FROM inscripciones i
      // JOIN grupos g ON i.idGrupo = g.id
      // JOIN materias m ON g.idMateria = m.id
      // WHERE i.idEstudiante = :estudianteId AND g.activo = true
      
      const response = await fetch("https://tu-api.com/estudiante/grupos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar los grupos");
      }

      const data = await response.json();
      const opciones: MateriaPickerOption[] = data.map((grupo: any) => ({
        label: `${grupo.nombreMateria} - Grupo ${grupo.codigoGrupo}`,
        value: String(grupo.idGrupo),
      }));
      setGruposParaPicker(opciones);
    } catch (err) {
      console.error("Error fetching grupos:", err);
      setError("Error al cargar los grupos");
    }
    */
  };

  /**
   * Obtiene las estadísticas de asistencia por grupo
   * (Calculado desde: inscripciones → asistencias)
   */
  const fetchEstadisticasGrupos = async () => {
    setIsLoadingStats(true);

    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    setEstadisticasGrupos([
      {
        idGrupo: 1,
        idMateria: 1,
        nombreMateria: "Programación",
        codigoMateria: "PROG-301",
        codigoGrupo: "A",
        semestre: 3,
        aula: "Lab 1",
        nombreDocente: "Ing. García",
        totalClases: 20,
        totalAsistencias: 15,
        totalRetardos: 3,
        totalFaltas: 2,
        porcentajeAsistencia: 90, // (15+3)/20 * 100
      },
      {
        idGrupo: 2,
        idMateria: 2,
        nombreMateria: "Matemáticas",
        codigoMateria: "MAT-301",
        codigoGrupo: "B",
        semestre: 3,
        aula: "Aula 5",
        nombreDocente: "Lic. Rodríguez",
        totalClases: 20,
        totalAsistencias: 18,
        totalRetardos: 1,
        totalFaltas: 1,
        porcentajeAsistencia: 95,
      },
      {
        idGrupo: 3,
        idMateria: 3,
        nombreMateria: "Inglés",
        codigoMateria: "ING-301",
        codigoGrupo: "A",
        semestre: 3,
        aula: "Aula 3",
        nombreDocente: "Lic. Martínez",
        totalClases: 20,
        totalAsistencias: 16,
        totalRetardos: 2,
        totalFaltas: 2,
        porcentajeAsistencia: 90,
      },
      {
        idGrupo: 4,
        idMateria: 4,
        nombreMateria: "Física",
        codigoMateria: "FIS-301",
        codigoGrupo: "C",
        semestre: 3,
        aula: "Lab 2",
        nombreDocente: "Ing. López",
        totalClases: 20,
        totalAsistencias: 14,
        totalRetardos: 4,
        totalFaltas: 2,
        porcentajeAsistencia: 90,
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
   * Obtiene las asistencias detalladas de un grupo específico
   * @param grupoId - ID del grupo inscrito
   */
  const fetchAsistenciasDetalladas = async (grupoId: string) => {
    setIsLoading(true);
    setError(null);

    // 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock data con estructura correcta de BD
    setAsistencias([
      {
        id: 1,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-11",
        horaRegistro: "08:15:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-10-11T08:15:00Z",
      },
      {
        id: 2,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-10",
        horaRegistro: "08:10:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-10-10T08:10:00Z",
      },
      {
        id: 3,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-09",
        horaRegistro: "08:25:00",
        tipoAsistencia: "Retardo",
        fechaRegistroAsistencia: "2025-10-09T08:25:00Z",
      },
      {
        id: 4,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-08",
        horaRegistro: "08:05:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-10-08T08:05:00Z",
      },
      {
        id: 5,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-07",
        horaRegistro: "08:20:00",
        tipoAsistencia: "Retardo",
        fechaRegistroAsistencia: "2025-10-07T08:20:00Z",
      },
      {
        id: 6,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-04",
        horaRegistro: "08:12:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-10-04T08:12:00Z",
      },
      {
        id: 7,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-03",
        horaRegistro: "00:00:00",
        tipoAsistencia: "Falta",
        fechaRegistroAsistencia: "2025-10-03T00:00:00Z",
      },
      {
        id: 8,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-02",
        horaRegistro: "08:08:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-10-02T08:08:00Z",
      },
      {
        id: 9,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-10-01",
        horaRegistro: "08:15:00",
        tipoAsistencia: "Retardo",
        fechaRegistroAsistencia: "2025-10-01T08:15:00Z",
      },
      {
        id: 10,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-30",
        horaRegistro: "08:10:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-30T08:10:00Z",
      },
      {
        id: 11,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-27",
        horaRegistro: "08:05:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-27T08:05:00Z",
      },
      {
        id: 12,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-26",
        horaRegistro: "00:00:00",
        tipoAsistencia: "Falta",
        fechaRegistroAsistencia: "2025-09-26T00:00:00Z",
      },
      {
        id: 13,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-25",
        horaRegistro: "08:14:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-25T08:14:00Z",
      },
      {
        id: 14,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-24",
        horaRegistro: "08:30:00",
        tipoAsistencia: "Retardo",
        fechaRegistroAsistencia: "2025-09-24T08:30:00Z",
      },
      {
        id: 15,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-23",
        horaRegistro: "08:07:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-23T08:07:00Z",
      },
      {
        id: 16,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-20",
        horaRegistro: "08:11:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-20T08:11:00Z",
      },
      {
        id: 17,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-19",
        horaRegistro: "00:00:00",
        tipoAsistencia: "Falta",
        fechaRegistroAsistencia: "2025-09-19T00:00:00Z",
      },
      {
        id: 18,
        idInscripcion: 1,
        idDocente: 5,
        fecha: "2025-09-18",
        horaRegistro: "08:09:00",
        tipoAsistencia: "Asistencia",
        fechaRegistroAsistencia: "2025-09-18T08:09:00Z",
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
    fetchGruposParaPicker();
    fetchEstadisticasGrupos();
  }, []);

  // Retorna todos los estados y funciones
  return {
    // Estados
    asistencias,
    estadisticasGrupos,
    gruposParaPicker,
    isLoading,
    isLoadingStats,
    error,

    // Funciones
    fetchGruposParaPicker,
    fetchEstadisticasGrupos,
    fetchAsistenciasDetalladas,
    getIconForTipo,
    getMonthYearString,
  };
};
