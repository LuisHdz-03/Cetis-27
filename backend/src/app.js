const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

// Configuración de CORS más específica para Railway
const corsOptions = {
  origin: true, // Permite todos los orígenes en desarrollo
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600, // 10 minutos
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Middleware de logging para debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

const estudiantesRoutes = require("./routes/estudiantes");
app.use("/api/estudiantes", estudiantesRoutes);

const usuariosRoutes = require("./routes/usuarios");
app.use("/api/usuarios", usuariosRoutes);

const inscripcionesRoutes = require("./routes/inscripciones");
app.use("/api/inscripciones", inscripcionesRoutes);

const gruposRoutes = require("./routes/grupos");
app.use("/api/grupos", gruposRoutes);

const materiasRoutes = require("./routes/materias");
app.use("/api/materias", materiasRoutes);

const asistenciasRoutes = require("./routes/asistencias");
app.use("/api/asistencias", asistenciasRoutes);

const reportesRoutes = require("./routes/reportes");
app.use("/api/reportes", reportesRoutes);

const especialidadesRouter = require("./routes/especialidades");
app.use("/api/especialidades", especialidadesRouter);

const periodosRoutes = require("./routes/periodos");
app.use("/api/periodos", periodosRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
    timestamp: new Date().toISOString(),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.path,
    method: req.method,
  });
});

module.exports = app;
