import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import type { EstudianteCompleto } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useEstudiante() {
  const { token } = useAuth();
  const [estudiante, setEstudiante] = useState<EstudianteCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstudianteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentToken = token || (await AsyncStorage.getItem("token"));

      if (!currentToken) {
        throw new Error("No hay sesión activa");
      }

      const res = await fetch(`${API_BASE_URL}/api/movil/perfil`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (!res.ok)
        throw new Error("No se pudo obtener el perfil del estudiante");

      const data = await res.json();

      // Mapeo directo desde el objeto 'estudiante' que devuelve tu backend
      const estudianteFormateado: EstudianteCompleto = {
        idUsuario: String(data.usuarioId),
        // IMPORTANTE: Concatenamos la URL del servidor para la imagen
        foto: data.fotoUrl ? `${API_BASE_URL}${data.fotoUrl}` : null,

        numeroControl: data.matricula || "Sin matrícula",
        nombreCompleto: `${data.usuario?.nombre} ${data.usuario?.apellidoPaterno} ${data.usuario?.apellidoMaterno}`,

        especialidad:
          data.grupo?.especialidad?.nombre || "Sin especialidad asignada",
        semestre: data.semestre || 1,

        email: data.usuario?.email || "",
        telefono: data.usuario?.telefono || "Sin teléfono",
        direccion: data.usuario?.direccion || "Sin dirección",
        curp: data.usuario?.curp || "Sin CURP",

        // Info del Grupo
        grupoNombre: data.grupo?.nombre || "N/A",
        turno: data.grupo?.turno || "N/A",

        // Info del Tutor (si existe)
        tutor: data.tutor
          ? {
              nombre: `${data.tutor.nombre} ${data.tutor.apellidoPaterno}`,
              telefono: data.tutor.telefono,
              parentesco: data.tutor.parentesco,
            }
          : null,
      };

      setEstudiante(estudianteFormateado);
    } catch (err: any) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEstudianteData();
  }, []);

  return {
    estudiante,
    isLoading,
    error,
    refreshData: fetchEstudianteData,
  };
}
