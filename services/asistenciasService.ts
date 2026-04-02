import { apiRequest } from "./api";

/**
 * Servicio para operaciones de asistencias
 */
export const asistenciasService = {
  /**
   * Obtener asistencias del estudiante
   */
  obtenerAsistencias: async () => {
    return apiRequest("/api/movil/asistencias", {
      method: "GET",
    });
  },
};
