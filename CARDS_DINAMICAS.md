# 📊 Sistema de Cards Dinámicas - Asistencias

## 🎯 Funcionalidad Implementada

El sistema ahora genera **automáticamente** las cards de materias según los datos del backend. Cada alumno verá solo sus materias con sus estadísticas reales.

---

## 🔄 Cómo Funciona

### 1. **Carga Inicial**

Al abrir la pantalla de asistencias:

- Se ejecuta `fetchEstadisticasMaterias()`
- Obtiene todas las materias del alumno con sus totales
- Genera una card por cada materia

### 2. **Cards Dinámicas**

Cada card muestra:

- **Nombre de la materia** (del backend)
- **Total de Asistencias** (número real del backend)
- **Total de Retardos** (número real del backend)
- **Total de Faltas** (número real del backend)
- **Botón "detalles"** para ver el detalle por fecha

### 3. **Modal de Detalles**

Al presionar "detalles":

- Abre modal con el nombre de la materia
- Carga las asistencias detalladas de ESA materia específica
- Muestra lista con fecha, tipo e ícono para cada registro

---

## 📡 Endpoints del Backend

### Endpoint 1: Estadísticas de Materias

```
GET /estadisticas/materias
```

**Respuesta esperada:**

```json
[
  {
    "materiaId": "programacion",
    "materiaNombre": "Programación",
    "totalAsistencias": 15,
    "totalRetardos": 3,
    "totalFaltas": 2
  },
  {
    "materiaId": "matematicas",
    "materiaNombre": "Matemáticas",
    "totalAsistencias": 18,
    "totalRetardos": 1,
    "totalFaltas": 1
  }
]
```

**Campos requeridos:**

- `materiaId` (string): Identificador único de la materia
- `materiaNombre` (string): Nombre a mostrar en la card
- `totalAsistencias` (number): Contador de asistencias
- `totalRetardos` (number): Contador de retardos
- `totalFaltas` (number): Contador de faltas

### Endpoint 2: Asistencias Detalladas por Materia

```
GET /asistencias/{materiaId}
```

**Ejemplo:**

```
GET /asistencias/programacion
```

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
  }
]
```

---

## 🛠️ Configuración del Backend

### Paso 1: Actualizar URLs en el código

En `app/(tabs)/(inicio)/asistencias.tsx`, busca estas líneas:

**Línea ~58 - Estadísticas de Materias:**

```typescript
const response = await fetch(
  "https://tu-api.com/estadisticas/materias", // ⬅️ CAMBIAR
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

**Línea ~117 - Asistencias Detalladas:**

```typescript
const response = await fetch(
  `https://tu-api.com/asistencias/${materiaId}`, // ⬅️ CAMBIAR
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
);
```

### Paso 2: Usar el Servicio API (Recomendado)

Mejor opción: usar `asistenciasService.ts`

```typescript
import { asistenciasService } from "@/services/asistenciasService";

// En fetchEstadisticasMaterias:
const data = await asistenciasService.getEstadisticasMaterias(token);

// En fetchAsistenciasDetalladas:
const data = await asistenciasService.getAsistenciasDetalladas(
  materiaId,
  token
);
```

---

## 🎨 Estados Visuales

### Para las Cards:

| Estado      | Visual                             | Cuándo                          |
| ----------- | ---------------------------------- | ------------------------------- |
| **Loading** | Spinner + "Cargando materias..."   | Mientras se cargan las materias |
| **Empty**   | 🏫 + "No hay materias registradas" | Sin materias en el backend      |
| **Success** | Cards con datos reales             | Con materias cargadas           |

### Para el Modal:

| Estado      | Visual                              | Cuándo                           |
| ----------- | ----------------------------------- | -------------------------------- |
| **Loading** | Spinner + "Cargando asistencias..." | Mientras se cargan detalles      |
| **Error**   | ⚠️ + mensaje + botón "Reintentar"   | Falla la petición                |
| **Empty**   | 📅 + "No hay registros"             | Sin asistencias para esa materia |
| **Success** | Lista detallada con íconos          | Con datos cargados               |

---

## 🔍 Ejemplo Visual

```
┌─────────────────────────────────────┐
│ Asistencias                         │
├─────────────────────────────────────┤
│ [Picker: Selecciona una materia]   │
│ [Dia] [Mes] [Año]                  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 📖 Programación      [detalles>]│ │
│ │ ───────────────────────────────  │ │
│ │  ✓        ⏰        ✗          │ │
│ │  15       3         2          │ │
│ │ Asist   Retard    Faltas       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📖 Matemáticas       [detalles>]│ │
│ │ ───────────────────────────────  │ │
│ │  ✓        ⏰        ✗          │ │
│ │  18       1         1          │ │
│ │ Asist   Retard    Faltas       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📖 Inglés            [detalles>]│ │
│ │ ───────────────────────────────  │ │
│ │  ✓        ⏰        ✗          │ │
│ │  16       2         2          │ │
│ │ Asist   Retard    Faltas       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 💡 Datos de Ejemplo

Mientras el backend no esté listo, el código usa datos de ejemplo:

```typescript
// 4 materias de ejemplo con totales
[
  { programacion: 15 asist, 3 retard, 2 faltas },
  { matematicas: 18 asist, 1 retard, 1 falta },
  { ingles: 16 asist, 2 retard, 2 faltas },
  { fisica: 14 asist, 4 retard, 2 faltas }
]
```

---

## ✅ Checklist de Integración

### Backend:

- [ ] Endpoint `/estadisticas/materias` implementado
- [ ] Endpoint `/asistencias/{materiaId}` implementado
- [ ] Respuestas con formato JSON correcto
- [ ] CORS configurado para la app
- [ ] Autenticación implementada (si aplica)

### Frontend:

- [ ] URLs actualizadas en `asistencias.tsx`
- [ ] Token agregado a headers (si aplica)
- [ ] Probado con backend real
- [ ] Eliminados datos de ejemplo del catch
- [ ] Verificado que cards se generen dinámicamente
- [ ] Verificado que modal muestre nombre correcto
- [ ] Probado botón "Reintentar" en errores

---

## 🔧 Ventajas del Sistema Dinámico

✅ **Escalable**: Funciona con 1 materia o 20 materias  
✅ **Flexible**: El backend controla qué materias se muestran  
✅ **Actualizable**: Cambios de nombres/datos se reflejan automáticamente  
✅ **Personalizado**: Cada alumno ve solo sus materias  
✅ **Mantenible**: Un solo template genera todas las cards

---

## 🚀 Mejoras Futuras Posibles

1. **Filtros**: Filtrar materias por semestre/área
2. **Búsqueda**: Buscar una materia específica
3. **Ordenamiento**: Ordenar por nombre, asistencias, etc.
4. **Gráficas**: Visualización de estadísticas
5. **Exportar**: Exportar reporte en PDF
6. **Notificaciones**: Alertas por bajo porcentaje de asistencia

---

¿Necesitas más información? Consulta:

- `BACKEND_QUICKSTART.md` - Guía rápida de conexión
- `API_SETUP.md` - Documentación completa del API
- `services/asistenciasService.ts` - Servicio de API
