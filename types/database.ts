// ============================================
// 1. USUARIOS Y PERFILES
// ============================================

export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  tipoUsuario: "estudiante" | "admon" | "docente";
  activo: boolean;
  fechaRegistro: string;
}

export interface Estudiante {
  id: number;
  idUsuario: number; // FK → usuarios
  idEspecialidad: number; // FK → especialidades
  numeroControl: string;
  semestreActual: number;
  codigoQr: string;
  fechaIngreso: string;
  // Relaciones opcionales (JOINs)
  usuario?: Usuario;
  especialidad?: Especialidad;
}

export interface Docente {
  id: number;
  idUsuario: number; // FK → usuarios
  idEspecialidad: number; // FK → especialidades
  numeroEmpleado: string;
  // Relaciones opcionales (JOINs)
  usuario?: Usuario;
  especialidad?: Especialidad;
}

export interface Tutor {
  id: number;
  idEstudiante: number; // FK → estudiantes
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  parentesco: string;
  activo: boolean;
  // Relaciones opcionales
  estudiante?: Estudiante;
}

// ============================================
// 2. ACADÉMICO
// ============================================

export interface Especialidad {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
}

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

export interface Periodo {
  id: number;
  codigo: string;
  semestre: string;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

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
  // Relaciones opcionales (JOINs)
  materia?: Materia;
  docente?: Docente;
  periodo?: Periodo;
  especialidad?: Especialidad;
}

export interface Inscripcion {
  id: number;
  idEstudiante: number; // FK → estudiantes
  idGrupo: number; // FK → grupos
  fechaInscripcion: string;
  // Relaciones opcionales (JOINs)
  estudiante?: Estudiante;
  grupo?: Grupo;
}

// ============================================
// 3. ASISTENCIAS
// ============================================

export type TipoAsistencia = "Asistencia" | "Retardo" | "Falta";

export interface Asistencia {
  id: number;
  idInscripcion: number; // FK → inscripciones
  idDocente: number; // FK → docentes
  fecha: string; // Fecha de la clase (YYYY-MM-DD)
  horaRegistro: string; // Hora en que se tomó asistencia (HH:mm:ss)
  tipoAsistencia: TipoAsistencia; // "Asistencia", "Retardo", "Falta"
  observaciones: string; // Observaciones de la asistencia
  fechaRegistroAsistencia: string; // Timestamp completo del registro
  // Relaciones opcionales (JOINs)
  inscripcion?: Inscripcion;
  docente?: Docente;
}

// ============================================
// 4. REPORTES/INCIDENCIAS
// ============================================

export type TipoReporte = "falta_tarea" | "conducta" | "otra";
export type EstatusReporte = "Pendiente" | "revisado" | "resuelto";
export type GravedadReporte = "ALTA" | "MEDIA" | "BAJA";

export interface Reporte {
  id: number;
  idEstudiante: number; // FK → estudiantes
  idGrupo: number; // FK → grupos
  idDocente: number; // FK → docentes (quien reporta)
  tipo: TipoReporte; // "falta_tarea", "conducta", "otra"
  titulo: string;
  descripcion: string;
  fechaReporte: string; // Fecha del incidente
  gravedad: GravedadReporte; // "ALTA", "MEDIA", "BAJA"
  estatus: EstatusReporte; // "Pendiente", "revisado", "resuelto"
  accionesTomadas: string | null; // Puede ser null si aún no se resolvió
  fechaRegistro: string; // Timestamp de creación del reporte
  fechaRevision: string | null; // Timestamp de cuando se revisó (puede ser null)
  // Relaciones opcionales (JOINs)
  estudiante?: Estudiante;
  grupo?: Grupo;
  docente?: Docente;
}

// ============================================
// 5. INTERFACES AUXILIARES (Para vistas/UI)
// ============================================

/**
 * Datos completos del estudiante (vista aplanada para UI)
 * Resultado de JOIN entre usuarios, estudiantes, especialidades
 */
export interface EstudianteCompleto {
  numeroControl: string;
  nombreCompleto: string; // usuario.nombre + apellidos
  especialidad: string; // especialidades.nombre
  codigoEspecialidad: string; // especialidades.codigo
  semestre: number; // estudiantes.semestreActual
  email: string; // usuarios.email
  telefono: string; // usuarios.telefono
  codigoQr: string; // estudiantes.codigoQr
  fechaIngreso: string; // estudiantes.fechaIngreso
}

/**
 * Datos del docente (vista aplanada para UI)
 */
export interface DocenteCompleto {
  numeroEmpleado: string;
  nombreCompleto: string; // usuario.nombre + apellidos
  especialidad: string; // especialidades.nombre
  email: string; // usuarios.email
  telefono: string; // usuarios.telefono
}

/**
 * Estadísticas de asistencia por grupo
 * (Calculado desde múltiples tablas)
 */
export interface EstadisticasGrupo {
  idGrupo: number;
  idMateria: number;
  nombreMateria: string;
  codigoMateria: string;
  codigoGrupo: string;
  semestre: number;
  aula: string;
  nombreDocente: string;
  totalClases: number; // Total de días registrados
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
  porcentajeAsistencia: number; // Calculado: (asistencias + retardos) / totalClases * 100
  grupoIdString?: string; // ID del grupo como string (para el picker)
}

/**
 * Reporte con datos completos (para mostrar en UI)
 */
export interface ReporteDetallado extends Reporte {
  nombreEstudiante: string;
  nombreDocente: string;
  nombreMateria: string;
  codigoGrupo: string;
}
