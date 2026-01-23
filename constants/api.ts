// Configuración de API
const USE_LOCAL = false; // Cambiar a true para usar backend local

export const API_BASE_URL = USE_LOCAL
  ? "http://192.168.1.69:3001" // Tu IP local (ajusta según tu red)
  : "https://cetis-27-production.up.railway.app"; // Railway

console.log(`📡 API conectando a: ${API_BASE_URL}`);
