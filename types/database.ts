// --- MODELOS BASE (Reflejo de la Base de Datos) ---

export type RolUsuario = "ADMIN" | "DOCENTE" | "ALUMNO";

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  curp: string;
  telefono?: string;
  direccion?: string;
  rol: RolUsuario;
  activo: boolean;
  fotoUrl?: string; // Centralizado aquí o en Estudiante
}

export interface Especialidad {
  idEspecialidad: number;
  nombre: string;
  codigo?: string;
}

export interface Grupo {
  idGrupo: number;
  nombre: string; // Ej: "A", "B"
  grado: number; // Ej: 1, 3, 5
  turno: "MATUTINO" | "VESPERTINO";
  especialidad?: Especialidad;
}

export interface Estudiante {
  idEstudiante: number;
  matricula: string;
  usuarioId: number;
  grupoId?: number;
  semestre: number;
  credencialFechaEmision?: string;
  credencialFechaExpiracion?: string;
  usuario?: Usuario;
  grupo?: Grupo;
}

export interface Tutor {
  idTutor: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono: string;
  parentesco: string;
  email?: string;
  direccion?: string;
}

// --- INTERFACES PARA LA APP MÓVIL (Datos combinados) ---

export interface EstudianteCompleto {
  idUsuario: string;
  foto: string | null;
  numeroControl: string;
  nombreCompleto: string;
  especialidad: string;
  semestre: number;
  email: string;
  curp: string;
  telefono: string;
  direccion: string;
  // Info de grupo
  grupoNombre: string;
  turno: string;
  // Info de tutor opcional
  tutor?: {
    nombre: string;
    telefono: string;
    parentesco: string;
  } | null;
}

// Interfaz exacta para lo que devuelve el controlador 'getCredencial'
export interface DatosCredencial {
  nombreCompleto: string;
  curp: string;
  noControl: string;
  especialidad: string;
  turno: string;
  emision: string; // Ya formateada: "marzo 2026"
  vigencia: string; // Ya formateada: "marzo 2029"
  qrImage: string; // String en Base64 (data:image/png;base64...)
}

// Interfaz para el historial de asistencias "masticado" por el back
export interface AsistenciaMovil {
  fecha: string;
  estatus: string;
  materia: string;
  docente: string;
}

export interface AccesoMovil {
  idAccesos: number;
  fechaHora: string;
  tipo: string; // "ENTRADA" | "SALIDA"
}

export interface EstadisticasMateria {
  nombreMateria: string;
  total: number;
  asistencias: number;
  faltas: number;
  retardos: number;
  porcentajeAsistencia: number;
}
