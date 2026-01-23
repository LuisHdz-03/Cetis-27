import { colors } from "@/constants/colors";
import { styles } from "@/constants/credencialStyles";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Cargando credencial...",
}: LoadingStateProps) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Reintentar</Text>
      </TouchableOpacity>
    </View>
  );
}
