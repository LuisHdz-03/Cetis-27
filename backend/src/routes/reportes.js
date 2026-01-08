const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { estudianteId } = req.query;

    const whereClause = estudianteId
      ? { idEstudiante: parseInt(estudianteId) }
      : {};

    const reportes = await prisma.reporte.findMany({
      where: whereClause,
    });

    // Convertir el campo booleano 'estatus' a texto para el frontend
    const reportesFormateados = reportes.map((reporte) => ({
      ...reporte,
      id: reporte.idReporte,
      estatus:
        reporte.estatus === true
          ? "resuelto"
          : reporte.estatus === false
          ? "Pendiente"
          : "Pendiente",
    }));

    res.json(reportesFormateados);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
});
module.exports = router;
