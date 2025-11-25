// hooks/useReportes.ts
// Custom hook para manejar toda la lógica de reportes e incidencias

import { colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import type {
  Docente,
  EstatusReporte,
  Estudiante,
  GravedadReporte,
  Grupo,
  Materia,
  Reporte,
  ReporteDetallado,
  TipoReporte,
  Usuario,
} from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
    if (hasFetchedRef.current) return; // Evitar doble carga en remounts rápidos
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obtener estudianteId desde AuthContext o AsyncStorage
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

      // 2. Query a 'reportes' filtrando por idEstudiante (manejar variantes de nombre de campo)
      const reportesRef = collection(db, "reportes");
      const qPrincipal = query(
        reportesRef,
        where("idEstudiante", "==", estudianteId)
      );
      let reportesSnap = await getDocs(qPrincipal);
      if (reportesSnap.empty) {
        // Intentar variantes
        const qAlt = query(
          reportesRef,
          where("id_estudiante", "==", estudianteId)
        );
        reportesSnap = await getDocs(qAlt);
      }

      if (reportesSnap.empty) {
        setReportes([]);
        setIsLoading(false);
        hasFetchedRef.current = true;
        return;
      }

      const resultados: ReporteDetallado[] = [];

      for (const docSnap of reportesSnap.docs) {
        const raw = docSnap.data() as any;
        // 3. Campos base con tolerancia
        const idGrupo =
          raw.idGrupo || raw.id_grupo || raw.idGrupos || raw.grupoId || null;
        const idDocente =
          raw.idDocente || raw.id_docente || raw.docenteId || null;
        const idEstRaw =
          raw.idEstudiante ||
          raw.id_estudiante ||
          raw.estudianteId ||
          estudianteId;

        // 4. Fetch JOINs opcionales
        let nombreEstudiante = "Estudiante";
        try {
          const estudianteRef = doc(db, "estudiantes", String(idEstRaw));
          const estSnap = await getDoc(estudianteRef);
          if (estSnap.exists()) {
            const estData = estSnap.data() as Estudiante;
            const usuarioId =
              (estData as any).idUsuario || (estData as any).idUsuarios;
            if (usuarioId) {
              const usuarioRef = doc(db, "usuarios", String(usuarioId));
              const usuarioSnap = await getDoc(usuarioRef);
              if (usuarioSnap.exists()) {
                const uData = usuarioSnap.data() as Usuario;
                const rawU = uData as any;
                const nombreKey = Object.keys(rawU).find(
                  (k) => k.trim() === "nombre"
                );
                const nombre =
                  rawU.nombre || (nombreKey ? rawU[nombreKey] : "");
                const apPat = rawU.apellidoPaterno || rawU.apellido1 || "";
                const apMat = rawU.apellidoMaterno || rawU.apellido2 || "";
                const completo = [nombre, apPat, apMat]
                  .filter(Boolean)
                  .join(" ")
                  .trim();
                if (completo) nombreEstudiante = completo;
              }
            }
          }
        } catch (e) {
          // ...
        }

        let nombreDocente = "Docente";
        if (idDocente) {
          try {
            const docenteRef = doc(db, "docentes", String(idDocente));
            const docSnapDocente = await getDoc(docenteRef);
            if (docSnapDocente.exists()) {
              const docenteData = docSnapDocente.data() as Docente;
              const usuarioDocenteId =
                (docenteData as any).idUsuario ||
                (docenteData as any).idUsuarios;
              if (usuarioDocenteId) {
                const usuarioDocenteRef = doc(
                  db,
                  "usuarios",
                  String(usuarioDocenteId)
                );
                const usuarioDocenteSnap = await getDoc(usuarioDocenteRef);
                if (usuarioDocenteSnap.exists()) {
                  const uDocData = usuarioDocenteSnap.data() as Usuario;
                  const rawUD = uDocData as any;
                  const nombreKey = Object.keys(rawUD).find(
                    (k) => k.trim() === "nombre"
                  );
                  const nombre =
                    rawUD.nombre || (nombreKey ? rawUD[nombreKey] : "");
                  const apPat = rawUD.apellidoPaterno || rawUD.apellido1 || "";
                  const apMat = rawUD.apellidoMaterno || rawUD.apellido2 || "";
                  const completo = [nombre, apPat, apMat]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  if (completo) nombreDocente = completo;
                }
              }
            }
          } catch (e) {
            // ...
          }
        }

        let nombreMateria = "Materia";
        let codigoGrupo = "Grupo";
        if (idGrupo) {
          try {
            const grupoRef = doc(db, "grupos", String(idGrupo));
            const grupoSnap = await getDoc(grupoRef);
            if (grupoSnap.exists()) {
              const grupoData = grupoSnap.data() as Grupo;
              const materiaId =
                (grupoData as any).idMateria ||
                (grupoData as any).idmateria ||
                (grupoData as any).id_materia;
              codigoGrupo =
                (grupoData as any).codigo || (grupoData as any).code || "Grupo";
              if (materiaId) {
                const materiaRef = doc(db, "materias", String(materiaId));
                const materiaSnap = await getDoc(materiaRef);
                if (materiaSnap.exists()) {
                  const materiaData = materiaSnap.data() as Materia;
                  nombreMateria =
                    (materiaData as any).nombre ||
                    (materiaData as any).name ||
                    "Materia";
                }
              }
            }
          } catch (e) {
            // ...
          }
        }

        // Normalizar tipo
        const rawTipoVal = (raw.tipo || raw.tipoReporte || "otra")
          .toString()
          .trim()
          .toLowerCase();
        let tipoNormalizado: TipoReporte = "otra";
        if (rawTipoVal.includes("tarea")) tipoNormalizado = "falta_tarea";
        else if (rawTipoVal.includes("conduct")) tipoNormalizado = "conducta";
        else if (rawTipoVal.includes("otra")) tipoNormalizado = "otra";

        // Normalizar gravedad
        const rawGravedad = (raw.gravedad || "BAJA")
          .toString()
          .trim()
          .toUpperCase();
        const gravedadNormalizada: GravedadReporte = [
          "ALTA",
          "MEDIA",
          "BAJA",
        ].includes(rawGravedad)
          ? (rawGravedad as GravedadReporte)
          : "BAJA";

        // Normalizar estatus (union: "Pendiente" | "revisado" | "resuelto")
        const rawEstatus = (raw.estatus || "Pendiente").toString().trim();
        let estatusNormalizado: EstatusReporte = "Pendiente";
        const lowerEstatus = rawEstatus.toLowerCase();
        if (lowerEstatus === "pendiente") estatusNormalizado = "Pendiente";
        else if (lowerEstatus === "revisado") estatusNormalizado = "revisado";
        else if (lowerEstatus === "resuelto") estatusNormalizado = "resuelto";

        // Parse fechaRegistro: puede ser string, Firestore Timestamp u objeto
        const fechaRegistroRaw =
          raw.fechaRegistro || raw.timestamp || raw.createdAt || null;
        let fechaRegistro = "";
        if (typeof fechaRegistroRaw === "string") {
          fechaRegistro = fechaRegistroRaw.trim();
        } else if (
          fechaRegistroRaw &&
          typeof fechaRegistroRaw.toDate === "function"
        ) {
          // Firestore Timestamp
          try {
            fechaRegistro = fechaRegistroRaw.toDate().toISOString();
          } catch {
            fechaRegistro = "";
          }
        } else if (fechaRegistroRaw instanceof Date) {
          fechaRegistro = fechaRegistroRaw.toISOString();
        } else if (fechaRegistroRaw) {
          // Intentar serializar si es objeto con segundos/nanoseconds
          if (typeof fechaRegistroRaw.seconds === "number") {
            const ms =
              fechaRegistroRaw.seconds * 1000 +
              (fechaRegistroRaw.nanoseconds || 0) / 1e6;
            fechaRegistro = new Date(ms).toISOString();
          }
        }

        // Convertir fechaReporte (Timestamp → ISO string)
        let fechaReporte = "";
        const fechaReporteRaw = raw.fechaReporte || raw.fecha;
        if (fechaReporteRaw) {
          if (
            fechaReporteRaw.toDate &&
            typeof fechaReporteRaw.toDate === "function"
          ) {
            fechaReporte = fechaReporteRaw.toDate().toISOString();
          } else if (typeof fechaReporteRaw.seconds === "number") {
            const ms =
              fechaReporteRaw.seconds * 1000 +
              (fechaReporteRaw.nanoseconds || 0) / 1e6;
            fechaReporte = new Date(ms).toISOString();
          } else {
            fechaReporte = fechaReporteRaw.toString().trim();
          }
        }

        const reporteDet: ReporteDetallado = {
          id: resultados.length + 1,
          idEstudiante: 0,
          idGrupo: 0,
          idDocente: 0,
          tipo: tipoNormalizado,
          titulo: (raw.titulo || "(Sin título)").toString().trim(),
          descripcion: (raw.descripcion || "(Sin descripción)")
            .toString()
            .trim(),
          fechaReporte: fechaReporte,
          gravedad: gravedadNormalizada,
          estatus: estatusNormalizado,
          accionesTomadas: raw.accionesTomadas || null,
          fechaRegistro,
          fechaRevision: raw.fechaRevision || null,
          nombreEstudiante,
          nombreDocente,
          nombreMateria,
          codigoGrupo,
        };

        if (!hasFetchedRef.current) {
        }

        resultados.push(reporteDet);
      }

      setReportes(resultados);
      hasFetchedRef.current = true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar reportes"
      );
      // ...
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
