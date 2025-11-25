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
module.exports = router;
