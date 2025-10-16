# 📱 Sistema de QR Dinámico para Estudiantes CETIS-27

## 🎯 Resumen

El sistema ahora genera códigos QR dinámicos únicos para cada estudiante basados en sus datos de la base de datos.

---

## 📊 Estructura de Base de Datos

### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(15),
  fecha_nacimiento DATE,
  direccion TEXT,
  tipo_usuario ENUM('estudiante', 'administrador', 'docente') NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla: `especialidades`

```sql
CREATE TABLE especialidades (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(200) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  activo BOOLEAN DEFAULT TRUE
);
```

### Tabla: `estudiantes`

```sql
CREATE TABLE estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_especialidad INT NOT NULL,
  numero_control VARCHAR(20) UNIQUE NOT NULL,
  semestre_actual INT NOT NULL,
  codigo_qr VARCHAR(255) UNIQUE NOT NULL,
  fecha_ingreso DATE NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  FOREIGN KEY (id_especialidad) REFERENCES especialidades(id)
);
```

---

## 🔐 Generación del Código QR Único

El campo `codigo_qr` en la tabla `estudiantes` debe contener un código único. Puedes generarlo de varias formas:

### Opción 1: UUID (Recomendado)

```sql
-- Al insertar un nuevo estudiante
INSERT INTO estudiantes (id_usuario, id_especialidad, numero_control, semestre_actual, codigo_qr, fecha_ingreso)
VALUES (1, 2, '22050123', 3, UUID(), '2022-08-15');
```

### Opción 2: Hash personalizado (Node.js/Backend)

```javascript
const crypto = require("crypto");

function generateQRCode(numeroControl, idUsuario) {
  const data = `${numeroControl}-${idUsuario}-${Date.now()}`;
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 32);
}
```

### Opción 3: Formato estructurado

```javascript
// Ejemplo: CETIS27-22050123-2022-A1B2C3D4
const qrCode = `CETIS27-${numeroControl}-${year}-${randomString}`;
```

---

## 🌐 API Endpoint Requerido

### **GET** `/api/estudiante/perfil`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Respuesta exitosa (200):**

```json
{
  "id": 1,
  "numeroControl": "22050123",
  "idUsuario": 15,
  "idEspecialidad": 2,
  "semestreActual": 3,
  "codigoQr": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "fechaIngreso": "2022-08-15",
  "usuario": {
    "id": 15,
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "email": "juan.perez@cetis27.edu.mx",
    "telefono": "6441234567",
    "fechaNacimiento": "2005-03-15",
    "direccion": "Calle Principal #123, Hermosillo",
    "tipoUsuario": "estudiante",
    "activo": true,
    "fechaRegistro": "2022-08-10T12:00:00Z"
  },
  "especialidad": {
    "id": 2,
    "nombre": "Programación",
    "codigo": "PROG",
    "activo": true
  }
}
```

**Ejemplo con SQL JOIN:**

```sql
SELECT
  e.*,
  u.nombre,
  u.apellido_paterno,
  u.apellido_materno,
  u.email,
  u.telefono,
  u.fecha_nacimiento,
  u.direccion,
  u.tipo_usuario,
  u.activo AS usuario_activo,
  u.fecha_registro,
  es.nombre AS especialidad_nombre,
  es.codigo AS especialidad_codigo,
  es.activo AS especialidad_activa
FROM estudiantes e
INNER JOIN usuarios u ON e.id_usuario = u.id
INNER JOIN especialidades es ON e.id_especialidad = es.id
WHERE u.id = ? -- ID del usuario autenticado
AND u.activo = TRUE;
```

---

## 📲 Contenido del Código QR

El QR generado contiene información en formato JSON compacto:

```json
{
  "nc": "22050123", // Número de control
  "n": "Juan Pérez García", // Nombre completo
  "e": "PROG", // Código de especialidad
  "s": 3, // Semestre actual
  "c": "a1b2c3d4...", // Código QR único
  "f": "2022-08-15" // Fecha de ingreso
}
```

### Alternativas de contenido:

**Opción 1: Solo código único (más seguro)**

```javascript
qrData = estudiante.codigoQr;
// Resultado: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**Opción 2: String delimitado (más compacto)**

```javascript
qrData = `${numeroControl}|${nombre}|${especialidad}|${semestre}|${codigoQr}`;
// Resultado: "22050123|Juan Pérez García|PROG|3|a1b2c3d4..."
```

**Opción 3: JSON completo (más estructurado)** ⭐ Actualmente implementado

```javascript
qrData = JSON.stringify({
  nc: estudiante.numeroControl,
  n: estudiante.nombreCompleto,
  e: estudiante.codigoEspecialidad,
  s: estudiante.semestre,
  c: estudiante.codigoQr,
  f: estudiante.fechaIngreso,
});
```

---

## 🔄 Flujo de Trabajo

### 1. **Estudiante abre la app**

- Inicia sesión con sus credenciales
- El token se guarda en `AuthContext`

### 2. **Navega a la pestaña "Credenciales"**

- Se ejecuta el hook `useEstudiante()`
- Se hace fetch a `/api/estudiante/perfil` con el token

### 3. **Se genera el QR dinámico**

- Los datos del estudiante se convierten en string JSON
- `react-native-qrcode-svg` genera el código visual
- El QR incluye el logo del CETIS-27 en el centro

### 4. **Escaneo del QR (por docente/administrador)**

- Se escanea el QR con otra app/dispositivo
- Se extrae el `codigoQr` único
- Se verifica contra la base de datos
- Se registra la asistencia

---

## 🔧 Configuración en el Código

### Archivo: `hooks/useEstudiante.ts`

**Cambiar el endpoint:**

```typescript
const response = await fetch(
  "https://tu-dominio.com/api/estudiante/perfil", // ⬅️ Cambiar aquí
  {
    /* ... */
  }
);
```

**Cambiar el formato del QR:**

```typescript
const generateQRData = (): string => {
  if (!estudiante) return "";

  // Opción 1: Solo código (descomentar)
  // return estudiante.codigoQr;

  // Opción 2: JSON compacto (actual)
  return JSON.stringify({
    nc: estudiante.numeroControl,
    n: estudiante.nombreCompleto,
    e: estudiante.codigoEspecialidad,
    s: estudiante.semestre,
    c: estudiante.codigoQr,
    f: estudiante.fechaIngreso,
  });
};
```

---

## 🎨 Personalización del QR

### Archivo: `app/(tabs)/(credenciales)/qr.tsx`

**Cambiar tamaño:**

```tsx
<QRCode
  value={qrData}
  size={300} // ⬅️ Cambiar aquí (default: 250)
  // ...
/>
```

**Cambiar color:**

```tsx
<QRCode
  value={qrData}
  size={250}
  color="#000000" // ⬅️ Negro (default: colors.primary)
  backgroundColor="#FFFFFF"
  // ...
/>
```

**Quitar logo del centro:**

```tsx
<QRCode
  value={qrData}
  size={250}
  color={colors.primary}
  backgroundColor={colors.white}
  // ⬅️ Eliminar estas líneas
  // logo={require("@/assets/images/icon.png")}
  // logoSize={50}
  // logoBackgroundColor={colors.white}
/>
```

---

## 🧪 Testing con Datos Mock

Para probar sin backend, modifica temporalmente `useEstudiante.ts`:

```typescript
useEffect(() => {
  // Datos mock para testing
  const mockData: EstudianteCompleto = {
    numeroControl: "22050123",
    nombreCompleto: "Juan Pérez García",
    especialidad: "Programación",
    codigoEspecialidad: "PROG",
    semestre: 3,
    email: "juan.perez@cetis27.edu.mx",
    telefono: "6441234567",
    codigoQr: "TEST-QR-123456789",
    fechaIngreso: "2022-08-15",
  };

  setEstudiante(mockData);
  setIsLoading(false);

  // fetchEstudianteData(); // ⬅️ Comentar mientras no hay API
}, []);
```

---

## 📱 Escanear el QR

Para escanear estos QR codes, el dispositivo lector necesitará:

1. **App de escaneo con cámara**
2. **Parsear el contenido JSON**
3. **Validar contra la base de datos**

### Ejemplo de validación (Backend):

```javascript
// POST /api/asistencia/registrar
app.post("/api/asistencia/registrar", async (req, res) => {
  const { qrScanned } = req.body;

  // Parsear el QR
  const qrData = JSON.parse(qrScanned);
  const { c: codigoQr, nc: numeroControl } = qrData;

  // Validar en BD
  const estudiante = await db.query(
    "SELECT * FROM estudiantes WHERE codigo_qr = ? AND numero_control = ?",
    [codigoQr, numeroControl]
  );

  if (!estudiante) {
    return res.status(404).json({ error: "QR inválido" });
  }

  // Registrar asistencia
  await db.query(
    'INSERT INTO asistencias (id_estudiante, fecha, hora, tipo) VALUES (?, NOW(), NOW(), "asistencia")',
    [estudiante.id]
  );

  res.json({ message: "Asistencia registrada" });
});
```

---

## ✅ Checklist de Implementación

- [x] Instalar librerías (`react-native-qrcode-svg`, `react-native-svg`)
- [x] Crear hook `useEstudiante`
- [x] Actualizar pantalla QR con datos dinámicos
- [ ] Crear/configurar el endpoint `/api/estudiante/perfil` en el backend
- [ ] Generar `codigo_qr` único al registrar estudiantes
- [ ] Implementar sistema de escaneo (app docente/administrador)
- [ ] Validar QR contra base de datos al escanear
- [ ] Registrar asistencias al validar QR

---

## 🚀 Próximos Pasos

1. **Backend**: Implementar el endpoint de perfil de estudiante
2. **QR Scanner**: Crear app/módulo para que docentes escaneen
3. **Validación**: Sistema de verificación de QR en tiempo real
4. **Seguridad**: Agregar timestamp y expiración a los QR
5. **Historial**: Registro de escaneos para auditoría

---

¿Necesitas ayuda con alguna parte específica? 🤔
