const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const especialidades = await prisma.especialidad.findMany();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { nombre, codigo, activo, fechaCreacion } = req.body;

    const nuevaEspecialidad = await prisma.especialidad.create({
      data: {
        nombre,
        codigo,
        activo,

        fechaCreacion: fechaCreacion ? new Date(fechaCreacion) : new Date(),
      },
    });

    res.json(nuevaEspecialidad);
  } catch (error) {
    console.error("Error creando especialidad:", error);
    res.status(500).json({ error: "Error al crear la especialidad" });
  }
});

module.exports = router;
