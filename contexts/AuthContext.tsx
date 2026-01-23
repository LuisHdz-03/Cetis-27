import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_BASE_URL } from "@/constants/api";
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
  idUsuario: string;
  email: string;
  estudianteId?: string;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const estudianteId = await AsyncStorage.getItem("estudianteId");
        const userId = await AsyncStorage.getItem("userId");
        const userEmail = await AsyncStorage.getItem("userEmail");

        if (token) {
          setToken(token);
          setIsAuthenticated(true);

          if (userId && userEmail) {
            setUser({
              idUsuario: userId,
              email: userEmail,
              estudianteId: estudianteId || undefined,
            });
          } else if (estudianteId) {
            setUser({
              idUsuario: "temp",
              email: "temp@email.com",
              estudianteId: estudianteId,
            });
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Credenciales incorrectas");
      const data = await response.json();
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("userId", String(data.user.idUsuario));
      await AsyncStorage.setItem("userEmail", data.user.email);

      if (
        typeof data.user.idEstudiante === "number" &&
        !isNaN(data.user.idEstudiante)
      ) {
        await AsyncStorage.setItem(
          "estudianteId",
          String(data.user.idEstudiante),
        );
      } else {
        await AsyncStorage.removeItem("estudianteId");
      }
      setUser({
        idUsuario: data.user.idUsuario,
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
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("estudianteId");
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
