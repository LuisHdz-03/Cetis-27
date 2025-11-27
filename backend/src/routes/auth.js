const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Cambia esto por una variable de entorno en producción
const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }
  try {
    // Buscar usuario por email
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user || !user.activo) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    // Comparar contraseña (en texto plano o hash)
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    // Buscar idEstudiante si es estudiante o alumno
    let idEstudiante = null;
    if (user.tipoUsuario === "estudiante" || user.tipoUsuario === "alumno") {
      const estudiante = await prisma.estudiante.findFirst({
        where: { idUsuario: user.idUsuario },
        select: { idEstudiante: true },
      });
      if (estudiante) {
        idEstudiante = estudiante.idEstudiante;
      }
    }
    // Generar JWT
    const token = jwt.sign(
      {
        idUsuario: user.idUsuario,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        idEstudiante: idEstudiante,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        idUsuario: user.idUsuario,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        idEstudiante: idEstudiante,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
