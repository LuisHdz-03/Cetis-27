import { apiRequest } from "./api";

/**
 * Servicio para operaciones de credencial
 */
export const credencialService = {
  /**
   * Obtener datos de la credencial del estudiante
   */
  obtenerCredencial: async () => {
    return apiRequest("/api/movil/credencial", {
      method: "GET",
    });
  },
};
