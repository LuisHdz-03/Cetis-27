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

module.exports = router;
