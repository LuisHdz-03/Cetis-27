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

module.exports = router;
