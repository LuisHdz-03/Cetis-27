import { API_BASE_URL } from "@/constants/api";
import type { DatosCredencial } from "@/types/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export function useDatosCredencial() {
  const [credencial, setCredencial] = useState<DatosCredencial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredencial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Sesión no válida");

      const res = await fetch(`${API_BASE_URL}/api/movil/credencial`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("No se pudo obtener la credencial");

      const data = await res.json();

      if (data.fotoUrl) {
        data.foto = data.fotoUrl.startsWith("http")
          ? data.fotoUrl
          : `${API_BASE_URL}${data.fotoUrl}`;
      }

      setCredencial(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar la credencial");
      setCredencial(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial automática
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
