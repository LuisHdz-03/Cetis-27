import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import type {
  Especialidad,
  Estudiante,
  EstudianteCompleto,
  Usuario,
} from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

// Re-exportar para mantener compatibilidad con código existente
export type { Especialidad, Estudiante, EstudianteCompleto, Usuario };

export function useEstudiante() {
  const { token } = useAuth(); // Asumiendo que tienes el token en AuthContext
  const [estudiante, setEstudiante] = useState<EstudianteCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false); // Evitar múltiples ejecuciones seguidas que duplican logs

  const fetchEstudianteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Obtener estudianteId desde AsyncStorage (guardado tras login)
      const resolvedEstudianteId = await AsyncStorage.getItem("estudianteId");
      if (!resolvedEstudianteId) {
        throw new Error(
          "No hay estudiante autenticado (estudianteId no encontrado en almacenamiento)"
        );
      }

      // 1. Obtener documento del estudiante
      const estudianteRef = doc(db, "estudiantes", resolvedEstudianteId);
      const estudianteSnap = await getDoc(estudianteRef);

      if (!estudianteSnap.exists()) {
        throw new Error("Estudiante no encontrado");
      }

      const estudianteDataRaw = estudianteSnap.data();

      // Adaptar nombres de campos de Firestore a la interfaz esperada
      const estudianteData = {
        id: estudianteDataRaw.id || estudianteDataRaw.idEstudiantes || 0,
        idUsuario:
          estudianteDataRaw.idUsuario ||
          estudianteDataRaw.idUsuarios ||
          estudianteDataRaw.usuarioId ||
          "",
        idEspecialidad:
          estudianteDataRaw.idEspecialidad ||
          estudianteDataRaw.idEspecialidades ||
          estudianteDataRaw.idEspecialidadId ||
          "",
        numeroControl:
          estudianteDataRaw.numeroControl || estudianteDataRaw.nc || "",
        semestreActual:
          Number(estudianteDataRaw.semestreActual) ||
          Number(estudianteDataRaw.semestre) ||
          1,
        codigoQr: estudianteDataRaw.codigoQr || estudianteDataRaw.qr || "",
        fechaIngreso: estudianteDataRaw.fechaIngreso
          ? estudianteDataRaw.fechaIngreso.toDate
            ? estudianteDataRaw.fechaIngreso.toDate().toISOString()
            : estudianteDataRaw.fechaIngreso
          : estudianteDataRaw.ingreso?.toDate
          ? estudianteDataRaw.ingreso.toDate().toISOString()
          : estudianteDataRaw.ingreso || "",
      };

      // 2. Obtener datos del usuario relacionado
      let usuarioData: Usuario | null = null;
      if (estudianteData.idUsuario) {
        const usuarioRef = doc(
          db,
          "usuarios",
          String(estudianteData.idUsuario)
        );
        const usuarioSnap = await getDoc(usuarioRef);
        usuarioData = usuarioSnap.exists()
          ? (usuarioSnap.data() as Usuario)
          : null;
      }

      // 3. Obtener datos de la especialidad (si existe el campo)
      let especialidadData = null;
      if (estudianteData.idEspecialidad) {
        const especialidadRef = doc(
          db,
          "especialidades",
          String(estudianteData.idEspecialidad)
        );
        const especialidadSnap = await getDoc(especialidadRef);
        especialidadData = especialidadSnap.exists()
          ? (especialidadSnap.data() as Especialidad)
          : null;
      } else {
        // Fallback: si no tiene idEspecialidad, sólo evaluar una vez y sin repetir warnings
        if (!hasFetchedRef.current) {
          try {
            const especialidadesCol = collection(db, "especialidades");
            const allEspecialidadesSnap = await getDocs(especialidadesCol);
            if (allEspecialidadesSnap.size === 1) {
              const solo = allEspecialidadesSnap.docs[0];
              especialidadData = solo.data() as Especialidad;
            } else if (allEspecialidadesSnap.size > 1) {
            }
          } catch (e) {}
        }
      }

      // 4. Construir nombre completo de forma tolerante a diferentes nombres de campos
      let nombreCompleto = "Sin nombre";
      if (usuarioData) {
        const raw = usuarioData as any;
        // Manejar posible clave con espacio 'nombre '
        const nombreKey = Object.keys(raw).find((k) => k.trim() === "nombre");
        const nombre =
          raw.nombre ||
          raw.name ||
          raw.nombreCompleto ||
          (nombreKey ? raw[nombreKey] : "");
        const apPatKey = Object.keys(raw).find(
          (k) => k.trim() === "apellidoPaterno"
        );
        const apMatKey = Object.keys(raw).find(
          (k) => k.trim() === "apellidoMaterno"
        );
        const apPat =
          raw.apellidoPaterno ||
          raw.apellido1 ||
          (apPatKey ? raw[apPatKey] : "");
        const apMat =
          raw.apellidoMaterno ||
          raw.apellido2 ||
          (apMatKey ? raw[apMatKey] : "");
        nombreCompleto = [nombre, apPat, apMat]
          .filter(Boolean)
          .join(" ")
          .trim();
        if (!nombreCompleto) nombreCompleto = nombre || "Sin nombre";
      }

      // 5. Construir objeto EstudianteCompleto
      const estudianteCompleto: EstudianteCompleto = {
        numeroControl: estudianteData.numeroControl || "Sin número",
        nombreCompleto,
        especialidad: especialidadData?.nombre || "Sin especialidad",
        codigoEspecialidad: especialidadData?.codigo || "N/A",
        semestre: estudianteData.semestreActual,
        email: (usuarioData as any)?.email || "",
        telefono: (usuarioData as any)?.telefono || "",
        codigoQr: estudianteData.codigoQr || "Sin QR",
        fechaIngreso: estudianteData.fechaIngreso || "N/A",
      };

      setEstudiante(estudianteCompleto);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  // Generar el string para el QR
  const generateQRData = (): string => {
    if (!estudiante) return "";
    return [
      estudiante.numeroControl,
      estudiante.nombreCompleto,
      estudiante.codigoEspecialidad,
      estudiante.semestre,
      estudiante.fechaIngreso,
    ].join("|");
  };

  useEffect(() => {
    fetchEstudianteData();
  }, []);

  return {
    estudiante,
    isLoading,
    error,
    qrData: generateQRData(),
    refreshData: fetchEstudianteData,
  };
}
