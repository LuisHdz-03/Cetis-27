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
module.exports = router;
