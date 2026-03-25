import { colors } from "@/constants/colors";
import { asistenciasService } from "@/services/asistenciasService";
import type { AsistenciaMovil, EstadisticasMateria } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";

const CACHE_KEY = "@asistencias_offline";

export const useAsistencias = () => {
  const [asistencias, setAsistencias] = useState<AsistenciaMovil[]>([]);
  const [estadisticasGrupos, setEstadisticasGrupos] = useState<
    EstadisticasMateria[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDatosAsistencia = useCallback(async () => {
    let hasCache = false;

    // Primero intentar leer del caché
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        setAsistencias(parsedData);
        const stats = procesarEstadisticas(parsedData);
        setEstadisticasGrupos(stats);
        hasCache = true;
      }
    } catch (e) {
      // Error silencioso al leer caché
    }

    setIsLoading(true);
    setError(null);
    try {
      const data: AsistenciaMovil[] =
        await asistenciasService.obtenerAsistencias();
      setAsistencias(data);

      const stats = procesarEstadisticas(data);
      setEstadisticasGrupos(stats);

      // Guardar en caché para uso offline
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      // Si hay caché, no mostramos error (datos offline disponibles)
      if (!hasCache) {
        setError("No se pudieron cargar las asistencias");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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

      // MODO TODO TERRENO
      const estatus = (a.estatus || "").toUpperCase().trim();

      if (
        estatus.includes("PRESENT") ||
        estatus.includes("ASIST") ||
        estatus === "A"
      ) {
        item.asistencias++;
      } else if (estatus.includes("RETARD") || estatus === "R") {
        item.retardos++;
      } else if (estatus.includes("JUSTIFIC")) {
        item.asistencias++;
      } else {
        item.faltas++;
      }
    });

    return Array.from(mapa.values()).map((m) => ({
      ...m,
      porcentajeAsistencia:
        m.total > 0
          ? Math.round(((m.asistencias + m.retardos) / m.total) * 100)
          : 0,
    }));
  };

  const getIconForTipo = (tipo: string) => {
    const t = (tipo || "").toUpperCase().trim();

    if (t.includes("PRESENT") || t.includes("ASIST") || t === "A") {
      return {
        name: "checkmark-circle" as const,
        color: colors.verdeAsistencia,
      };
    }
    if (t.includes("RETARD") || t === "R") {
      return { name: "time-outline" as const, color: colors.naranjaRetardos };
    }
    if (t.includes("JUSTIFIC")) {
      return { name: "document-text" as const, color: colors.primary };
    }

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
