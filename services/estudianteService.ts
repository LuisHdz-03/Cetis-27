import { apiRequest, apiUpload } from "./api";

export interface RegistrarTutorData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  parentesco: string;
  email?: string;
  direccion?: string;
}

export interface CambiarPasswordData {
  passwordActual: string;
  passwordNueva: string;
}

/**
 * Servicio para operaciones relacionadas con el estudiante
 */
export const estudianteService = {
  /**
   * Obtener perfil completo del estudiante
   */
  obtenerPerfil: async () => {
    return apiRequest("/api/movil/perfil", {
      method: "GET",
    });
  },

  /**
   * Registrar tutor del estudiante
   */
  registrarTutor: async (datos: RegistrarTutorData) => {
    return apiRequest("/api/movil/perfil/tutor", {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  /**
   * Subir foto de perfil
   */
  subirFoto: async (formData: FormData) => {
    return apiUpload("/api/movil/perfil/foto", formData, "PUT");
  },

  /**
   * Cambiar contraseña
   */
  cambiarPassword: async (datos: CambiarPasswordData) => {
    return apiRequest("/api/movil/perfil/contrasenia ", {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  },

  /**
   * Actualizar datos de contacto del alumno
   */
  actualizarContacto: async (datos: { email?: string; telefono?: string; direccion?: string }) => {
    return apiRequest("/api/movil/perfil/contacto", {
      method: "PUT",
      body: JSON.stringify(datos),
    });
  },
};
