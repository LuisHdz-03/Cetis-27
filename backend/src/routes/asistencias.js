const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { estudianteId, grupoId } = req.query;

    let asistencias;
    if (estudianteId) {
      const whereInscripcion = { idEstudiante: parseInt(estudianteId) };

      if (grupoId) {
        whereInscripcion.idGrupo = parseInt(grupoId);
      }

      let inscripciones = await prisma.inscripcion.findMany({
        where: whereInscripcion,
        orderBy: {
          fechaCreacion: "desc",
        },
      });

      if (grupoId) {
        const gruposVistos = new Set();
        inscripciones = inscripciones.filter((insc) => {
          if (gruposVistos.has(insc.idGrupo)) {
            return false;
          }
          gruposVistos.add(insc.idGrupo);
          return true;
        });
      }

      const inscripcionIds = inscripciones.map((i) => i.idInscripcion);

      asistencias = await prisma.asistencia.findMany({
        where: {
          idInscripcion: { in: inscripcionIds },
        },
      });
      const grupoIds = inscripciones.map((i) => i.idGrupo);
      const grupos = await prisma.grupo.findMany({
        where: { idGrupo: { in: grupoIds } },
      });

      const materiaIds = grupos.map((g) => g.idMateria);
      const materias = await prisma.materia.findMany({
        where: { idMateria: { in: materiaIds } },
      });

      const asistenciasConDatos = asistencias.map((asist) => {
        const inscripcion = inscripciones.find(
          (i) => i.idInscripcion === asist.idInscripcion,
        );
        const grupo = grupos.find((g) => g.idGrupo === inscripcion?.idGrupo);
        const materia = materias.find((m) => m.idMateria === grupo?.idMateria);

        return {
          ...asist,
          nombreMateria: materia?.nombre || "Sin materia",
          codigoGrupo: grupo?.codigo || "Sin grupo",
          grupoIdString: grupo?.idGrupo.toString() || "",
        };
      });

      res.json(asistenciasConDatos);
    } else {
      asistencias = await prisma.asistencia.findMany();
      res.json(asistencias);
    }
  } catch (error) {
    console.error("Error al obtener las asistencias:", error);
    res.status(500).json({ error: "Error al obtener las asistencias" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      idInscripcion,
      idDocente,
      fecha,
      horaRegistro,
      tipoAsistencia,
      observaciones,
    } = req.body;
    const nuevaAsistencia = await prisma.asistencia.create({
      data: {
        idInscripcion,
        idDocente,
        fecha: new Date(fecha),
        horaRegistro: new Date(horaRegistro),
        tipoAsistencia,
        observaciones,
        fechaRegistro: new Date(),
      },
    });
    res.json(nuevaAsistencia);
  } catch (error) {
    console.error("Error creando asistencia:", error);
    res.status(500).json({ error: "Error al crear la asistencia" });
  }
});

module.exports = router;
