const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs"); // <--- IMPORTANTE

// GET: Obtener todos
router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// POST: Crear usuario (AHORA CON ENCRIPTACIÓN)
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      password, // <--- La password plana
      tipoUsuario,
      activo,
      telefono,
      fechaNacimiento,
      curp,
      numeroEmpleado,
      especialidad,
      grupo,
      cargo,
      matricula,
    } = req.body;

    // --- ENCRIPTAMOS LA CONTRASEÑA ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);
    // ---------------------------------

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        password: hashedPassword, // <--- GUARDAMOS LA ENCRIPTADA
        tipoUsuario,
        activo: activo !== undefined ? activo : true,
        telefono,
        curp,
        numeroEmpleado,
        especialidad,
        grupo,
        cargo,
        matricula,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      },
    });

    res.json(nuevoUsuario);
  } catch (error) {
    console.error("Error creando usuario:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ error: "El correo ya existe" });
    }
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

module.exports = router;
