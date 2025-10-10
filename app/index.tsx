import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <ActivityIndicator size="large" color="#691C32" />
      </View>
    );
  }

  return (
    <Redirect
      href={
        (isAuthenticated
          ? "/(tabs)/(inicio)/asistencias"
          : "/(auth)/login") as any
      }
    />
  );
}
