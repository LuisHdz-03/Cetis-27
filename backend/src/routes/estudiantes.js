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

// Obtener estudiante por ID con logs de debug
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const estudiante = await prisma.estudiante.findUnique({
      where: { idEstudiante: id },
      include: {
        usuario: true,
        especialidad: true,
        inscripciones: {
          include: {
            grupo: {
              include: {
                periodo: true,
              },
            },
          },
          orderBy: {
            fechaInscripcion: "desc",
          },
          take: 1,
        },
      },
    });
    if (!estudiante) {
      console.log("[DEBUG] No se encontró estudiante con id:", id);
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
    const grupo =
      estudiante.inscripciones && estudiante.inscripciones.length > 0
        ? estudiante.inscripciones[0].grupo.codigo
        : "Sin grupo";
    res.json({
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
      grupo,
    });
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
