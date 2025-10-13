# 🎯 Guía Rápida: Conectar con el Backend

## ✅ Paso 1: Configurar la URL del API

Crea un archivo `.env` en la raíz del proyecto:

```env
EXPO_PUBLIC_API_URL=https://tu-backend.com
```

## ✅ Paso 2: Usar el Servicio (Recomendado)

El servicio ya está creado en `services/asistenciasService.ts`. Solo necesitas usarlo:

### Ejemplo básico:

```typescript
import { asistenciasService } from "@/services/asistenciasService";

const fetchAsistenciasDetalladas = async () => {
  setIsLoading(true);
  setError(null);

  try {
    const data = await asistenciasService.getAsistenciasDetalladas();
    setAsistenciasDetalladas(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error al cargar datos");
  } finally {
    setIsLoading(false);
  }
};
```

### Ejemplo con autenticación:

```typescript
import { asistenciasService } from "@/services/asistenciasService";
import { useAuth } from "@/contexts/AuthContext";

export default function AsistenciasScreen() {
  const { token } = useAuth();

  const fetchAsistenciasDetalladas = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await asistenciasService.getAsistenciasDetalladas(
        selectPicker, // materia seleccionada
        token // token de autenticación
      );
      setAsistenciasDetalladas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };
}
```

## ✅ Paso 3: Reemplazar el Fetch Manual (Opcional)

Si prefieres usar el servicio en lugar del fetch manual en `asistencias.tsx`:

### Antes (Fetch manual):

```typescript
const response = await fetch("https://tu-api.com/asistencias/programacion", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
});
const data = await response.json();
```

### Después (Servicio):

```typescript
import { asistenciasService } from "@/services/asistenciasService";

const data = await asistenciasService.getAsistenciasDetalladas();
```

## 📝 Formato Esperado del Backend

### Endpoint: GET `/asistencias/programacion`

**Respuesta esperada:**

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

### Campos requeridos:

- `fecha` (string): Fecha en formato ISO o cualquier formato de string
- `tipo` (string): Debe ser exactamente: `"asistencia"`, `"retardo"` o `"falta"`
- `descripcion` (string): Texto descriptivo
- `id` (number, opcional): Identificador único

## 🧪 Modo de Desarrollo

Mientras no tengas el backend listo, el código actual usa **datos de ejemplo** automáticamente cuando hay un error en el fetch. Esto te permite seguir desarrollando la interfaz.

Para probar sin backend:

1. La app mostrará datos de ejemplo si el fetch falla
2. Verás un mensaje de error pero los datos se mostrarán igual
3. Una vez que el backend esté listo, los datos reales reemplazarán los ejemplos

## 🚀 Cuando el Backend esté Listo

1. **Actualiza la URL** en `.env`:

   ```env
   EXPO_PUBLIC_API_URL=https://api-real.cetis27.edu.mx
   ```

2. **Elimina los datos de ejemplo** del catch en `asistencias.tsx`:

   ```typescript
   } catch (err) {
     console.error("Error fetching asistencias:", err);
     setError(err instanceof Error ? err.message : "Error al cargar datos");
     // ❌ Eliminar setAsistenciasDetalladas([...]) del catch
   }
   ```

3. **Prueba** que todo funcione correctamente

## 📦 Características Actuales

✅ **Loading state**: Muestra spinner mientras carga  
✅ **Error handling**: Muestra mensaje de error con botón de reintentar  
✅ **Empty state**: Muestra mensaje cuando no hay datos  
✅ **Datos de ejemplo**: Para desarrollo sin backend  
✅ **TypeScript**: Tipos definidos para seguridad  
✅ **Servicio API**: Código organizado y reutilizable

## 🎨 Estados Visuales

| Estado      | Descripción       | Visual                                 |
| ----------- | ----------------- | -------------------------------------- |
| **Loading** | Cargando datos    | Spinner + "Cargando asistencias..."    |
| **Error**   | Falló la petición | ⚠️ + mensaje + botón "Reintentar"      |
| **Empty**   | Sin datos         | 📅 + "No hay registros de asistencias" |
| **Success** | Con datos         | Lista de asistencias con íconos        |

## 🔍 Debugging

Para ver qué está pasando, revisa la consola:

- Errores de red: `Error fetching asistencias:`
- Respuesta del servidor: Se muestra en catch
- Estado actual: Puedes agregar `console.log(data)` después del fetch

---

¿Necesitas ayuda? Consulta el archivo `API_SETUP.md` para información más detallada.
