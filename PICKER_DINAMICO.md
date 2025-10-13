# 📝 Configuración del Picker Dinámico

## ✅ Lo Implementado

El Picker de materias ahora está preparado para recibir datos del backend de forma dinámica.

---

## 🎯 Cómo Funciona Ahora

### **Modo Desarrollo (Actual)**

- Al cargar la pantalla, se ejecuta `fetchMateriasParaPicker()`
- Intenta conectarse a `https://tu-api.com/materias`
- Como no existe, cae en el `catch` y carga **6 materias de ejemplo**:
  - Programación
  - Matemáticas
  - Inglés
  - Física
  - Química
  - Historia

### **Datos que Muestra**

El picker muestra estas opciones hardcodeadas mientras no tengas backend.

---

## 📡 Endpoint del Backend

### **GET /materias**

**Descripción:** Obtiene la lista de materias disponibles para el alumno.

**Respuesta esperada:**

```json
[
  {
    "label": "Programación",
    "value": "programacion"
  },
  {
    "label": "Matemáticas",
    "value": "matematicas"
  },
  {
    "label": "Inglés",
    "value": "ingles"
  }
]
```

**Campos:**

- `label` (string): Nombre a mostrar en el picker
- `value` (string): ID de la materia para usar en otras peticiones

---

## 🔧 Para Conectar con Backend Real

### **Paso 1: Actualizar URL en `asistencias.tsx`**

**Línea ~73:**

```typescript
const response = await fetch("https://tu-api.com/materias", {
```

Cambiar a:

```typescript
const response = await fetch("https://TU-API-REAL.com/materias", {
```

### **Paso 2: Eliminar Datos de Ejemplo**

**Líneas 87-95:** Eliminar este bloque del `catch`:

```typescript
// 🔧 MODO DESARROLLO: Datos de ejemplo (eliminar en producción)
setMateriasParaPicker([
  { label: "Programación", value: "programacion" },
  { label: "Matemáticas", value: "matematicas" },
  { label: "Inglés", value: "ingles" },
  { label: "Física", value: "fisica" },
  { label: "Química", value: "quimica" },
  { label: "Historia", value: "historia" },
]);
```

Dejar solo:

```typescript
} catch (err) {
  console.error("Error fetching materias picker:", err);
  // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
}
```

---

## 📋 Resumen de Líneas a Modificar

### **En `app/(tabs)/(inicio)/asistencias.tsx`:**

| Acción           | Líneas | Descripción                                  |
| ---------------- | ------ | -------------------------------------------- |
| **Cambiar URL**  | ~73    | `"https://TU-API-REAL.com/materias"`         |
| **Eliminar**     | 87-95  | Datos de ejemplo en catch                    |
| **Agregar Auth** | ~75    | `Authorization: Bearer ${token}` (si aplica) |

---

## 🎨 Integración con el Resto

El picker está **sincronizado** con las cards:

1. **Picker carga materias** → Para seleccionar y registrar asistencia
2. **Cards muestran estadísticas** → De las mismas materias con totales
3. **Modal muestra detalles** → De la materia seleccionada

Todo usa el mismo `materiaId` para consistencia.

---

## 🔄 Flujo Completo

```
1. App inicia
   ↓
2. fetchMateriasParaPicker() → Carga opciones del picker
   ↓
3. fetchEstadisticasMaterias() → Carga cards con totales
   ↓
4. Usuario selecciona materia en picker
   ↓
5. Usuario presiona "detalles" en una card
   ↓
6. fetchAsistenciasDetalladas(materiaId) → Carga detalles
```

---

## 💡 Ventajas del Sistema Dinámico

✅ **Picker se actualiza automáticamente** con las materias del alumno  
✅ **No hay que modificar código** cuando agregan/quitan materias  
✅ **Consistencia** entre picker, cards y modal  
✅ **Personalizado** por alumno (cada uno ve sus materias)  
✅ **Backend controla** qué materias están disponibles

---

## 🚀 Usando el Servicio API (Opcional)

Si prefieres usar el servicio centralizado:

```typescript
import { asistenciasService } from "@/services/asistenciasService";

const fetchMateriasParaPicker = async () => {
  try {
    const data = await asistenciasService.getMaterias(token);
    setMateriasParaPicker(data);
  } catch (err) {
    console.error("Error fetching materias:", err);
  }
};
```

---

## 📞 Consulta con Backend

Asegúrate de que el backend proporcione:

- ✅ Endpoint `/materias`
- ✅ Formato JSON con `label` y `value`
- ✅ Filtrado por alumno (cada alumno sus materias)
- ✅ CORS configurado
- ✅ Autenticación si es necesaria

---

## 🐛 Troubleshooting

### **Problema:** Picker aparece vacío

**Solución:** Verifica que `materiasParaPicker` tenga datos en consola

### **Problema:** Error de red

**Solución:** Verifica la URL y que el backend esté corriendo

### **Problema:** Materias duplicadas

**Solución:** Backend debe devolver lista única sin duplicados

---

¿Necesitas más ayuda? Consulta:

- `BACKEND_QUICKSTART.md` - Guía rápida
- `API_SETUP.md` - Documentación completa
- `CARDS_DINAMICAS.md` - Sistema de cards dinámicas
