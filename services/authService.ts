import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/constants/api";

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    datos?: {
      idEstudiante: number;
    };
  };
}

/**
 * Servicio de autenticación
 * Login con email y contraseña, devuelve token y datos del usuario
 */
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/web/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.trim(), password, plataforma: "MOVIL" }),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("El servidor no responde (Error de Red)");
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Credenciales inválidas");
  }

  // Almacenar token
  await AsyncStorage.setItem("token", data.token);

  return data;
};
