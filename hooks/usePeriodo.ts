import { API_BASE_URL } from "@/constants/api";
import { useEffect, useState } from "react";

interface Periodo {
  idPeriodo: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
  fechaCreacion: string;
  fechaEdicion: string;
}

interface PeriodoFormateado {
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

const formatearFecha = (fechaISO: string): string => {
  const fecha = new Date(fechaISO);
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();
  return `${mes} ${año}`;
};

export function usePeriodo() {
  const [periodo, setPeriodo] = useState<PeriodoFormateado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriodoActivo = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/periodos`);
        if (!res.ok) throw new Error("No se pudo obtener el periodo");

        const data: Periodo[] = await res.json();
        const periodoActivo = data.find((p) => p.activo === true);

        if (periodoActivo) {
          setPeriodo({
            fechaEmision: formatearFecha(periodoActivo.fechaInicio),
            vigencia: formatearFecha(periodoActivo.fechaFin),
          });
        } else {
          setError("No hay periodo activo");
        }
      } catch (err) {
        console.error("Error al obtener periodo:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriodoActivo();
  }, []);

  return { periodo, isLoading, error };
}
