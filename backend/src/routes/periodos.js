const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const periodos = await prisma.periodo.findMany();
    res.json(periodos);
  } catch (error) {
    console.error("Error al obtener periodos:", error);
    res.status(500).json({ error: "Error al obtener los periodos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, fechaInicio, fechaFin, activo } = req.body;
    const nuevoPeriodo = await prisma.periodo.create({
      data: {
        nombre,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        activo,
        fechaCreacion: new Date(),
      },
    });
    res.json(nuevoPeriodo);
  } catch (error) {
    console.error("Error creando periodo:", error);
    res.status(500).json({ error: "Error al crear el periodo" });
  }
});

module.exports = router;
