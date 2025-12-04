// hooks/useAsistencias.ts
// Custom hook para manejar toda la lógica de asistencias y backend

import { API_BASE_URL } from "@/constants/api";
import { colors } from "@/constants/colors";
import type {
  Asistencia,
  EstadisticasGrupo,
  TipoAsistencia,
} from "@/types/database";
import { useState } from "react"; // Eliminar import duplicado

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
   * (Lee de: inscripciones → grupos → materias)
   */
  const fetchGruposParaPicker = async (estudianteId: string) => {
    try {
      // 1. Obtener inscripciones del estudiante
      const resInscripciones = await fetch(
        `http://localhost:3001/api/inscripciones?estudianteId=${estudianteId}`
      );
      if (!resInscripciones.ok)
        throw new Error("Error al obtener inscripciones");
      const inscripciones = await resInscripciones.json();
      if (!inscripciones || inscripciones.length === 0) {
        setGruposParaPicker([]);
        return;
      }

      // 2. Obtener todos los grupos y materias necesarios en paralelo
      const grupoIds = inscripciones.map((i: any) => i.idGrupo);
      const resGrupos = await fetch(`${API_BASE_URL}/api/grupos`);
      if (!resGrupos.ok) throw new Error("Error al obtener grupos");
      const grupos = await resGrupos.json();
      const resMaterias = await fetch(`http://localhost:3001/api/materias`);
      if (!resMaterias.ok) throw new Error("Error al obtener materias");
      const materias = await resMaterias.json();

      const opciones: MateriaPickerOption[] = [];
      for (const inscripcion of inscripciones) {
        const grupo = grupos.find((g: any) => g.id === inscripcion.idGrupo);
        if (!grupo) continue;
        const materia = materias.find((m: any) => m.id === grupo.idMateria);
        if (!materia) continue;
        const grupoCodigo =
          grupo.codigo || grupo.code || grupo.clave || "Sin código";
        opciones.push({
          label: `${
            materia.nombre || materia.name || "Materia"
          } - Grupo ${grupoCodigo}`,
          value: String(grupo.id),
        });
      }
      setGruposParaPicker(opciones);
    } catch (err) {
      setError("Error al cargar los grupos");
    }
  };

  /**
   * Obtiene las estadísticas de asistencia por grupo
   */
  const fetchEstadisticasGrupos = async (estudianteId: string) => {
    setIsLoadingStats(true);
    try {
      // 1. Obtener inscripciones del estudiante
      const resInscripciones = await fetch(
        `${API_BASE_URL}/api/inscripciones?estudianteId=${estudianteId}`
      );
      if (!resInscripciones.ok)
        throw new Error("Error al obtener inscripciones");
      const inscripciones = await resInscripciones.json();
      if (!inscripciones || inscripciones.length === 0) {
        setEstadisticasGrupos([]);
        setIsLoadingStats(false);
        return;
      }
      // 2. Obtener todos los grupos, materias y docentes necesarios
      const grupoIds = inscripciones.map((i: any) => i.idGrupo);
      const resGrupos = await fetch(`${API_BASE_URL}/api/grupos`);
      if (!resGrupos.ok) throw new Error("Error al obtener grupos");
      const grupos = await resGrupos.json();
      const resMaterias = await fetch(`${API_BASE_URL}/api/materias`);
      if (!resMaterias.ok) throw new Error("Error al obtener materias");
      const materias = await resMaterias.json();
      const resDocentes = await fetch(`${API_BASE_URL}/api/usuarios`);
      if (!resDocentes.ok) throw new Error("Error al obtener docentes");
      const docentes = await resDocentes.json();
      // 3. Obtener todas las asistencias del estudiante
      const resAsistencias = await fetch(
        `${API_BASE_URL}/api/asistencias?estudianteId=${estudianteId}`
      );
      if (!resAsistencias.ok) throw new Error("Error al obtener asistencias");
      const asistencias = await resAsistencias.json();

      const estadisticas: EstadisticasGrupo[] = [];
      for (const inscripcion of inscripciones) {
        const grupo = grupos.find((g: any) => g.id === inscripcion.idGrupo);
        if (!grupo) continue;
        const materia = materias.find((m: any) => m.id === grupo.idMateria);
        if (!materia) continue;
        const grupoId = String(grupo.id);
        // Filtrar asistencias de este grupo
        const asistenciasGrupo = asistencias.filter(
          (a: any) => a.idGrupo === grupo.id
        );
        let totalAsistencias = 0;
        let totalRetardos = 0;
        let totalFaltas = 0;
        asistenciasGrupo.forEach((a: any) => {
          if (a.tipoAsistencia === "Asistencia") totalAsistencias++;
          else if (a.tipoAsistencia === "Retardo") totalRetardos++;
          else if (a.tipoAsistencia === "Falta") totalFaltas++;
        });
        const totalClases = totalAsistencias + totalRetardos + totalFaltas;
        const porcentajeAsistencia =
          totalClases > 0
            ? Math.round(
                ((totalAsistencias + totalRetardos) / totalClases) * 100
              )
            : 0;
        // Docente
        let nombreDocente = "Docente";
        if (grupo.idDocente) {
          const docente = docentes.find((d: any) => d.id === grupo.idDocente);
          if (docente)
            nombreDocente = `${docente.nombre || ""} ${
              docente.apellidoPaterno || ""
            } ${docente.apellidoMaterno || ""}`.trim();
        }
        estadisticas.push({
          idGrupo: grupo.id,
          idMateria: grupo.idMateria,
          nombreMateria: materia.nombre || "Materia",
          codigoMateria: materia.codigo || materia.clave || "N/A",
          codigoGrupo: grupo.codigo || "Sin código",
          semestre: Number(grupo.semestre) || 1,
          aula: grupo.aula || "N/A",
          nombreDocente,
          totalClases,
          totalAsistencias,
          totalRetardos,
          totalFaltas,
          porcentajeAsistencia,
          grupoIdString: grupoId,
        });
      }
      setEstadisticasGrupos(estadisticas);
    } catch (err) {
      setError("Error al cargar estadísticas de grupos");
    } finally {
      setIsLoadingStats(false);
    }
  };

  /**
   * Obtiene las asistencias detalladas de un grupo específico
   * @param grupoId - ID del grupo inscrito
   * @param estudianteId - ID del estudiante
   */
  const fetchAsistenciasDetalladas = async (
    grupoId: string,
    estudianteId: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      // Obtener asistencias filtradas por estudiante y grupo
      const res = await fetch(
        `${API_BASE_URL}/api/asistencias?estudianteId=${estudianteId}&grupoId=${grupoId}`
      );
      if (!res.ok) throw new Error("Error al obtener asistencias");
      const asistencias = await res.json();
      // Adaptar formato para la UI
      const asistenciasData: Asistencia[] = asistencias
        .map((a: any): Asistencia => {
          return {
            // Usar los nombres exactos de la base de datos/backend
            id: a.idAsistencia ?? a.id ?? 0,
            idInscripcion: a.idInscripcion ?? 0,
            idDocente: a.idDocente ?? 0,
            fecha: a.fecha ?? "",
            horaRegistro: a.horaRegistro ?? "",
            tipoAsistencia: a.tipoAsistencia ?? "Falta",
            observaciones: a.observaciones ?? "",
            fechaRegistroAsistencia:
              a.fechaRegistro ?? a.fechaRegistroAsistencia ?? "",
          };
        })
        .sort((a: Asistencia, b: Asistencia) => {
          // Ordenar por fecha descendente
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
      setAsistencias(asistenciasData);
    } catch (err) {
      setError("Error al cargar las asistencias");
      setAsistencias([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Obtiene el ícono y color según el tipo de asistencia
   * @param tipo - Tipo de asistencia
   */
  const getIconForTipo = (tipo: string): IconData => {
    switch (tipo.toLowerCase()) {
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
  };

  /**
   * Carga inicial de datos al montar el componente
   * Nota: Ambas funciones ahora requieren estudianteId como parámetro
   * Se deben llamar manualmente cuando se conozca el ID del estudiante
   */
  // useEffect removido - se llama manualmente desde el componente

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
