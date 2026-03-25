import { credencialService } from "@/services/credencialService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const CACHE_KEY = "@periodo_offline";

interface FechasFormateadas {
  fechaEmision: string;
  vigencia: string;
}

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formatearFecha = (fechaISO: string | null): string => {
  if (!fechaISO) return "---";
  const fecha = new Date(fechaISO);
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${mes} ${año}`;
};

export function usePeriodo() {
  const [datosCredencial, setDatosCredencial] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCredencial = async () => {
      let hasCache = false;

      // Primero intentar leer del caché
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {
          setDatosCredencial(JSON.parse(cachedData));
          hasCache = true;
          setIsLoading(false);
        }
      } catch (e) {
        // Error silencioso al leer caché
      }

      try {
        const data = await credencialService.obtenerCredencial();

        const periodoData = {
          fechaEmision: data.emision,
          vigencia: data.vigencia,
        };

        setDatosCredencial(periodoData);
        // Guardar en caché para uso offline
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(periodoData));
      } catch (err) {
        // Si no hay caché, error silencioso pero mantener loading en false
        if (!hasCache) {
          // Error silencioso
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCredencial();
  }, []);

  return { fechas: datosCredencial, isLoading };
}
