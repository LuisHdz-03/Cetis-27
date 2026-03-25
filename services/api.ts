import { API_BASE_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Helper base para peticiones HTTP con manejo automático de token
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = await AsyncStorage.getItem("token");

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Manejo de errores HTTP
  if (!response.ok) {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || "Error en la petición",
      );
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
};

/**
 * Helper para peticiones con FormData (archivos)
 */
export const apiUpload = async <T = any>(
  endpoint: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> => {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body: formData,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || errorData.message || "Error al subir archivo",
      );
    } else {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }

  return response.json();
};
