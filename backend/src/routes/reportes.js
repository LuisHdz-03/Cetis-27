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

    console.log("Reportes desde BD:", JSON.stringify(reportes, null, 2));

    // Convertir el campo booleano 'estatus' a texto para el frontend
    const reportesFormateados = reportes.map((reporte) => {
      const formateado = {
        ...reporte,
        id: reporte.idReporte,
        estatus:
          reporte.estatus === true
            ? "resuelto"
            : reporte.estatus === false
              ? "Pendiente"
              : "Pendiente",
      };
      console.log("Reporte formateado:", JSON.stringify(formateado, null, 2));
      return formateado;
    });

    res.json(reportesFormateados);
  } catch (error) {
    console.error("Error al obtener reportes:", error);
    res.status(500).json({ error: "Error al obtener los reportes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      idEstudiante,
      idGrupo,
      idDocente,
      tipo,
      titulo,
      descripcion,
      fechaReporte,
      gravedad,
      estatus,
      accionTomada,
      lugarEncontraba,
      leClasesReportado,
      nombreFirmaAlumno,
      nombreFirmaMaestro,
      nombreTutor,
      nombrePapaMamaTutor,
      telefono,
    } = req.body;

    const nuevoReporte = await prisma.reporte.create({
      data: {
        idEstudiante,
        idGrupo,
        idDocente,
        tipo,
        titulo,
        descripcion,
        fechaReporte: new Date(fechaReporte),
        gravedad,
        estatus,
        accionTomada,
        fechaCreacion: new Date(),
        lugarEncontraba,
        leClasesReportado,
        nombreFirmaAlumno,
        nombreFirmaMaestro,
        nombreTutor,
        nombrePapaMamaTutor,
        telefono,
      },
    });
    res.json(nuevoReporte);
  } catch (error) {
    console.error("Error creando reporte:", error);
    res.status(500).json({ error: "Error al crear el reporte" });
  }
});

module.exports = router;
