import { API_BASE_URL } from "@/constants/api";
import { checkBackendHealth } from "@/utils/api";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const healthy = await checkBackendHealth();
      setIsConnected(healthy);

      if (!healthy) {
        Alert.alert(
          "Error de conexión",
          `No se puede conectar al backend en:\n${API_BASE_URL}\n\nVerifica que el servidor esté funcionando.`,
          [{ text: "Reintentar", onPress: checkConnection }],
        );
      }
    } catch (error) {
      setIsConnected(false);
      console.error("Error checking backend:", error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (isConnected === null || isChecking) {
    return (
      <View style={styles.container}>
        <Text style={styles.checking}>Verificando conexión...</Text>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={[styles.container, styles.error]}>
        <Text style={styles.errorText}>⚠️ Sin conexión al servidor</Text>
        <Text style={styles.url}>{API_BASE_URL}</Text>
      </View>
    );
  }

  return null; // No mostrar nada si está conectado
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#FFF3CD",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE69C",
  },
  error: {
    backgroundColor: "#F8D7DA",
    borderBottomColor: "#F5C6CB",
  },
  checking: {
    textAlign: "center",
    color: "#856404",
    fontSize: 12,
  },
  errorText: {
    color: "#721C24",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  url: {
    color: "#721C24",
    textAlign: "center",
    fontSize: 10,
    marginTop: 4,
  },
});
