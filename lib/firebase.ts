// Firebase Web SDK (compatible con Expo/React Native)
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STR_BKT,
  messagingSenderId: process.env.EXPO_PUBLIC_MSG_SND_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// Inicializa Firebase una sola vez (evita duplicados en hot-reload)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth - Firebase Auth persiste automáticamente en React Native
// El warning de AsyncStorage aparece pero la sesión SÍ se persiste usando el almacenamiento nativo
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Exporta app por si se requiere en otros módulos
export { app };
