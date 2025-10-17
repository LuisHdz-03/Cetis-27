import { useAuth } from "@/contexts/AuthContext";
import type {
  Especialidad,
  Estudiante,
  EstudianteCompleto,
  Usuario,
} from "@/types/database";
import { useEffect, useState } from "react";
import { MOCK_ESTUDIANTE, simulateNetworkDelay } from "./mockData";

// Re-exportar para mantener compatibilidad con código existente
export type { Especialidad, Estudiante, EstudianteCompleto, Usuario };

export function useEstudiante() {
  const { token } = useAuth(); // Asumiendo que tienes el token en AuthContext
  const [estudiante, setEstudiante] = useState<EstudianteCompleto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstudianteData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 🧪 MODO DESARROLLO: Usar datos mock (comentar cuando tengas API)
      await simulateNetworkDelay(1000);
      setEstudiante(MOCK_ESTUDIANTE);
      setIsLoading(false);
      return;

      // 🌐 MODO PRODUCCIÓN: Llamada real a la API (comentado mientras no hay backend)
      // TODO: Reemplazar con tu endpoint real
      // const response = await fetch("https://tu-api.com/api/estudiante/perfil", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // if (!response.ok) {
      //   throw new Error("Error al obtener datos del estudiante");
      // }

      // const data = await response.json();

      // // Mapear los datos de la API al formato que necesitamos
      // const estudianteData: EstudianteCompleto = {
      //   numeroControl: data.numeroControl,
      //   nombreCompleto: `${data.usuario.nombre} ${data.usuario.apellidoPaterno} ${data.usuario.apellidoMaterno}`,
      //   especialidad: data.especialidad.nombre,
      //   codigoEspecialidad: data.especialidad.codigo,
      //   semestre: data.semestreActual,
      //   email: data.usuario.email,
      //   telefono: data.usuario.telefono,
      //   codigoQr: data.codigoQr,
      //   fechaIngreso: data.fechaIngreso,
      // };

      // setEstudiante(estudianteData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching estudiante:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Generar el string para el QR
  const generateQRData = (): string => {
    if (!estudiante) return "";

    // Puedes elegir el formato que prefieras:
    // Opción 1: JSON (más estructurado)
    const qrData = {
      nc: estudiante.numeroControl, // Número de control
      n: estudiante.nombreCompleto, // Nombre
      e: estudiante.codigoEspecialidad, // Especialidad
      s: estudiante.semestre, // Semestre
      c: estudiante.codigoQr, // Código QR único
      f: estudiante.fechaIngreso, // Fecha de ingreso
    };
    return JSON.stringify(qrData);

    // Opción 2: String delimitado (más compacto)
    // return `${estudiante.numeroControl}|${estudiante.nombreCompleto}|${estudiante.codigoEspecialidad}|${estudiante.semestre}|${estudiante.codigoQr}`;

    // Opción 3: Solo el código QR único (más simple y seguro)
    // return estudiante.codigoQr;
  };

  useEffect(() => {
    fetchEstudianteData();
  }, []);

  return {
    estudiante,
    isLoading,
    error,
    qrData: generateQRData(),
    refreshData: fetchEstudianteData,
  };
}
