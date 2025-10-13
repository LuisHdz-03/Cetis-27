// services/asistenciasService.ts
// Servicio para manejar las peticiones de asistencias al backend

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://tu-api.com";

export interface AsistenciaDetallada {
  id?: number;
  fecha: string;
  tipo: "asistencia" | "retardo" | "falta";
  descripcion: string;
}

export interface EstadisticasAsistencias {
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
  porcentaje: number;
  clasesTotales: number;
}

export interface EstadisticasMateria {
  materiaId: string;
  materiaNombre: string;
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
}

export interface MateriaPickerOption {
  label: string;
  value: string;
}

/**
 * Servicio de Asistencias
 * Centraliza todas las peticiones relacionadas con asistencias
 */
export const asistenciasService = {
  /**
   * Obtiene la lista de materias para el picker
   * @param token - Token de autenticación (opcional)
   * @returns Array de opciones para el picker
   */
  async getMaterias(token?: string): Promise<MateriaPickerOption[]> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/materias`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getMaterias:", error);
      throw error;
    }
  },
  /**
   * Obtiene las asistencias detalladas por materia
   * @param materia - ID o nombre de la materia (opcional)
   * @param token - Token de autenticación (opcional)
   * @returns Array de asistencias detalladas
   */
  async getAsistenciasDetalladas(
    materia?: string | null,
    token?: string
  ): Promise<AsistenciaDetallada[]> {
    try {
      const endpoint = materia
        ? `${API_URL}/asistencias/${materia}`
        : `${API_URL}/asistencias/programacion`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getAsistenciasDetalladas:", error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas de asistencias
   * @param materia - ID o nombre de la materia (opcional)
   * @param token - Token de autenticación (opcional)
   * @returns Estadísticas de asistencias
   */
  async getEstadisticas(
    materia?: string | null,
    token?: string
  ): Promise<EstadisticasAsistencias> {
    try {
      const endpoint = materia
        ? `${API_URL}/asistencias/estadisticas/${materia}`
        : `${API_URL}/asistencias/estadisticas`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getEstadisticas:", error);
      throw error;
    }
  },

  /**
   * Obtiene las estadísticas de todas las materias del alumno
   * @param token - Token de autenticación (opcional)
   * @returns Array de estadísticas por materia
   */
  async getEstadisticasMaterias(
    token?: string
  ): Promise<EstadisticasMateria[]> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/estadisticas/materias`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en getEstadisticasMaterias:", error);
      throw error;
    }
  },

  /**
   * Registra una nueva asistencia
   * @param asistencia - Datos de la asistencia a registrar
   * @param token - Token de autenticación
   * @returns Asistencia registrada
   */
  async registrarAsistencia(
    asistencia: Omit<AsistenciaDetallada, "id">,
    token?: string
  ): Promise<AsistenciaDetallada> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/asistencias`, {
        method: "POST",
        headers,
        body: JSON.stringify(asistencia),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en registrarAsistencia:", error);
      throw error;
    }
  },
};

// Datos de ejemplo para desarrollo/testing
export const mockAsistenciasDetalladas: AsistenciaDetallada[] = [
  {
    id: 1,
    fecha: "2025-10-08",
    tipo: "asistencia",
    descripcion: "Asistió",
  },
  {
    id: 2,
    fecha: "2025-10-07",
    tipo: "retardo",
    descripcion: "Llegó 10 min tarde",
  },
  {
    id: 3,
    fecha: "2025-10-04",
    tipo: "asistencia",
    descripcion: "Asistió",
  },
  {
    id: 4,
    fecha: "2025-10-03",
    tipo: "falta",
    descripcion: "No asistió",
  },
  {
    id: 5,
    fecha: "2025-10-02",
    tipo: "asistencia",
    descripcion: "Asistió",
  },
  {
    id: 6,
    fecha: "2025-10-01",
    tipo: "retardo",
    descripcion: "Llegó 5 min tarde",
  },
];

export const mockEstadisticas: EstadisticasAsistencias = {
  totalAsistencias: 4,
  totalRetardos: 2,
  totalFaltas: 1,
  porcentaje: 85.7,
  clasesTotales: 7,
};

export const mockEstadisticasMaterias: EstadisticasMateria[] = [
  {
    materiaId: "programacion",
    materiaNombre: "Programación",
    totalAsistencias: 15,
    totalRetardos: 3,
    totalFaltas: 2,
  },
  {
    materiaId: "matematicas",
    materiaNombre: "Matemáticas",
    totalAsistencias: 18,
    totalRetardos: 1,
    totalFaltas: 1,
  },
  {
    materiaId: "ingles",
    materiaNombre: "Inglés",
    totalAsistencias: 16,
    totalRetardos: 2,
    totalFaltas: 2,
  },
  {
    materiaId: "fisica",
    materiaNombre: "Física",
    totalAsistencias: 14,
    totalRetardos: 4,
    totalFaltas: 2,
  },
];

export const mockMateriasParaPicker: MateriaPickerOption[] = [
  { label: "Programación", value: "programacion" },
  { label: "Matemáticas", value: "matematicas" },
  { label: "Inglés", value: "ingles" },
  { label: "Física", value: "fisica" },
  { label: "Química", value: "quimica" },
  { label: "Historia", value: "historia" },
];
