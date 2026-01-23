import { API_BASE_URL } from "@/constants/api";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";

export function QuickTest() {
  const [result, setResult] = useState<string>("");
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setResult("Probando...");

    try {
      // Test 1: Ping básico
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(API_BASE_URL + "/", {
        method: "GET",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setResult(
          `✅ CONECTADO\n${API_BASE_URL}\nStatus: ${response.status}\nRespuesta: ${JSON.stringify(data, null, 2)}`
        );
        Alert.alert("✅ Éxito", "Backend funcionando correctamente");
      } else {
        setResult(
          `❌ ERROR\nStatus: ${response.status}\n${await response.text()}`
        );
        Alert.alert("❌ Error", `HTTP ${response.status}`);
      }
    } catch (error: any) {
      const errorMsg =
        error.name === "AbortError"
          ? "⏱️ TIMEOUT - El servidor tardó más de 10 segundos"
          : `❌ ERROR: ${error.message}`;

      setResult(`${errorMsg}\n\nURL probada:\n${API_BASE_URL}`);
      Alert.alert("❌ Error de conexión", error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Test de Conexión</Text>
      <Text style={styles.url}>{API_BASE_URL}</Text>

      <Button
        title={testing ? "Probando..." : "Probar Conexión"}
        onPress={testConnection}
        disabled={testing}
      />

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}

      <Text style={styles.hint}>
        💡 Si falla: Abre constants/api.ts y cambia USE_LOCAL a true
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  url: {
    fontSize: 12,
    color: "#666",
    marginBottom: 15,
    fontFamily: "monospace",
  },
  resultBox: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  resultText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
  },
  hint: {
    marginTop: 15,
    fontSize: 11,
    color: "#888",
    fontStyle: "italic",
  },
});
