import { API_BASE_URL } from "@/constants/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  estudianteService,
  type RegistrarTutorData,
} from "@/services/estudianteService";
import type { EstudianteCompleto } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// Llave para guardar el perfil en caché offline
const CACHE_KEY = "@estudiante_perfil_offline";

export function useEstudiante() {
  const { token } = useAuth();
  const [estudiante, setEstudiante] = useState<EstudianteCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstudianteData = useCallback(async () => {
    let hasCache = false;

    // Primero intentar leer del caché
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setEstudiante(JSON.parse(cachedData));
        hasCache = true;
        setIsLoading(false);
      }
    } catch (e) {
      // Error silencioso al leer caché
    }

    // Si no hay caché, mostrar loading
    if (!hasCache) {
      setIsLoading(true);
    }
    setError(null);

    // Intentar obtener datos frescos de la API
    try {
      const data = await estudianteService.obtenerPerfil();

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
      // Guardar en caché para uso offline
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(estudianteFormateado),
      );
    } catch (err: any) {
      // Si hay caché, no mostramos error (datos offline disponibles)
      if (!hasCache) {
        setError(err.message || "Error al cargar datos");
        setEstudiante(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registrarTutor = async (datosTutor: RegistrarTutorData) => {
    try {
      await estudianteService.registrarTutor(datosTutor);
      await fetchEstudianteData();
      return true;
    } catch (err: any) {
      return false;
    }
  };

  useEffect(() => {
    fetchEstudianteData();
  }, [fetchEstudianteData]);

  return {
    estudiante,
    isLoading,
    error,
    refreshData: fetchEstudianteData,
    registrarTutor,
  };
}
