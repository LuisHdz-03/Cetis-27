const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const materias = await prisma.materia.findMany();
    res.json(materias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las materias" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { idEspecialidad, nombre, codigo, semestre, horas, activo } =
      req.body;
    const nuevaMateria = await prisma.materia.create({
      data: {
        idEspecialidad,
        nombre,
        codigo,
        semestre,
        horas,
        activo,
        fechaCreacion: new Date(),
      },
    });
    res.json(nuevaMateria);
  } catch (error) {
    console.error("Error creando materia:", error);
    res.status(500).json({ error: "Error al crear la materia" });
  }
});

module.exports = router;
