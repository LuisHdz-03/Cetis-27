import AsyncStorage from "@react-native-async-storage/async-storage";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  estudianteId?: string; // ID del documento en la colección "estudiantes"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Aquí podrías agregar lógica para verificar si hay un JWT guardado en AsyncStorage
  // y establecer el usuario autenticado si existe

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setToken(token);
        setIsAuthenticated(true);
        // Aquí podrías agregar lógica para obtener el usuario desde el backend
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Nuevo login usando el backend con JWT
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://192.168.1.87:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Credenciales incorrectas");
      const data = await response.json();
      // Guarda el token JWT en AsyncStorage o SecureStore
      await AsyncStorage.setItem("token", data.token);
      // Si es estudiante, guarda el idEstudiante numérico
      if (
        typeof data.user.idEstudiante === "number" &&
        !isNaN(data.user.idEstudiante)
      ) {
        await AsyncStorage.setItem(
          "estudianteId",
          String(data.user.idEstudiante)
        );
      } else {
        await AsyncStorage.removeItem("estudianteId");
      }
      setUser({
        id: data.user.idUsuario,
        email: data.user.email,
        estudianteId: data.user.idEstudiante,
      });
      setToken(data.token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      setError("Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      setError("Error al cerrar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
