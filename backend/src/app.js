const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.get("/", (req, res) => {
  res.send("API funcionando");
});

// Importar y usar la ruta de estudiantes
const estudiantesRoutes = require("./routes/estudiantes");
app.use("/api/estudiantes", estudiantesRoutes);

// Importar y usar la ruta de usuarios
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
module.exports = app;
