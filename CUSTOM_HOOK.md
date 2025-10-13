# 🎣 Custom Hook: useAsistencias

## 📦 Estructura Organizada

Todo el código relacionado con backend y simulación de datos ahora está centralizado en un **custom hook**.

---

## 📁 Archivos

### **`hooks/useAsistencias.ts`**

Contiene TODA la lógica de:

- ✅ Estados de datos (asistencias, estadísticas, materias)
- ✅ Estados de loading y errores
- ✅ Funciones para fetch de datos
- ✅ Datos de ejemplo para desarrollo
- ✅ Función helper `getIconForTipo()`

### **`app/(tabs)/(inicio)/asistencias.tsx`**

Ahora solo contiene:

- ✅ UI/Componentes visuales
- ✅ Estados locales de UI (modal, picker)
- ✅ Llamada al hook: `useAsistencias()`

---

## 🔧 Cómo Usar el Hook

### **Importación**

```typescript
import { useAsistencias } from "@/hooks/useAsistencias";
```

### **Uso en el componente**

```typescript
const {
  // Estados
  asistenciasDetalladas,
  estadisticasMaterias,
  materiasParaPicker,
  isLoading,
  isLoadingStats,
  error,

  // Funciones
  fetchMateriasParaPicker,
  fetchEstadisticasMaterias,
  fetchAsistenciasDetalladas,
  getIconForTipo,
} = useAsistencias();
```

---

## ✨ Ventajas de esta Estructura

### **1. Separación de Responsabilidades**

- **Hook**: Lógica de negocio y backend
- **Componente**: UI y presentación

### **2. Reutilización**

- Puedes usar `useAsistencias()` en otros componentes
- Ejemplo: Un widget de resumen en otra pantalla

### **3. Mantenibilidad**

- Todo el código de backend en un solo lugar
- Fácil de encontrar y modificar
- Cambios no afectan el UI

### **4. Testing**

- Puedes testear el hook independientemente
- Mock del hook para testear el componente

### **5. Limpieza**

- Componente más legible y corto
- Enfocado solo en renderizado

---

## 📊 Antes vs Después

### **Antes (asistencias.tsx):**

```typescript
// 561 líneas total
export default function AsistenciasScreen() {
  // 51-277: Toda la lógica de backend aquí
  const [asistenciasDetalladas, setAsistenciasDetalladas] = useState([]);
  const fetchMateriasParaPicker = async () => {
    /* ... */
  };
  const fetchEstadisticasMaterias = async () => {
    /* ... */
  };
  const fetchAsistenciasDetalladas = async () => {
    /* ... */
  };
  // ... resto del UI
}
```

### **Después (asistencias.tsx):**

```typescript
// Mucho más limpio y corto
export default function AsistenciasScreen() {
  // Solo un hook con toda la lógica
  const {
    asistenciasDetalladas,
    fetchAsistenciasDetalladas,
    // ...
  } = useAsistencias();

  // UI code...
}
```

### **Nuevo archivo (useAsistencias.ts):**

```typescript
// Toda la lógica centralizada
export const useAsistencias = () => {
  // Estados
  // Funciones fetch
  // Datos de ejemplo
  // Helpers

  return {
    /* todo */
  };
};
```

---

## 🔄 Para Conectar Backend

Ahora solo necesitas modificar **UN archivo**: `hooks/useAsistencias.ts`

### **Líneas a modificar en useAsistencias.ts:**

| Función                      | Línea    | Cambio                          |
| ---------------------------- | -------- | ------------------------------- |
| `fetchMateriasParaPicker`    | ~58      | URL de `/materias`              |
|                              | ~76-82   | Eliminar datos ejemplo          |
| `fetchEstadisticasMaterias`  | ~92      | URL de `/estadisticas/materias` |
|                              | ~119-138 | Eliminar datos ejemplo          |
| `fetchAsistenciasDetalladas` | ~150-175 | Eliminar modo desarrollo        |
|                              | ~177-206 | Descomentar modo producción     |

---

## 📝 Interfaces Exportadas

El hook también exporta las interfaces para usar en otros archivos:

```typescript
export interface AsistenciaDetallada {
  /* ... */
}
export interface EstadisticasMateria {
  /* ... */
}
export interface MateriaPickerOption {
  /* ... */
}
export interface IconData {
  /* ... */
}
```

---

## 🎯 Uso en Otros Componentes

### **Ejemplo: Widget de Resumen**

```typescript
// components/AsistenciasWidget.tsx
import { useAsistencias } from "@/hooks/useAsistencias";

export function AsistenciasWidget() {
  const { estadisticasMaterias, isLoadingStats } = useAsistencias();

  if (isLoadingStats) return <Loading />;

  return (
    <View>
      {estadisticasMaterias.map((materia) => (
        <Text key={materia.materiaId}>
          {materia.materiaNombre}: {materia.totalAsistencias}
        </Text>
      ))}
    </View>
  );
}
```

---

## 🚀 Extensibilidad

### **Agregar Nueva Función al Hook**

```typescript
// En useAsistencias.ts
const registrarAsistencia = async (data: any) => {
  // Lógica aquí
};

return {
  // ... estados y funciones existentes
  registrarAsistencia, // Nueva función
};
```

### **Usar en el Componente**

```typescript
const { registrarAsistencia } = useAsistencias();

const handleSubmit = () => {
  registrarAsistencia(formData);
};
```

---

## 📚 Documentación Relacionada

- `BACKEND_QUICKSTART.md` - Cómo conectar con backend
- `API_SETUP.md` - Documentación completa del API
- `CARDS_DINAMICAS.md` - Sistema de cards dinámicas
- `PICKER_DINAMICO.md` - Picker dinámico

---

## ✅ Checklist de Migración Completada

- [x] Creado `hooks/useAsistencias.ts`
- [x] Interfaces movidas al hook
- [x] Estados movidos al hook
- [x] Funciones fetch movidas al hook
- [x] Helper `getIconForTipo` movido al hook
- [x] Datos de ejemplo en el hook
- [x] Componente actualizado para usar el hook
- [x] Imports actualizados
- [x] Todo funciona correctamente

---

## 🎉 Resultado

**Código más limpio, organizado y mantenible** ✨

- Componente: **~300 líneas** (antes ~561)
- Hook: **~300 líneas** (toda la lógica)
- **Total: Mismo código, mejor organizado**
