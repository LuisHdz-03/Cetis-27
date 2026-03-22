import { API_BASE_URL } from "@/constants/api";
import { colors } from "@/constants/colors";
import type { AsistenciaMovil, EstadisticasMateria } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<AsistenciaMovil[]>([]);
  const [estadisticasGrupos, setEstadisticasGrupos] = useState<
    EstadisticasMateria[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatosAsistencia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Sesión expirada");

      const res = await fetch(`${API_BASE_URL}/api/movil/asistencia`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener datos");

      const data: AsistenciaMovil[] = await res.json();

      // Guardamos la lista completa para el historial
      setAsistencias(data);

      // Generamos las estadísticas basadas en la materia y el estatus
      const stats = procesarEstadisticas(data);
      setEstadisticasGrupos(stats);
    } catch (err) {
      console.error("Error useAsistencias:", err);
      setError("No se pudieron cargar las asistencias");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función interna para resumir los datos recibidos (Ahora usa materia y estatus)
  const procesarEstadisticas = (
    lista: AsistenciaMovil[],
  ): EstadisticasMateria[] => {
    const mapa = new Map<string, EstadisticasMateria>();

    lista.forEach((a) => {
      const nombreMateria = a.materia || "Materia desconocida";

      if (!mapa.has(nombreMateria)) {
        mapa.set(nombreMateria, {
          nombreMateria,
          total: 0,
          asistencias: 0,
          faltas: 0,
          retardos: 0,
          porcentajeAsistencia: 0,
        });
      }

      const item = mapa.get(nombreMateria)!;
      item.total++;

      // Comparamos contra 'estatus' que es lo que manda el back
      const estatus = a.estatus.toLowerCase();
      if (estatus.includes("asistencia")) item.asistencias++;
      else if (estatus.includes("falta")) item.faltas++;
      else if (estatus.includes("retardo")) item.retardos++;
    });

    return Array.from(mapa.values()).map((m) => ({
      ...m,
      // Cálculo: (Asistencias + Retardos) / Total
      porcentajeAsistencia:
        m.total > 0
          ? Math.round(((m.asistencias + m.retardos) / m.total) * 100)
          : 0,
    }));
  };

  const getIconForTipo = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes("asistencia"))
      return {
        name: "checkmark-circle" as const,
        color: colors.verdeAsistencia,
      };
    if (t.includes("retardo"))
      return { name: "time-outline" as const, color: colors.naranjaRetardos };
    return { name: "close-circle" as const, color: colors.rojoFaltas };
  };

  return {
    asistencias,
    estadisticasGrupos,
    isLoading,
    error,
    fetchDatosAsistencia,
    getIconForTipo,
  };
};
