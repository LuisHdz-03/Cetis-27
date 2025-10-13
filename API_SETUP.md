# 📡 Configuración del Backend - Asistencias

Este documento explica cómo conectar la aplicación con tu backend para obtener las asistencias detalladas.

## 🔧 Configuración Actual

El código está preparado para recibir datos del backend. Actualmente usa datos de ejemplo en modo de desarrollo cuando falla la petición.

### Ubicación del código

- Archivo: `app/(tabs)/(inicio)/asistencias.tsx`
- Función: `fetchAsistenciasDetalladas()`

---

## 📝 Estructura de Datos Esperada

### Interface TypeScript

```typescript
interface AsistenciaDetallada {
  id?: number;
  fecha: string;
  tipo: "asistencia" | "retardo" | "falta";
  descripcion: string;
}
```

### Ejemplo de Respuesta JSON del Backend

```json
[
  {
    "id": 1,
    "fecha": "2025-10-08",
    "tipo": "asistencia",
    "descripcion": "Asistió"
  },
  {
    "id": 2,
    "fecha": "2025-10-07",
    "tipo": "retardo",
    "descripcion": "Llegó 10 min tarde"
  },
  {
    "id": 3,
    "fecha": "2025-10-03",
    "tipo": "falta",
    "descripcion": "No asistió"
  }
]
```

---

## 🚀 Cómo Conectar con tu Backend

### Paso 1: Actualizar la URL del API

En `app/(tabs)/(inicio)/asistencias.tsx`, busca esta línea (aprox. línea 46):

```typescript
const response = await fetch(
  "https://tu-api.com/asistencias/programacion", // ⬅️ CAMBIAR ESTA URL
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

**Reemplazar con tu URL real:**

```typescript
const response = await fetch(
  "https://api.cetis27.edu.mx/asistencias/programacion", // Tu URL real
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

### Paso 2: Agregar Autenticación (si es necesario)

Si tu API requiere un token de autenticación:

```typescript
const response = await fetch(
  "https://api.cetis27.edu.mx/asistencias/programacion",
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ⬅️ Agregar token
    },
  }
);
```

Para obtener el token desde el contexto de autenticación:

```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function AsistenciasScreen() {
  const { token } = useAuth(); // Obtener token del contexto

  // ... resto del código

  const fetchAsistenciasDetalladas = async () => {
    // ... código de fetch con token
  };
}
```

### Paso 3: Filtrar por Materia (opcional)

Si quieres filtrar asistencias por la materia seleccionada:

```typescript
const fetchAsistenciasDetalladas = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const url = selectPicker
      ? `https://api.cetis27.edu.mx/asistencias/${selectPicker}`
      : `https://api.cetis27.edu.mx/asistencias/programacion`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ... resto del código
  }
}
```

### Paso 4: Eliminar Datos de Ejemplo (Producción)

Cuando tu backend esté funcionando, **elimina** esta sección del catch:

```typescript
} catch (err) {
  console.error("Error fetching asistencias:", err);
  setError(err instanceof Error ? err.message : "Error desconocido al cargar datos");

  // ❌ ELIMINAR TODO ESTE BLOQUE EN PRODUCCIÓN
  setAsistenciasDetalladas([
    { id: 1, fecha: "2025-10-08", tipo: "asistencia", descripcion: "Asistió" },
    // ... más datos de ejemplo
  ]);
}
```

Dejar solo:

```typescript
} catch (err) {
  console.error("Error fetching asistencias:", err);
  setError(err instanceof Error ? err.message : "Error al cargar asistencias");
}
```

---

## 🧪 Configuración Avanzada

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=https://api.cetis27.edu.mx
```

Luego usar en el código:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const response = await fetch(`${API_URL}/asistencias/programacion`, {
  // ... configuración
});
```

### Crear un Servicio API (Recomendado)

Crear archivo `services/asistenciasService.ts`:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.cetis27.edu.mx";

export interface AsistenciaDetallada {
  id?: number;
  fecha: string;
  tipo: "asistencia" | "retardo" | "falta";
  descripcion: string;
}

export const asistenciasService = {
  async getAsistenciasDetalladas(
    materia?: string,
    token?: string
  ): Promise<AsistenciaDetallada[]> {
    const url = materia
      ? `${API_URL}/asistencias/${materia}`
      : `${API_URL}/asistencias/programacion`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  },
};
```

Usar en el componente:

```typescript
import { asistenciasService } from "@/services/asistenciasService";

const fetchAsistenciasDetalladas = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await asistenciasService.getAsistenciasDetalladas(
      selectPicker,
      token
    );
    setAsistenciasDetalladas(data);
  } catch (err) {
    console.error("Error fetching asistencias:", err);
    setError(err instanceof Error ? err.message : "Error al cargar datos");
  } finally {
    setIsLoading(false);
  }
};
```

---

## 📋 Checklist de Integración

- [ ] Obtener la URL del endpoint del backend
- [ ] Verificar si requiere autenticación (token)
- [ ] Probar el endpoint con Postman/Thunder Client
- [ ] Verificar el formato de respuesta JSON
- [ ] Actualizar la URL en `fetchAsistenciasDetalladas()`
- [ ] Agregar autenticación si es necesario
- [ ] Probar la carga de datos en la app
- [ ] Verificar que muestre loading correctamente
- [ ] Verificar que maneje errores correctamente
- [ ] Eliminar datos de ejemplo del catch
- [ ] Crear variables de entorno (opcional)
- [ ] Crear servicio API separado (recomendado)

---

## 🐛 Troubleshooting

### Error: Network request failed

- Verificar que el dispositivo/emulador tenga conexión a internet
- Verificar que la URL sea accesible desde el dispositivo
- Si usas `localhost`, cambiar a la IP local de tu máquina

### Error: Unauthorized (401)

- Verificar que el token sea válido
- Verificar que el header Authorization esté correcto

### Error: CORS

- Configurar CORS en el backend para permitir peticiones desde la app
- En desarrollo local, agregar la IP del dispositivo a las URLs permitidas

### Datos no se muestran

- Verificar la estructura de la respuesta JSON en la consola
- Asegurarse que el formato coincida con `AsistenciaDetallada`
- Revisar que el campo `tipo` sea exactamente: "asistencia", "retardo" o "falta"

---

## 📞 Contacto

Si tienes dudas sobre la integración, consulta con el equipo de backend sobre:

1. URL exacta del endpoint
2. Método de autenticación requerido
3. Formato exacto de la respuesta
4. Parámetros adicionales necesarios
