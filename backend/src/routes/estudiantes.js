const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Obtener todos los estudiantes
router.get("/", async (req, res) => {
  try {
    const estudiantes = await prisma.estudiante.findMany();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

// Obtener estudiante por ID
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const estudiante = await prisma.estudiante.findUnique({
      where: { idEstudiante: id },
      include: {
        usuario: true,
        especialidad: true,
      },
    });
    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    // Formatear respuesta para el frontend
    const nombreCompleto = estudiante.usuario
      ? `${estudiante.usuario.nombre} ${
          estudiante.usuario.apellidoPaterno || ""
        } ${estudiante.usuario.apellidoMaterno || ""}`.trim()
      : "Sin nombre";
    const especialidadNombre = estudiante.especialidad
      ? estudiante.especialidad.nombre
      : "Sin especialidad";
    const codigoEspecialidad = estudiante.especialidad
      ? estudiante.especialidad.codigo
      : "N/A";
    const fechaIngreso = estudiante.fechaIngreso
      ? estudiante.fechaIngreso.toISOString().split("T")[0]
      : "N/A";
    const email = estudiante.usuario ? estudiante.usuario.email : "";
    const telefono = estudiante.usuario
      ? estudiante.usuario.telefono || estudiante.telefono
      : estudiante.telefono;

    const response = {
      numeroControl: estudiante.numeroControl,
      nombreCompleto,
      especialidad: especialidadNombre,
      codigoEspecialidad,
      semestre: estudiante.semestreActual,
      email,
      telefono,
      codigoQr: estudiante.codigoQr,
      fechaIngreso,
      curp: estudiante.curp,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiante" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const estudiante = await prisma.estudiante.findUnique({
      where: { idEstudiante: id },
    });
    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estudiante" });
  }
});

module.exports = router;
