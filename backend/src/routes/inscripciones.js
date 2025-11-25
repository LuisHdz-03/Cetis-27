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
module.exports = router;
