# 🔌 Conexión con el Backend

## 📋 Resumen

Tu app **YA ESTÁ LISTA** para conectarse al backend. Solo necesitas **descomentar** el código de producción y **actualizar la URL** del API.

---

## ✅ ¿Cómo funcionará con el backend?

### **1. Datos Dinámicos Automáticos**

Cuando el backend esté conectado:

```typescript
// Backend envía:
[
  { id: 1, titulo: "Reporte A", gravedad: "ALTA", ... },
  { id: 2, titulo: "Reporte B", gravedad: "BAJA", ... }
]

// React automáticamente renderiza:
// - 2 tarjetas con esos datos
```

**✨ La app se actualiza automáticamente** porque:

- Los hooks usan `useState` para almacenar datos
- Cuando llega la respuesta del backend, se ejecuta `setReportes(data)`
- React detecta el cambio de estado y **re-renderiza** los componentes

---

### **2. Casos según respuesta del backend**

#### **📊 Caso 1: Backend devuelve datos**

```json
[
  { "id": 1, "titulo": "Reporte", "gravedad": "ALTA", ... }
]
```

**Resultado:** Muestra las tarjetas con los datos reales

---

#### **📭 Caso 2: Backend devuelve array vacío**

```json
[]
```

**Resultado:** Muestra el mensaje:

```
"No hay incidencias registradas"
```

**Código en `reportes.tsx` (línea 67):**

```tsx
reportes.length === 0 ? (
  <View style={styles.centerBox}>
    <Text style={styles.noDataText}>
      No hay incidencias registradas
    </Text>
  </View>
)
```

---

#### **⚠️ Caso 3: Error de conexión**

```
Error 500, timeout, etc.
```

**Resultado:** Muestra:

```
[Error message]
[Botón "Reintentar"]
```

**Código en `reportes.tsx` (línea 58):**

```tsx
error ? (
  <View style={styles.errorBox}>
    <Text style={styles.errorText}>{error}</Text>
    <TouchableOpacity onPress={fetchReportes}>
      <Text>Reintentar</Text>
    </TouchableOpacity>
  </View>
)
```

---

#### **⏳ Caso 4: Cargando datos**

**Resultado:** Muestra:

```
[Spinner animado]
"Cargando incidencias..."
```

**Código en `reportes.tsx` (línea 52):**

```tsx
isLoading ? (
  <View style={styles.centerBox}>
    <ActivityIndicator size="large" color="#3498db" />
    <Text>Cargando incidencias...</Text>
  </View>
)
```

---

## 🔧 Pasos para Conectar al Backend

### **Hook: `useReportes.ts`**

#### **1. Encuentra el bloque comentado (línea ~127):**

```typescript
/* 🚀 MODO PRODUCCIÓN: Descomentar cuando tengas backend
try {
  const response = await fetch("https://tu-api.com/estudiante/reportes", {
    ...
  });
  ...
}
*/
```

#### **2. Comenta el bloque de desarrollo (línea ~49):**

```typescript
// 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
/*  ← Agrega esto
try {
  const datosEjemplo: ReporteDetallado[] = [ ... ];
  ...
}
*/  ← Agrega esto
```

#### **3. Descomenta el bloque de producción:**

```typescript
// Quita /* y */
try {
  const response = await fetch("https://TU-API-REAL.com/estudiante/reportes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ← Usa el token del AuthContext
    },
  });

  if (!response.ok) {
    throw new Error("Error al cargar reportes");
  }

  const data: ReporteDetallado[] = await response.json();
  setReportes(data); // ← Actualiza el estado automáticamente
  setIsLoading(false);
} catch (err) {
  setError("Error al cargar reportes");
  setIsLoading(false);
}
```

#### **4. Actualiza la URL:**

```typescript
// Reemplaza:
"https://tu-api.com/estudiante/reportes";

// Con tu URL real:
"https://api.cetis27.edu.mx/api/estudiante/reportes";
```

---

### **Hook: `useAsistencias.ts`**

Mismo proceso para:

- `fetchGruposParaPicker()` (línea ~45)
- `fetchEstadisticasGrupos()` (línea ~90)
- `fetchAsistenciasDetalladas()` (línea ~200)

---

## 🎯 Formato de Datos Esperado del Backend

### **Endpoint: `/estudiante/reportes`**

**Respuesta esperada:**

```json
[
  {
    "id": 1,
    "idEstudiante": 123,
    "idGrupo": 5,
    "idDocente": 10,
    "tipo": "conducta",
    "titulo": "Falta de respeto",
    "descripcion": "Texto descriptivo...",
    "fechaReporte": "2024-03-15",
    "gravedad": "ALTA",
    "estatus": "Pendiente",
    "accionesTomadas": null,
    "fechaRegistro": "2024-03-15T10:30:00Z",
    "fechaRevision": null,
    "nombreEstudiante": "Juan Pérez",
    "nombreDocente": "Prof. López",
    "nombreMateria": "Programación",
    "codigoGrupo": "A"
  }
]
```

**Si no hay reportes:**

```json
[]
```

---

### **Endpoint: `/estudiante/grupos`**

**Respuesta esperada:**

```json
[
  {
    "label": "Programación - Grupo A",
    "value": "1"
  },
  {
    "label": "Matemáticas - Grupo B",
    "value": "2"
  }
]
```

---

### **Endpoint: `/estudiante/asistencias/estadisticas`**

**Respuesta esperada:**

```json
[
  {
    "idGrupo": 1,
    "idMateria": 1,
    "nombreMateria": "Programación",
    "codigoMateria": "PROG-301",
    "codigoGrupo": "A",
    "semestre": 3,
    "aula": "Lab 1",
    "nombreDocente": "Prof. García",
    "totalClases": 25,
    "totalAsistencias": 20,
    "totalRetardos": 3,
    "totalFaltas": 2,
    "porcentajeAsistencia": 92
  }
]
```

---

## 🔐 Autenticación con Token

### **Obtener el token:**

```typescript
import { useAuth } from "@/contexts/AuthContext";

const { token } = useAuth();
```

### **Usar el token en fetch:**

```typescript
const response = await fetch("https://api.com/endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 📝 Validación de Datos

### **Valores permitidos (según DB):**

#### **`gravedad` (GravedadReporte):**

- ✅ `"ALTA"` (mayúsculas)
- ✅ `"MEDIA"`
- ✅ `"BAJA"`

#### **`estatus` (EstatusReporte):**

- ✅ `"Pendiente"` (primera mayúscula)
- ✅ `"revisado"` (minúsculas)
- ✅ `"resuelto"` (minúsculas)

#### **`tipo` (TipoReporte):**

- ✅ `"falta_tarea"` (snake_case)
- ✅ `"conducta"`
- ✅ `"otra"`

#### **`tipoAsistencia` (TipoAsistencia):**

- ✅ `"Asistencia"` (primera mayúscula)
- ✅ `"Retardo"`
- ✅ `"Falta"`

---

## ✅ Checklist de Conexión

Antes de conectar al backend, verifica:

- [ ] Backend devuelve JSON válido
- [ ] Campos coinciden con interfaces de `types/database.ts`
- [ ] Token JWT funciona correctamente
- [ ] Endpoints usan HTTPS (no HTTP)
- [ ] CORS configurado en el backend
- [ ] Manejo de errores 401, 403, 500, etc.

---

## 🎉 Resultado Final

### **Con datos:**

```
┌─────────────────────────────┐
│ [⚠️] Reporte 1  │ ALTA    │ │
├─────────────────────────────┤
│ Tipo: conducta              │
│ Fecha: 15 de marzo de 2024  │
└─────────────────────────────┘

┌─────────────────────────────┐
│ [⚠️] Reporte 2  │ BAJA    │ │
└─────────────────────────────┘
```

### **Sin datos:**

```
┌─────────────────────────────┐
│                             │
│  No hay incidencias         │
│  registradas                │
│                             │
└─────────────────────────────┘
```

### **Error:**

```
┌─────────────────────────────┐
│  Error al cargar reportes   │
│                             │
│  [ Reintentar ]             │
└─────────────────────────────┘
```

---

## 📚 Documentos Relacionados

- `types/database.ts` - Interfaces de todas las tablas
- `contexts/AuthContext.tsx` - Manejo del token JWT
- `hooks/useReportes.ts` - Lógica de reportes
- `hooks/useAsistencias.ts` - Lógica de asistencias
- `hooks/useEstudiante.ts` - Lógica del perfil

---

**🚀 Tu app está lista para producción. Solo falta conectar el backend!**
