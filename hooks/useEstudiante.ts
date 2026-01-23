import { useAuth } from "@/contexts/AuthContext";
import type {
  Especialidad,
  Estudiante,
  EstudianteCompleto,
  Usuario,
} from "@/types/database";
import { apiGet } from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";

export type { Especialidad, Estudiante, EstudianteCompleto, Usuario };

export function useEstudiante() {
  const { token } = useAuth();
  const [estudiante, setEstudiante] = useState<EstudianteCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  const fetchEstudianteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const resolvedEstudianteId = await AsyncStorage.getItem("estudianteId");

      if (!resolvedEstudianteId) {
        throw new Error(
          "No hay estudiante autenticado (estudianteId no encontrado en almacenamiento)",
        );
      }

      const data = await apiGet<any>(
        `/api/estudiantes/${resolvedEstudianteId}`,
      );

      const estudianteCompleto: EstudianteCompleto = {
        idUsuario: data.idUsuario || data.usuario?.idUsuario,
        foto: data.foto || null,

        numeroControl: data.numeroControl || "Sin número",
        nombreCompleto: data.nombreCompleto || "Sin nombre",
        especialidad: data.especialidad || "Sin especialidad",

        codigoEspecialidad: data.codigoEspecialidad || "N/A",
        semestre: data.semestre || 1,
        email: data.email || "",
        telefono: data.telefono || "",
        codigoQr: data.codigoQr || "Sin QR",
        fechaIngreso: data.fechaIngreso || "N/A",
        curp: data.curp || "Sin CURP",
      };
      setEstudiante(estudianteCompleto);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRData = (): string => {
    if (!estudiante) return "";
    return [estudiante.numeroControl].join("");
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
