import { API_BASE_URL } from "@/constants/api";
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

    // 1. MODO OFFLINE (Carga Ultra Rápida)
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setCredencial(JSON.parse(cachedData));
        hasCache = true;
        setIsLoading(false); // Quitamos la ruedita de carga porque ya tenemos datos que mostrar
        console.log("[CREDENCIAL] Cargada desde el almacenamiento local (Offline)");
      }
    } catch (e) {
      console.error("Error al leer caché de credencial:", e);
    }

    if (!hasCache) {
      setIsLoading(true);
    }
    setError(null);

    // 2. MODO ONLINE (Actualización silenciosa en segundo plano)
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Sesión no válida");

      const res = await fetch(`${API_BASE_URL}/api/movil/credencial`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo obtener la credencial del servidor");

      const data = await res.json();

      // Arreglamos la foto igual que antes
      if (data.fotoUrl) {
        data.foto = data.fotoUrl.startsWith("http")
          ? data.fotoUrl
          : `${API_BASE_URL}${data.fotoUrl}`;
      }

      setCredencial(data);

      // 3. GUARDAMOS LA VERSIÓN FRESCA PARA LA PRÓXIMA VEZ
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      console.log("[CREDENCIAL] Datos actualizados desde internet y guardados.");

    } catch (err: any) {
      // Si falla el internet pero TENÍAMOS caché, no le mostramos error al alumno, 
      // simplemente le dejamos usar la credencial guardada.
      if (!hasCache) {
        setError(err.message || "Error al cargar la credencial");
        setCredencial(null);
      } else {
        console.log("⚠️ Sin internet: Usando la credencial guardada en el dispositivo.");
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