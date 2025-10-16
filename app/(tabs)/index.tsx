import { homeStyles as styles } from "@/constants/homeStyles";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export default function PerfilScreen() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
