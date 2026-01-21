const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const inscripciones = await prisma.inscripcion.findMany();
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las inscripciones" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { idEstudiante, idGrupo, fechaInscripcion, activo } = req.body;

    const fechaFinal = fechaInscripcion
      ? new Date(fechaInscripcion)
      : new Date();

    const nuevaInscripcion = await prisma.inscripcion.create({
      data: {
        idEstudiante,
        idGrupo,
        fechaInscripcion: fechaFinal,
        activo: activo !== undefined ? activo : true,
        fechaCreacion: new Date(),
      },
    });
    res.json(nuevaInscripcion);
  } catch (error) {
    console.error("Error creando inscripción:", error);
    res.status(500).json({ error: "Error al crear la inscripción" });
  }
});

module.exports = router;
