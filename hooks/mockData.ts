// 🧪 DATOS MOCK PARA TESTING - ELIMINAR EN PRODUCCIÓN
// Este archivo contiene datos de ejemplo para probar sin backend

export const MOCK_ESTUDIANTE = {
  numeroControl: "22050123",
  nombreCompleto: "Albertano Santa Cruz Martínez",
  especialidad: "Programación",
  codigoEspecialidad: "PROG",
  semestre: 3,
  email: "albertano.santa@cetis27.edu.mx",
  telefono: "6441234567",
  codigoQr: "CETIS27-22050123-2022-A1B2C3D4",
  fechaIngreso: "2022-08-15",
};

export const MOCK_ESTUDIANTE_COMPLETO = {
  id: 1,
  numeroControl: "22050123",
  idUsuario: 15,
  idEspecialidad: 2,
  semestreActual: 3,
  codigoQr: "CETIS27-22050123-2022-A1B2C3D4",
  fechaIngreso: "2022-08-15",
  usuario: {
    id: 15,
    nombre: "Albertano",
    apellidoPaterno: "Santa Cruz",
    apellidoMaterno: "Martínez",
    email: "albertano.santa@cetis27.edu.mx",
    telefono: "6441234567",
    fechaNacimiento: "2005-03-15",
    direccion: "Calle Principal #123, Hermosillo, Sonora",
    tipoUsuario: "estudiante" as const,
    activo: true,
    fechaRegistro: "2022-08-10T12:00:00Z",
  },
  especialidad: {
    id: 2,
    nombre: "Programación",
    codigo: "PROG",
    activo: true,
  },
};

// Función helper para simular delay de red
export const simulateNetworkDelay = (ms: number = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
