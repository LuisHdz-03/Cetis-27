import { apiRequest } from "./api";

/**
 * Servicio para operaciones de reportes
 */
export const reportesService = {
  /**
   * Obtener reportes del estudiante
   */
  obtenerReportes: async () => {
    return apiRequest("/api/movil/reportes", {
      method: "GET",
    });
  },
};
