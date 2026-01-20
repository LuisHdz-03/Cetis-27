const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ----------------------------------------------------
// 1. GET: Obtener TODOS los estudiantes
// ----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        usuario: true, // Incluimos info del usuario para ver nombres
        especialidad: true,
      },
    });

    // Convertimos BigInt a String para que no truene el JSON
    const respuesta = estudiantes.map((e) => ({
      ...e,
      numeroControl: e.numeroControl ? e.numeroControl.toString() : "N/A",
    }));

    res.json(respuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estudiantes" });
  }
});

// ----------------------------------------------------
// 2. GET: Obtener UN estudiante por ID
// ----------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const estudiante = await prisma.estudiante.findUnique({
      where: { idEstudiante: id },
      include: {
        usuario: true,
        especialidad: true,
      },
    });

    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    // Formatear respuesta para el frontend
    const nombreCompleto = estudiante.usuario
      ? `${estudiante.usuario.nombre} ${estudiante.usuario.apellidoPaterno || ""} ${estudiante.usuario.apellidoMaterno || ""}`.trim()
      : "Sin nombre";

    const response = {
      idEstudiante: estudiante.idEstudiante,
      numeroControl: String(estudiante.numeroControl),
      nombreCompleto,
      especialidad: estudiante.especialidad
        ? estudiante.especialidad.nombre
        : "Sin especialidad",
      codigoEspecialidad: estudiante.especialidad
        ? estudiante.especialidad.codigo
        : "N/A",
      semestre: estudiante.semestreActual,
      email: estudiante.usuario ? estudiante.usuario.email : "",
      telefono: estudiante.telefono, // Telefono del estudiante
      codigoQr: estudiante.codigoQr,
      fechaIngreso: estudiante.fechaIngreso
        ? estudiante.fechaIngreso.toISOString().split("T")[0]
        : "N/A",
      curp: estudiante.curp,
      // AQUÍ MANDAMOS LA FOTO BASE64
      foto: estudiante.foto,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener estudiante" });
  }
});

// ----------------------------------------------------
// 3. POST: CREAR estudiante (¡ESTA FALTABA!)
// ----------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const {
      idUsuario,
      idEspecialidad,
      numeroControl,
      curp,
      fechaNacimiento,
      direccion,
      telefono,
      semestreActual,
      fechaIngreso,
    } = req.body;

    const nuevoEstudiante = await prisma.estudiante.create({
      data: {
        idUsuario,
        idEspecialidad,
        numeroControl: BigInt(numeroControl), // Convertimos a BigInt
        curp,
        direccion,
        telefono,
        semestreActual,
        fechaNacimiento: new Date(fechaNacimiento), // Convertimos a Fecha
        fechaIngreso: new Date(fechaIngreso), // Convertimos a Fecha
        fechaCreacion: new Date(),
      },
    });

    // Respondemos convirtiendo el BigInt a String
    res.json({
      ...nuevoEstudiante,
      numeroControl: String(nuevoEstudiante.numeroControl),
    });
  } catch (error) {
    console.error("Error creando estudiante:", error);
    res.status(500).json({ error: "Error al crear estudiante" });
  }
});

// ----------------------------------------------------
// 4. POST: Subir FOTO (Versión Base64 para Railway)
// ----------------------------------------------------
router.post("/:id/foto", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Recibimos el string gigante directo del body
    const { fotoBase64 } = req.body;

    if (!fotoBase64) {
      return res.status(400).json({ error: "No se envió 'fotoBase64'" });
    }

    // Actualizamos la BD
    const estudianteActualizado = await prisma.estudiante.update({
      where: { idEstudiante: id },
      data: { foto: fotoBase64 }, // Guardamos en el campo LONGTEXT
    });

    res.json({
      mensaje: "Foto guardada correctamente en BD",
      id: estudianteActualizado.idEstudiante,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
});

module.exports = router;
