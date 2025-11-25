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
module.exports = router;
