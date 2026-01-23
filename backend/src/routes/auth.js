const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "supersecreto";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña requeridos" });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user || !user.activo) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      if (password === user.password) passwordMatch = true;
    }

    if (!passwordMatch && password === user.password) {
      passwordMatch = true;
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    let idEstudiante = null;

    const tipo = user.tipoUsuario ? user.tipoUsuario.toLowerCase() : "";

    if (tipo === "estudiante" || tipo === "alumno") {
      const estudiante = await prisma.estudiante.findFirst({
        where: { idUsuario: user.idUsuario },
        select: { idEstudiante: true },
      });

      if (estudiante) {
        idEstudiante = estudiante.idEstudiante;
      }
    }

    const token = jwt.sign(
      {
        idUsuario: user.idUsuario,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        idEstudiante: idEstudiante,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
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
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
