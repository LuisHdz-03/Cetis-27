import { auth, db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios en el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado
        const idToken = await firebaseUser.getIdToken();

        // Buscar el estudianteId en AsyncStorage o Firestore
        let storedEstudianteId = await AsyncStorage.getItem("estudianteId");

        // Si no está en AsyncStorage, buscar en Firestore usando la estructura: usuarios -> estudiantes
        if (!storedEstudianteId) {
          try {
            // Paso 1: Buscar el documento de usuario por authUid
            const usuariosRef = collection(db, "usuarios");
            const qUsuario = query(
              usuariosRef,
              where("authUid", "==", firebaseUser.uid)
            );
            const usuarioSnap = await getDocs(qUsuario);

            if (!usuarioSnap.empty) {
              const usuarioId = usuarioSnap.docs[0].id;

              // Paso 2: Buscar el estudiante vinculado a ese usuario
              const estudiantesRef = collection(db, "estudiantes");
              const qEstudiante = query(
                estudiantesRef,
                where("idUsuario", "==", usuarioId)
              );
              const estudianteSnap = await getDocs(qEstudiante);

              if (!estudianteSnap.empty) {
                storedEstudianteId = estudianteSnap.docs[0].id;
                await AsyncStorage.setItem("estudianteId", storedEstudianteId);
              } else {
                // ...
              }
            } else {
              // ...
            }
          } catch (e) {
            // ...
          }
        }

        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          estudianteId: storedEstudianteId || undefined,
        };

        setFirebaseUser(firebaseUser);
        setUser(userData);
        setToken(idToken);
        setIsAuthenticated(true);
      } else {
        // Usuario no autenticado
        setFirebaseUser(null);
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Login real con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      // Buscar estudiante usando la estructura: usuarios -> estudiantes
      let estudianteId: string | undefined = undefined;
      try {
        // Paso 1: Buscar el documento de usuario por authUid
        const usuariosRef = collection(db, "usuarios");
        const qUsuario = query(
          usuariosRef,
          where("authUid", "==", firebaseUser.uid)
        );
        const usuarioSnap = await getDocs(qUsuario);

        if (!usuarioSnap.empty) {
          const usuarioId = usuarioSnap.docs[0].id;

          // Paso 2: Buscar el estudiante vinculado a ese usuario
          const estudiantesRef = collection(db, "estudiantes");
          const qEstudiante = query(
            estudiantesRef,
            where("idUsuario", "==", usuarioId)
          );
          const estudianteSnap = await getDocs(qEstudiante);

          if (!estudianteSnap.empty) {
            estudianteId = estudianteSnap.docs[0].id;
            await AsyncStorage.setItem("estudianteId", estudianteId);
          } else {
            // ...
          }
        } else {
          // ...
        }
      } catch (e) {
        // ...
      }

      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || "",
        estudianteId: estudianteId,
      };

      setFirebaseUser(firebaseUser);
      setUser(userData);
      setToken(idToken);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      // ...
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("estudianteId");
      setFirebaseUser(null);
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      // ...
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        firebaseUser,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
