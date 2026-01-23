export interface Usuario {
  idUsuario: number;
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
  idUsuario: number;
  idEspecialidad: number;
  numeroControl: string;
  curp: string;
  semestreActual: number;
  codigoQr: string;
  fechaIngreso: string;

  usuario?: Usuario;
  especialidad?: Especialidad;
}

export interface Docente {
  id: number;
  idUsuario: number;
  idEspecialidad: number;
  numeroEmpleado: string;
  usuario?: Usuario;
  especialidad?: Especialidad;
}

export interface Tutor {
  id: number;
  idEstudiante: number;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  parentesco: string;
  activo: boolean;
  estudiante?: Estudiante;
}

export interface Especialidad {
  id: number;
  nombre: string;
  codigo: string;
  activo: boolean;
}

export interface Materia {
  id: number;
  idEspecialidad: number;
  nombre: string;
  codigo: string;
  semestre: number;
  horas: number;
  activo: boolean;
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
  idMateria: number;
  idDocente: number;
  idPeriodo: number;
  idEspecialidad: number;
  codigo: string;
  semestre: number;
  aula: string;
  activo: boolean;
  materia?: Materia;
  docente?: Docente;
  periodo?: Periodo;
  especialidad?: Especialidad;
}

export interface Inscripcion {
  id: number;
  idEstudiante: number;
  idGrupo: number;
  fechaInscripcion: string;
  estudiante?: Estudiante;
  grupo?: Grupo;
}
export type TipoAsistencia = "Asistencia" | "Retardo" | "Falta";

export interface Asistencia {
  id: number;
  idInscripcion: number;
  idDocente: number;
  fecha: string;
  horaRegistro: string;
  tipoAsistencia: TipoAsistencia;
  observaciones: string;
  fechaRegistroAsistencia: string;
  inscripcion?: Inscripcion;
  docente?: Docente;
}

export type TipoReporte = "falta_tarea" | "conducta" | "otra";
export type EstatusReporte = "Pendiente" | "revisado" | "resuelto";
export type GravedadReporte = "ALTA" | "MEDIA" | "BAJA";

export interface Reporte {
  id: number;
  idEstudiante: number;
  idGrupo: number;
  idDocente: number;
  tipo: TipoReporte;
  titulo: string;
  descripcion: string;
  fechaReporte: string;
  gravedad: GravedadReporte;
  estatus: EstatusReporte;
  accionTomada: string | null;
  fechaCreacion: string;
  fechaRevision: string | null;
  lugarEncontraba: string | null;
  leClasesReportado: string | null;
  nombreFirmaAlumno: string | null;
  nombreFirmaMaestro: string | null;
  nombreTutor: string | null;
  nombrePapaMamaTutor: string | null;
  telefono: string | null;
  estudiante?: Estudiante;
  grupo?: Grupo;
  docente?: Docente;
}

export interface EstudianteCompleto {
  idUsuario: number;
  foto: string | null;

  numeroControl: string;
  nombreCompleto: string;
  especialidad: string;
  codigoEspecialidad: string;
  semestre: number;
  email: string;
  telefono: string;
  codigoQr: string;
  fechaIngreso: string;
  curp: string;
}

export interface DocenteCompleto {
  numeroEmpleado: string;
  nombreCompleto: string;
  especialidad: string;
  email: string;
  telefono: string;
}

export interface EstadisticasGrupo {
  idGrupo: number;
  idMateria: number;
  nombreMateria: string;
  codigoMateria: string;
  codigoGrupo: string;
  semestre: number;
  aula: string;
  nombreDocente: string;
  totalClases: number;
  totalAsistencias: number;
  totalRetardos: number;
  totalFaltas: number;
  porcentajeAsistencia: number;
  grupoIdString?: string;
}

export interface ReporteDetallado extends Reporte {
  nombreEstudiante: string;
  nombreDocente: string;
  nombreMateria: string;
  codigoGrupo: string;
}
