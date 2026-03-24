import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

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
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/movil/credencial`, {
          // <--- Ruta de getCredencial
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setDatosCredencial({
          fechaEmision: data.emision,
          vigencia: data.vigencia,
        });
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchCredencial();
  }, []);

  return { fechas: datosCredencial, isLoading };
}
