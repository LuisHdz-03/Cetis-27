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

      const estudianteFormateado: EstudianteCompleto = {
        idUsuario: String(data.usuarioId || data.idEstudiante || ""),

        foto: data.fotoUrl
          ? data.fotoUrl.startsWith("http")
            ? data.fotoUrl
            : `${API_BASE_URL}${data.fotoUrl}`
          : null,

        numeroControl: data.matricula || "Sin matrícula",
        nombreCompleto:
          `${data.usuario?.nombre || ""} ${data.usuario?.apellidoPaterno || ""} ${data.usuario?.apellidoMaterno || ""}`.trim(),

        especialidad: data.grupo?.especialidad?.nombre || "Sin especialidad",

        semestre: data.semestre || data.grupo?.grado || 1,

        email: data.usuario?.email || "",
        telefono: data.usuario?.telefono || "",
        direccion: data.usuario?.direccion || "",
        curp: data.usuario?.curp || "",

        grupoNombre: data.grupo?.nombre || "N/A",
        turno: data.grupo?.turno || "N/A",

        tutor: data.tutor
          ? {
              nombre:
                `${data.tutor.nombre} ${data.tutor.apellidoPaterno || ""} ${data.tutor.apellidoMaterno || ""}`.trim(),
              telefono: data.tutor.telefono || "",
              parentesco: data.tutor.parentesco || "Tutor",
              email: data.tutor.email || undefined,
              direccion: data.tutor.direccion || undefined,
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

  const registrarTutor = async (datosTutor: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    telefono: string;
    parentesco: string;
    email?: string;
    direccion?: string;
  }) => {
    try {
      const currentToken = token || (await AsyncStorage.getItem("token"));
      if (!currentToken) throw new Error("No hay sesión activa");

      const res = await fetch(`${API_BASE_URL}/api/movil/perfil/tutor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(datosTutor),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "No se pudo registrar el tutor";

        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          await res.text();
          errorMessage = `Error ${res.status}: El endpoint no está disponible`;
        }

        throw new Error(errorMessage);
      }

      await res.json();
      await fetchEstudianteData();
      return true;
    } catch (err: any) {
      return false;
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
    registrarTutor,
  };
}
