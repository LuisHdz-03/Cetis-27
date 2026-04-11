import { API_BASE_URL } from "@/constants/api";
import { credencialService } from "@/services/credencialService";
import type { DatosCredencial } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const CACHE_KEY = "@credencial_offline";

export function useDatosCredencial() {
  const [credencial, setCredencial] = useState<DatosCredencial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SESSION_EXPIRY_KEY = "@credencial_session_expiry";
  const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

  const fetchCredencial = useCallback(async () => {
    let hasCache = false;
    let expired = false;

    try {
      const [cachedData, expiry] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY),
        AsyncStorage.getItem(SESSION_EXPIRY_KEY),
      ]);
      if (cachedData && expiry) {
        const now = Date.now();
        if (now < Number(expiry)) {
          setCredencial(JSON.parse(cachedData));
          hasCache = true;
          setIsLoading(false);
        } else {
          expired = true;
        }
      }
    } catch (e) {}

    if (!hasCache) {
      setIsLoading(true);
    }
    setError(null);

    if (!hasCache || expired) {
      try {
        const data = await credencialService.obtenerCredencial();

        if (data.fotoUrl) {
          data.fotoUrl = data.fotoUrl.startsWith("http")
            ? data.fotoUrl
            : `${API_BASE_URL}${data.fotoUrl}`;
        }
        if (data.imagenFirmaDirector) {
          data.imagenFirmaDirector = data.imagenFirmaDirector.startsWith("http")
            ? data.imagenFirmaDirector
            : `${API_BASE_URL}${data.imagenFirmaDirector}`;
        }
        if (data.firmante && data.firmante.firmaImagenUrl) {
          data.firmante.firmaImagenUrl =
            data.firmante.firmaImagenUrl.startsWith("http")
              ? data.firmante.firmaImagenUrl
              : `${API_BASE_URL}${data.firmante.firmaImagenUrl}`;
        }
        setCredencial(data);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
        await AsyncStorage.setItem(
          SESSION_EXPIRY_KEY,
          String(Date.now() + SESSION_DURATION_MS),
        );
      } catch (err: any) {
        if (!hasCache) {
          setError(err.message || "Error al cargar la credencial");
          setCredencial(null);
        }
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

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
