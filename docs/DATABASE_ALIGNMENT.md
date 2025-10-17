# 🗄️ Análisis de Alineamiento con Base de Datos

## 📊 Esquema Real de la Base de Datos

### **Tablas Principales:**

#### **1. usuarios**

```sql
- nombre
- apellidoPaterno
- apellidoMaterno
- email
- telefono
- fechaNacimiento
- direccion
- tipoUsuario (estudiante, admon, docente)
- activo
- fechaRegistro
```

#### **2. estudiantes**

```sql
- idUsuario (FK → usuarios)
- idEspecialidad (FK → especialidades)
- numeroControl
- semestreActual
- codigoQr
- fechaIngreso
```

#### **3. especialidades**

```sql
- nombre
- codigo
- activo
```

#### **4. materias**

```sql
- idEspecialidad (FK → especialidades)
- nombre
- codigo
- semestre
- horas
- activo
```

#### **5. grupos**

```sql
- idMateria (FK → materias)
- idDocente (FK → docentes)
- idPeriodo (FK → periodos)
- idEspecialidad (FK → especialidades)
- codigo
- semestre
- aula
- activo
```

#### **6. inscripciones**

```sql
- idEstudiante (FK → estudiantes)
- idGrupo (FK → grupos)
- fechaInscripcion
```

#### **7. asistencias**

```sql
- idInscripcion (FK → inscripciones)
- idDocente (FK → docentes)
- fecha
- horaRegistro
- tipoAsistencia (Asistencia, Retardo, Falta)
- fechaRegistroAsistencia
```

#### **8. reportes**

```sql
- idEstudiante (FK → estudiantes)
- idGrupo (FK → grupos)
- idDocente (FK → docentes)
- tipo (falta_tarea, conducta, otra)
- titulo
- descripcion
- fechaReporte
- gravedad
- estatus (Pendiente, revisado, resuelto)
- accionesTomadas
- fechaRegistro
- fechaRevision
```

#### **9. tutores**

```sql
- idEstudiante (FK → estudiantes)
- nombre
- apellidoPaterno
- apellidoMaterno
- telefono
- email
- parentesco
- activo
```

#### **10. docentes**

```sql
- idUsuario (FK → usuarios)
- idEspecialidad (FK → especialidades)
- numeroEmpleado
```

#### **11. periodos**

```sql
- codigo
- semestre
- fechaInicio
- fechaFin
- activo
```

---

## ❌ Problemas Encontrados en el Código Actual

### **1. useEstudiante.ts** ✅ **CORRECTO**

- ✅ Interface `Usuario` coincide perfectamente
- ✅ Interface `Especialidad` coincide
- ✅ Interface `Estudiante` coincide
- ✅ Datos mostrados en perfil son correctos

---

### **2. useAsistencias.ts** ⚠️ **PROBLEMAS CRÍTICOS**

#### **Interface `AsistenciaDetallada` - INCORRECTA**

```typescript
// ❌ ACTUAL (INCORRECTO)
export interface AsistenciaDetallada {
  id?: number;
  fecha: string;
  hora?: string; // ← No existe en BD
  tipo: "asistencia" | "retardo" | "falta";
  descripcion: string; // ← No existe en BD
}

// ✅ DEBERÍA SER (según BD)
export interface Asistencia {
  id: number;
  idInscripcion: number; // FK → inscripciones
  idDocente: number; // FK → docentes
  fecha: string;
  horaRegistro: string; // ← Era "hora"
  tipoAsistencia: "Asistencia" | "Retardo" | "Falta"; // ← Capitalizado
  fechaRegistroAsistencia: string; // ← Falta este campo
  // Relaciones opcionales (JOINs)
  inscripcion?: Inscripcion;
  docente?: Docente;
}
```

#### **Interface `EstadisticasMateria` - FALTA CONTEXTO**

```typescript
// ❌ ACTUAL (incompleto)
export interface EstadisticasMateria {
  materiaId: string; // ← Debería ser idGrupo o idMateria (number)
  materiaNombre: string;
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
}

// ✅ DEBERÍA SER
export interface EstadisticasGrupo {
  idGrupo: number; // ← Porque las asistencias son por GRUPO, no materia directa
  idMateria: number;
  nombreMateria: string;
  codigoGrupo: string;
  semestre: number;
  aula: string;
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
  porcentajeAsistencia: number; // Calculado
}
```

#### **FALTA Interface `Inscripcion`**

```typescript
// ✅ AGREGAR (crucial para entender la relación)
export interface Inscripcion {
  id: number;
  idEstudiante: number; // FK → estudiantes
  idGrupo: number; // FK → grupos
  fechaInscripcion: string;
  // Relaciones opcionales
  estudiante?: Estudiante;
  grupo?: Grupo;
}
```

#### **FALTA Interface `Grupo`**

```typescript
// ✅ AGREGAR
export interface Grupo {
  id: number;
  idMateria: number; // FK → materias
  idDocente: number; // FK → docentes
  idPeriodo: number; // FK → periodos
  idEspecialidad: number; // FK → especialidades
  codigo: string;
  semestre: number;
  aula: string;
  activo: boolean;
  // Relaciones opcionales
  materia?: Materia;
  docente?: Docente;
  periodo?: Periodo;
  especialidad?: Especialidad;
}
```

#### **FALTA Interface `Materia`**

```typescript
// ✅ AGREGAR
export interface Materia {
  id: number;
  idEspecialidad: number; // FK → especialidades
  nombre: string;
  codigo: string;
  semestre: number;
  horas: number;
  activo: boolean;
  // Relaciones opcionales
  especialidad?: Especialidad;
}
```

---

### **3. useReportes.ts** ⚠️ **PROBLEMAS CRÍTICOS**

#### **Interface `Incidencia` - INCORRECTA**

```typescript
// ❌ ACTUAL (INCORRECTO)
export interface Incidencia {
  id: string | number;
  severity: "ALTA" | "MEDIA" | "BAJA"; // ← Campo "gravedad" en BD
  estatus: "PENDIENTE" | "REVISADO" | "RESUELTO"; // ✅ Correcto (capitalizado)
  tipo: string; // ← Debería ser enum específico
  fecha: string; // ← Hay "fechaReporte", "fechaRegistro", "fechaRevision"
  reportadoPor: string; // ← Debería ser idDocente (number)
  descripcion: string; // ✅ Correcto
}

// ✅ DEBERÍA SER (según BD)
export interface Reporte {
  id: number;
  idEstudiante: number; // FK → estudiantes
  idGrupo: number; // FK → grupos
  idDocente: number; // FK → docentes
  tipo: "falta_tarea" | "conducta" | "otra";
  titulo: string; // ← Falta en interface actual
  descripcion: string;
  fechaReporte: string;
  gravedad: "ALTA" | "MEDIA" | "BAJA" | string; // ← Era "severity"
  estatus: "Pendiente" | "revisado" | "resuelto"; // ← Mixto (capitalizado)
  accionesTomadas: string | null; // ← Falta en interface actual
  fechaRegistro: string; // ← Falta en interface actual
  fechaRevision: string | null; // ← Falta en interface actual
  // Relaciones opcionales
  estudiante?: Estudiante;
  grupo?: Grupo;
  docente?: Docente;
}
```

---

## ✅ Plan de Corrección

### **Paso 1: Crear interfaces base completas**

- ✅ `Usuario` (ya existe, correcto)
- ✅ `Especialidad` (ya existe, correcto)
- ✅ `Estudiante` (ya existe, correcto)
- ➕ `Materia` (NUEVA)
- ➕ `Grupo` (NUEVA)
- ➕ `Inscripcion` (NUEVA)
- ➕ `Docente` (NUEVA - si se va a mostrar)
- ➕ `Periodo` (NUEVA - si se va a mostrar)

### **Paso 2: Actualizar `useAsistencias.ts`**

- Renombrar `AsistenciaDetallada` → `Asistencia`
- Corregir campos: `hora` → `horaRegistro`, agregar `fechaRegistroAsistencia`
- Cambiar `tipo` → `tipoAsistencia` con enum capitalizado
- Agregar FKs: `idInscripcion`, `idDocente`
- Renombrar `EstadisticasMateria` → `EstadisticasGrupo`
- Cambiar `materiaId` (string) → `idGrupo` (number)

### **Paso 3: Actualizar `useReportes.ts`**

- Renombrar `Incidencia` → `Reporte`
- Cambiar `severity` → `gravedad`
- Agregar `titulo`, `accionesTomadas`, `fechaRegistro`, `fechaRevision`
- Cambiar `tipo` de string → enum `"falta_tarea" | "conducta" | "otra"`
- Separar fechas: `fechaReporte`, `fechaRegistro`, `fechaRevision`
- Cambiar `reportadoPor` (string) → `idDocente` (number) + relación opcional

### **Paso 4: Actualizar datos mock**

- Ajustar mock data para reflejar nueva estructura
- Incluir relaciones JOIN simuladas

---

## 🎯 Resumen de Cambios Necesarios

| Hook                  | Interfaces Afectadas                         | Cambios Críticos                                                       |
| --------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| **useEstudiante.ts**  | ✅ Ninguna                                   | Ya está correcto                                                       |
| **useAsistencias.ts** | `AsistenciaDetallada`, `EstadisticasMateria` | Renombrar campos, agregar FKs, crear `Inscripcion`, `Grupo`, `Materia` |
| **useReportes.ts**    | `Incidencia`                                 | Renombrar a `Reporte`, agregar campos faltantes, corregir tipos        |

---

## 📝 Notas Importantes

1. **Relaciones complejas**: Las asistencias no son directas a materias, sino a través de:

   - `Estudiante` → `Inscripcion` → `Grupo` → `Materia`
   - La asistencia se registra con `idInscripcion`

2. **Reportes**: Están vinculados a:

   - `idEstudiante` (quien recibe el reporte)
   - `idGrupo` (en qué clase/grupo ocurrió)
   - `idDocente` (quien lo reporta)

3. **Capitalización**: La BD usa mixto:

   - `tipoAsistencia`: "Asistencia", "Retardo", "Falta" (primera mayúscula)
   - `estatus`: "Pendiente", "revisado", "resuelto" (mixto)
   - `tipo`: "falta_tarea", "conducta", "otra" (minúsculas con guión bajo)

4. **Campos nullable**: `accionesTomadas`, `fechaRevision` pueden ser `null`

---

**Fecha de análisis**: 16 de octubre de 2025
