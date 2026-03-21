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

      const currentToken = token || (await AsyncStorage.getItem("token"));

      if (!currentToken) {
        throw new Error("No hay sesión activa (token no encontrado)");
      }

      const res = await fetch(`${API_BASE_URL}/api/movil/perfil`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener el estudiante");
      const data = await res.json();

      const estudianteCompleto: EstudianteCompleto = {
        idUsuario: data.usuario?.idUsuario,
        foto: data.estudiante?.fotoUrl || null,

        numeroControl: data.estudiante?.matricula || "Sin número",
        nombreCompleto: `${data.usuario?.nombre} ${data.usuario?.apellidoPaterno} ${data.usuario?.apellidoMaterno}`,
        especialidad:
          data.estudiante?.grupo?.especialidad?.nombre || "Sin especialidad",

        codigoEspecialidad:
          data.estudiante?.grupo?.especialidad?.codigo || "N/A",
        semestre: data.estudiante?.semestre || 1,
        email: data.usuario?.email || "",
        telefono: data.usuario?.telefono || "",
        codigoQr: data.estudiante?.matricula || "Sin QR",
        fechaIngreso: data.estudiante?.fechaIngreso || "N/A",
        curp: data.usuario?.curp || "Sin CURP",
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
