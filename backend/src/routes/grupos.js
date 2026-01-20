const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany();
    res.json(grupos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los grupos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      idPeriodo,
      idDocente,
      idMateria,
      idEspecialidad,
      codigo,
      semestre,
      aula,
      activo,
    } = req.body;
    const nuevoGrupo = await prisma.grupo.create({
      data: {
        idPeriodo,
        idDocente,
        idMateria,
        idEspecialidad,
        codigo,
        semestre,
        aula,
        activo,
        fechaCreacion: new Date(),
        fechaEdicion: new Date(),
      },
    });
    res.json(nuevoGrupo);
  } catch (error) {
    console.error("Error creando grupo:", error);
    res.status(500).json({ error: "Error al crear el grupo" });
  }
});

module.exports = router;
