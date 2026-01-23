import { CredencialCard } from "@/components/credencial/CredencialCard";
import {
  ErrorState,
  LoadingState,
} from "@/components/credencial/CredencialStates";
import { styles } from "@/constants/credencialStyles";
import { useCredencial } from "@/hooks/useCredencial";
import { useEstudiante } from "@/hooks/useEstudiante";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";

export default function CredencialScreen() {
  const { estudiante, isLoading, error, refreshData } = useEstudiante();

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

  if (error || !estudiante) {
    return (
      <ErrorState
        error={error || "No se pudieron cargar los datos"}
        onRetry={refreshData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CredencialCard
        estudiante={estudiante}
        onFlip={handleFlip}
        frontAnimatedStyle={frontAnimatedStyle}
        backAnimatedStyle={backAnimatedStyle}
        showBack={showBack}
      />
    </View>
  );
}
