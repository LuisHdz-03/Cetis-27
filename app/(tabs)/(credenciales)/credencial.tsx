import { CredencialCard } from "@/components/credencial/CredencialCard";
import {
  ErrorState,
  LoadingState,
} from "@/components/credencial/CredencialStates";
import { styles } from "@/constants/credencialStyles";
import { useCredencial } from "@/hooks/useCredencial";
import { useDatosCredencial } from "@/hooks/useDatosCredencial";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

export default function CredencialScreen() {
  const { credencial, isLoading, error, refreshData } = useDatosCredencial();

  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, []),
  );

  const { handleFlip, frontAnimatedStyle, backAnimatedStyle, showBack } =
    useCredencial();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !credencial) {
    return (
      <ErrorState
        error={error || "No se pudieron cargar los datos"}
        onRetry={refreshData}
      />
    );
  }

  // Debug: Verificar qué datos tiene la credencial
  console.log("Credencial en componente:", {
    curp: credencial.curp,
    grupo: credencial.grupo,
    turno: credencial.turno,
    todosLosDatos: credencial,
  });

  return (
    <View style={styles.container}>
      <CredencialCard
        estudiante={credencial}
        onFlip={handleFlip}
        frontAnimatedStyle={frontAnimatedStyle}
        backAnimatedStyle={backAnimatedStyle}
        showBack={showBack}
      />
    </View>
  );
}
