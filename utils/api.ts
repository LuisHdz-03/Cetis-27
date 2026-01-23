import { API_BASE_URL } from "@/constants/api";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * Wrapper para fetch con mejor manejo de errores y timeout
 */
export async function apiFetch(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { timeout = 15000, ...fetchOptions } = options;

  // Configurar headers por defecto
  const headers = new Headers(fetchOptions.headers);
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    console.log(`[API] ${fetchOptions.method || "GET"} ${url}`);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Log de respuesta
    console.log(`[API] Response ${response.status} from ${url}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${errorText || response.statusText}`,
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(
          `Tiempo de espera agotado (${timeout}ms) para ${endpoint}`,
        );
      }
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }

    throw new Error("Error desconocido en la petición");
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint, { method: "GET" });
  return response.json();
}

/**
 * POST request helper
 */
export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * PUT request helper
 */
export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiFetch(endpoint, { method: "DELETE" });
  return response.json();
}

/**
 * Verifica si el backend está disponible
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await apiFetch("/", { timeout: 5000 });
    return response.ok;
  } catch (error) {
    console.error("[API Health Check] Backend no disponible:", error);
    return false;
  }
}
