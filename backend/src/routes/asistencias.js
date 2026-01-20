const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const asistencias = await prisma.asistencia.findMany();
    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las asistencias" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      idInscripcion,
      idDocente,
      fecha,
      horaRegistro,
      tipoAsistencia,
      observaciones,
    } = req.body;
    const nuevaAsistencia = await prisma.asistencia.create({
      data: {
        idInscripcion,
        idDocente,
        fecha: new Date(fecha),
        horaRegistro: new Date(horaRegistro),
        tipoAsistencia,
        observaciones,
        fechaRegistro: new Date(),
      },
    });
    res.json(nuevaAsistencia);
  } catch (error) {
    console.error("Error creando asistencia:", error);
    res.status(500).json({ error: "Error al crear la asistencia" });
  }
});

module.exports = router;
