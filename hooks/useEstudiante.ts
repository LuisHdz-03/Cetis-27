import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import type {
  Especialidad,
  Estudiante,
  EstudianteCompleto,
  Usuario,
} from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

      // Obtener datos completos del estudiante desde el backend (con joins)
      const res = await fetch(
        `${API_BASE_URL}/api/estudiantes/${resolvedEstudianteId}`
      );
      if (!res.ok) throw new Error("No se pudo obtener el estudiante");
      const data = await res.json();

      // El backend debe devolver todos los datos necesarios ya "populados"
      const estudianteCompleto: EstudianteCompleto = {
        numeroControl: data.numeroControl || "Sin número",
        nombreCompleto: data.nombreCompleto || "Sin nombre",
        especialidad: data.especialidad || "Sin especialidad",
        codigoEspecialidad: data.codigoEspecialidad || "N/A",
        semestre: data.semestre || 1,
        email: data.email || "",
        telefono: data.telefono || "",
        codigoQr: data.codigoQr || "Sin QR",
        fechaIngreso: data.fechaIngreso || "N/A",
      };
      setEstudiante(estudianteCompleto);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  // Generar el string para el QR (delimitado por pipes)
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
