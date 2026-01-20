const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET: Ver todas
router.get("/", async (req, res) => {
  try {
    const especialidades = await prisma.especialidad.findMany();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las especialidades" });
  }
});

// POST: Crear nueva (ESTE ES EL QUE FALTABA)
router.post("/", async (req, res) => {
  try {
    // Desestructuramos los datos que envías desde Postman
    const { nombre, codigo, activo, fechaCreacion } = req.body;

    const nuevaEspecialidad = await prisma.especialidad.create({
      data: {
        nombre,
        codigo,
        activo,
        // Si mandas fecha úsala, si no, pon la fecha y hora de ahorita
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
