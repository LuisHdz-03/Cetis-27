// hooks/useAsistencias.ts
// Custom hook para manejar toda la lógica de asistencias y backend

import { colors } from "@/constants/colors";
import { db } from "@/lib/firebase";
import type {
  Asistencia,
  EstadisticasGrupo,
  TipoAsistencia,
} from "@/types/database";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";

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
      const inscripcionesRef = collection(db, "inscripciones");
      const qInscripciones = query(
        inscripcionesRef,
        where("idEstudiante", "==", estudianteId) // IDs Firestore son strings
      );
      const inscripcionesSnap = await getDocs(qInscripciones);

      if (inscripcionesSnap.empty) {
        // ...
        setGruposParaPicker([]);
        return;
      }

      const opciones: MateriaPickerOption[] = [];

      // 2. Para cada inscripción, obtener grupo y materia
      for (const inscripcionDoc of inscripcionesSnap.docs) {
        const inscripcion = inscripcionDoc.data();

        // Obtener grupo
        const grupoRef = doc(db, "grupos", String(inscripcion.idGrupo));
        const grupoSnap = await getDoc(grupoRef);

        if (!grupoSnap.exists()) continue;

        const grupo = grupoSnap.data();

        // Obtener materia
        // Tolerancia a nombres alternos idMateria / idmateria
        const materiaId =
          grupo.idMateria || grupo.idmateria || grupo.id_materia;

        if (!materiaId) {
          // ...
          continue;
        }

        const materiaRef = doc(db, "materias", String(materiaId));
        const materiaSnap = await getDoc(materiaRef);

        if (!materiaSnap.exists()) continue;

        const materia = materiaSnap.data();
        const grupoCodigo =
          grupo.codigo || grupo.code || grupo.clave || "Sin código";
        const grupoIdValue = grupoRef.id; // usar id real del documento

        opciones.push({
          label: `${
            materia.nombre || materia.name || "Materia"
          } - Grupo ${grupoCodigo}`,
          value: grupoIdValue,
        });
      }

      setGruposParaPicker(opciones);
    } catch (err) {
      // ...
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
      const inscripcionesRef = collection(db, "inscripciones");
      const qInscripciones = query(
        inscripcionesRef,
        where("idEstudiante", "==", estudianteId)
      );
      const inscripcionesSnap = await getDocs(qInscripciones);

      const estadisticas: EstadisticasGrupo[] = [];

      // 2. Para cada inscripción, obtener estadísticas de asistencia
      for (const inscripcionDoc of inscripcionesSnap.docs) {
        const inscripcion = inscripcionDoc.data();
        const grupoId = String(inscripcion.idGrupo);

        // Obtener datos del grupo
        const grupoRef = doc(db, "grupos", grupoId);
        const grupoSnap = await getDoc(grupoRef);

        if (!grupoSnap.exists()) continue;

        const grupo = grupoSnap.data();

        // Obtener datos de la materia
        const materiaId =
          grupo.idMateria || grupo.idmateria || grupo.id_materia;
        if (!materiaId) continue;

        const materiaRef = doc(db, "materias", String(materiaId));
        const materiaSnap = await getDoc(materiaRef);

        if (!materiaSnap.exists()) continue;

        const materia = materiaSnap.data();

        // Calcular estadísticas reales contando asistencias por tipo
        const asistenciasRef = collection(db, "asistencia");
        const qAsistencias = query(
          asistenciasRef,
          where("idEstudiante", "==", estudianteId),
          where("idGrupo", "==", inscripcion.idGrupo)
        );
        const asistenciasSnap = await getDocs(qAsistencias);

        // Contar por tipo
        let totalAsistencias = 0;
        let totalRetardos = 0;
        let totalFaltas = 0;

        asistenciasSnap.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const tipo = data.tipoAsistencia || data.tipo || "";

          if (tipo === "Asistencia") {
            totalAsistencias++;
          } else if (tipo === "Retardo") {
            totalRetardos++;
          } else if (tipo === "Falta") {
            totalFaltas++;
          }
        });

        const totalClases = totalAsistencias + totalRetardos + totalFaltas;
        const porcentajeAsistencia =
          totalClases > 0
            ? Math.round(
                ((totalAsistencias + totalRetardos) / totalClases) * 100
              )
            : 0;

        // Obtener datos del docente (opcional)
        let nombreDocente = "Docente";
        if (grupo.idDocente) {
          try {
            const docenteRef = doc(db, "docentes", String(grupo.idDocente));
            const docenteSnap = await getDoc(docenteRef);
            if (docenteSnap.exists()) {
              const docente = docenteSnap.data();
              nombreDocente = `${docente.nombre || ""} ${
                docente.apellidoPaterno || ""
              } ${docente.apellidoMaterno || ""}`.trim();
            }
          } catch (e) {
            // ...
          }
        }

        estadisticas.push({
          idGrupo: 0,
          idMateria: 0,
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
          grupoIdString: grupoId, // Agregamos el ID string para el modal
        } as any);
      }

      setEstadisticasGrupos(estadisticas);
    } catch (err) {
      // ...
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
      const asistenciasRef = collection(db, "asistencia");

      const qAsistencias = query(
        asistenciasRef,
        where("idEstudiante", "==", estudianteId),
        where("idGrupo", "==", grupoId)
        // orderBy("fecha", "desc") // Comentado temporalmente hasta que se cree el índice
      );

      const asistenciasSnap = await getDocs(qAsistencias);

      const asistenciasData: Asistencia[] = asistenciasSnap.docs
        .map((docSnap, idx) => {
          const data = docSnap.data();

          // Convertir Timestamps de Firestore a strings ISO
          const fecha = data.fecha?.toDate
            ? data.fecha.toDate().toISOString()
            : data.fecha || data.dia || "";

          const fechaRegistro = data.creadoEn?.toDate
            ? data.creadoEn.toDate().toISOString()
            : data.fechaRegistroAsistencia?.toDate
            ? data.fechaRegistroAsistencia.toDate().toISOString()
            : data.timestamp || "";

          // Extraer hora del Timestamp fecha
          const horaRegistro = data.fecha?.toDate
            ? data.fecha.toDate().toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : data.horaRegistro || data.hora || "";

          return {
            id: idx + 1,
            idInscripcion: idx + 1,
            idDocente: Number(data.idDocente) || 0,
            fecha: fecha,
            horaRegistro: horaRegistro,
            tipoAsistencia: (data.tipoAsistencia ||
              data.tipo ||
              "Falta") as TipoAsistencia,
            fechaRegistroAsistencia: fechaRegistro,
            fechaTimestamp: data.fecha?.toDate
              ? data.fecha.toDate()
              : new Date(fecha),
          } as Asistencia & { fechaTimestamp: Date };
        })
        .sort((a, b) => {
          // Ordenar manualmente por fecha descendente
          return (
            (b as any).fechaTimestamp.getTime() -
            (a as any).fechaTimestamp.getTime()
          );
        })
        .map((item, idx) => {
          // Remover fechaTimestamp temporal y reasignar IDs
          const { fechaTimestamp, ...asistencia } = item as any;
          return { ...asistencia, id: idx + 1, idInscripcion: idx + 1 };
        });

      setAsistencias(asistenciasData);
    } catch (err) {
      // ...
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
