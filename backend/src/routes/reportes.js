const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const reportes = await prisma.reporte.findMany();
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
});
module.exports = router;
