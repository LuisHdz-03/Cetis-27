import { API_BASE_URL } from "@/constants/api";

/**
 * Script de diagnóstico para verificar la conectividad del backend
 * Ejecutar desde la consola del navegador o como componente de prueba
 */

export async function diagnosticBackend() {
  console.group("🔍 Diagnóstico del Backend");
  console.log("URL del API:", API_BASE_URL);
  console.log("Timestamp:", new Date().toISOString());

  // Test 1: Ping básico
  try {
    console.log("\n📡 Test 1: Ping básico");
    const startTime = Date.now();
    const response = await fetch(API_BASE_URL + "/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const duration = Date.now() - startTime;
    console.log(`✅ Status: ${response.status} (${duration}ms)`);
    const data = await response.json();
    console.log("Respuesta:", data);
  } catch (error) {
    console.error("❌ Error en ping básico:", error);
  }

  // Test 2: CORS preflight
  try {
    console.log("\n🌐 Test 2: CORS preflight");
    const response = await fetch(API_BASE_URL + "/api/periodos", {
      method: "OPTIONS",
    });
    console.log(`✅ OPTIONS Status: ${response.status}`);
    console.log("CORS headers:", {
      "access-control-allow-origin": response.headers.get(
        "access-control-allow-origin",
      ),
      "access-control-allow-methods": response.headers.get(
        "access-control-allow-methods",
      ),
      "access-control-allow-headers": response.headers.get(
        "access-control-allow-headers",
      ),
    });
  } catch (error) {
    console.error("❌ Error en CORS preflight:", error);
  }

  // Test 3: Endpoint real (periodos)
  try {
    console.log("\n📚 Test 3: Endpoint /api/periodos");
    const startTime = Date.now();
    const response = await fetch(API_BASE_URL + "/api/periodos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const duration = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Status: ${response.status} (${duration}ms)`);
      console.log(`Periodos encontrados: ${data.length || 0}`);
    } else {
      console.error(`❌ Status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error:", errorText);
    }
  } catch (error) {
    console.error("❌ Error en endpoint /api/periodos:", error);
  }

  // Test 4: Verificar DNS/Conectividad
  try {
    console.log("\n🔌 Test 4: Conectividad de red");
    const url = new URL(API_BASE_URL);
    console.log("Protocolo:", url.protocol);
    console.log("Host:", url.host);
    console.log("Hostname:", url.hostname);

    // Intentar resolver el DNS
    const dnsTest = await fetch(
      `https://dns.google/resolve?name=${url.hostname}&type=A`,
    );
    if (dnsTest.ok) {
      const dnsData = await dnsTest.json();
      console.log("DNS resuelto correctamente:", dnsData);
    }
  } catch (error) {
    console.error("❌ Error en verificación de DNS:", error);
  }

  // Test 5: Timeout test
  try {
    console.log("\n⏱️ Test 5: Timeout (10s)");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_BASE_URL + "/", {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log(`✅ Respuesta recibida antes del timeout`);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("❌ Timeout: El servidor tardó más de 10 segundos");
    } else {
      console.error("❌ Error:", error);
    }
  }

  console.groupEnd();

  return {
    apiUrl: API_BASE_URL,
    timestamp: new Date().toISOString(),
    completado: true,
  };
}

// Para uso en desarrollo
if (__DEV__) {
  (global as any).diagnosticBackend = diagnosticBackend;
  console.log(
    "💡 Ejecuta 'diagnosticBackend()' en la consola para diagnosticar la conexión",
  );
}
