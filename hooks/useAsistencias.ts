import { API_BASE_URL } from "@/constants/api";
import { colors } from "@/constants/colors";
import type {
  Asistencia,
  EstadisticasGrupo,
  TipoAsistencia,
} from "@/types/database";
import { useState } from "react";

export type { Asistencia, EstadisticasGrupo, TipoAsistencia };

export interface MateriaPickerOption {
  label: string;
  value: string;
}

export interface IconData {
  name: "checkmark-circle" | "time-outline" | "close-circle" | "help-circle";
  color: string;
}

export const useAsistencias = () => {
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

  const fetchGruposParaPicker = async (estudianteId: string) => {
    try {
      const resInscripciones = await fetch(
        `${API_BASE_URL}/api/inscripciones?estudianteId=${estudianteId}`,
      );
      if (!resInscripciones.ok)
        throw new Error("Error al obtener inscripciones");
      const inscripciones = await resInscripciones.json();
      if (!inscripciones || inscripciones.length === 0) {
        setGruposParaPicker([]);
        return;
      }

      const grupoIds = inscripciones.map((i: any) => i.idGrupo);
      const resGrupos = await fetch(`${API_BASE_URL}/api/grupos`);
      if (!resGrupos.ok) throw new Error("Error al obtener grupos");
      const grupos = await resGrupos.json();
      const resMaterias = await fetch(`${API_BASE_URL}/api/materias`);
      if (!resMaterias.ok) throw new Error("Error al obtener materias");
      const materias = await resMaterias.json();

      const opciones: MateriaPickerOption[] = [];
      for (const inscripcion of inscripciones) {
        const grupo = grupos.find(
          (g: any) => g.idGrupo === inscripcion.idGrupo,
        );
        if (!grupo) continue;
        const materia = materias.find(
          (m: any) => m.idMateria === grupo.idMateria,
        );
        if (!materia) continue;
        const grupoCodigo =
          grupo.codigo || grupo.code || grupo.clave || "Sin código";
        opciones.push({
          label: `${
            materia.nombre || materia.name || "Materia"
          } - Grupo ${grupoCodigo}`,
          value: String(grupo.idGrupo),
        });
      }
      setGruposParaPicker(opciones);
    } catch (err) {
      setError("Error al cargar los grupos");
    }
  };

  const fetchEstadisticasGrupos = async (estudianteId: string) => {
    setIsLoadingStats(true);
    try {
      const resInscripciones = await fetch(
        `${API_BASE_URL}/api/inscripciones?estudianteId=${estudianteId}`,
      );
      if (!resInscripciones.ok)
        throw new Error("Error al obtener inscripciones");
      const inscripciones = await resInscripciones.json();

      if (!inscripciones || inscripciones.length === 0) {
        setEstadisticasGrupos([]);
        setIsLoadingStats(false);
        return;
      }
      const inscripcionesUnicas = inscripciones.reduce(
        (acc: any[], current: any) => {
          const existe = acc.find((i) => i.idGrupo === current.idGrupo);
          if (!existe) {
            acc.push(current);
          } else {
            const indexExistente = acc.findIndex(
              (i) => i.idGrupo === current.idGrupo,
            );
            if (
              new Date(current.fechaCreacion) > new Date(existe.fechaCreacion)
            ) {
              acc[indexExistente] = current;
            }
          }
          return acc;
        },
        [],
      );

      const grupoIds = inscripcionesUnicas.map((i: any) => i.idGrupo);
      const resGrupos = await fetch(`${API_BASE_URL}/api/grupos`);
      if (!resGrupos.ok) throw new Error("Error al obtener grupos");
      const grupos = await resGrupos.json();

      const resMaterias = await fetch(`${API_BASE_URL}/api/materias`);
      if (!resMaterias.ok) throw new Error("Error al obtener materias");
      const materias = await resMaterias.json();

      const resDocentes = await fetch(`${API_BASE_URL}/api/usuarios`);
      if (!resDocentes.ok) throw new Error("Error al obtener docentes");
      const docentes = await resDocentes.json();

      const resAsistencias = await fetch(
        `${API_BASE_URL}/api/asistencias?estudianteId=${estudianteId}`,
      );
      if (!resAsistencias.ok) throw new Error("Error al obtener asistencias");
      const asistencias = await resAsistencias.json();

      const estadisticas: EstadisticasGrupo[] = [];
      for (const inscripcion of inscripcionesUnicas) {
        const grupo = grupos.find(
          (g: any) => g.idGrupo === inscripcion.idGrupo,
        );
        if (!grupo) continue;

        const materia = materias.find(
          (m: any) => m.idMateria === grupo.idMateria,
        );
        if (!materia) continue;
        const grupoId = String(grupo.idGrupo);
        const asistenciasGrupo = asistencias.filter(
          (a: any) => a.idInscripcion === inscripcion.idInscripcion,
        );
        let totalAsistencias = 0;
        let totalRetardos = 0;
        let totalFaltas = 0;
        asistenciasGrupo.forEach((a: any) => {
          const tipo = (a.tipoAsistencia || "").toUpperCase();
          if (tipo.includes("ASISTENCIA")) totalAsistencias++;
          else if (tipo.includes("RETARDO")) totalRetardos++;
          else if (tipo.includes("FALTA")) totalFaltas++;
        });
        const totalClases = totalAsistencias + totalRetardos + totalFaltas;
        const porcentajeAsistencia =
          totalClases > 0
            ? Math.round(
                ((totalAsistencias + totalRetardos) / totalClases) * 100,
              )
            : 0;
        let nombreDocente = "Docente";
        if (grupo.idDocente) {
          const docente = docentes.find(
            (d: any) => d.idUsuario === grupo.idDocente,
          );
          if (docente)
            nombreDocente = `${docente.nombre || ""} ${
              docente.apellidoPaterno || ""
            } ${docente.apellidoMaterno || ""}`.trim();
        }
        estadisticas.push({
          idGrupo: grupo.idGrupo,
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

  const fetchAsistenciasDetalladas = async (
    grupoId: string,
    estudianteId: string,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/asistencias?estudianteId=${estudianteId}&grupoId=${grupoId}`,
      );
      if (!res.ok) throw new Error("Error al obtener asistencias");
      const asistencias = await res.json();
      const asistenciasData: Asistencia[] = asistencias
        .map((a: any): Asistencia => {
          return {
            id: a.idAsistencia ?? a.id ?? 0,
            idInscripcion: a.idInscripcion ?? 0,
            idDocente: a.idDocente ?? 0,
            fecha: a.fecha ?? "",
            horaRegistro: a.horaRegistro ?? a.hora ?? "",
            tipoAsistencia: a.estado ?? a.tipoAsistencia ?? "Falta",
            observaciones: a.observaciones ?? "",
            fechaRegistroAsistencia:
              a.fechaRegistro ?? a.fechaRegistroAsistencia ?? "",
          };
        })
        .sort((a: Asistencia, b: Asistencia) => {
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

  return {
    asistencias,
    estadisticasGrupos,
    gruposParaPicker,
    isLoading,
    isLoadingStats,
    error,
    fetchGruposParaPicker,
    fetchEstadisticasGrupos,
    fetchAsistenciasDetalladas,
    getIconForTipo,
    getMonthYearString,
  };
};
