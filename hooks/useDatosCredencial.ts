import { API_BASE_URL } from "@/constants/api";
import { credencialService } from "@/services/credencialService";
import type { DatosCredencial } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// Llave con la que guardaremos la credencial en el teléfono
const CACHE_KEY = "@credencial_offline";

export function useDatosCredencial() {
  const [credencial, setCredencial] = useState<DatosCredencial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredencial = useCallback(async () => {
    let hasCache = false;

    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setCredencial(JSON.parse(cachedData));
        hasCache = true;
        setIsLoading(false);
      }
    } catch (e) {
      // Error silencioso al leer caché
    }

    if (!hasCache) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await credencialService.obtenerCredencial();

      if (data.fotoUrl) {
        data.foto = data.fotoUrl.startsWith("http")
          ? data.fotoUrl
          : `${API_BASE_URL}${data.fotoUrl}`;
      }

      setCredencial(data);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err: any) {
      if (!hasCache) {
        setError(err.message || "Error al cargar la credencial");
        setCredencial(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchCredencial();
  }, [fetchCredencial]);

  return {
    credencial,
    isLoading,
    error,
    refreshData: fetchCredencial,
  };
}
