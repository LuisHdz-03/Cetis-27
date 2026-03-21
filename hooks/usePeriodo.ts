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
  const [fechas, setFechas] = useState<FechasFormateadas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatosEstudiante = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await AsyncStorage.getItem("token");
        if (!token) throw new Error("No hay sesión activa");

        // Llamamos al endpoint del perfil del alumno logueado
        const res = await fetch(`${API_BASE_URL}/api/movil/perfil`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok)
          throw new Error("No se pudieron obtener las fechas de la credencial");

        const estudiante = await res.json();

        // Usamos las fechas específicas del registro del estudiante en la BD
        if (estudiante) {
          setFechas({
            fechaEmision: formatearFecha(estudiante.credencialFechaEmision),
            vigencia: formatearFecha(estudiante.credencialFechaExpiracion),
          });
        }
      } catch (err) {
        console.error("Error al obtener fechas de credencial:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatosEstudiante();
  }, []);

  return { fechas, isLoading, error };
}
