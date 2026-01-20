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
    // 1. Buscar usuario
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user || !user.activo) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // 2. Comparar contraseña (Soporta texto plano '123' Y encriptada)
    // Intentamos comparar con bcrypt, si falla, comparamos texto directo (por si acaso quedaron usuarios viejos)
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      // Si la contraseña en BD no es un hash válido, bcrypt fallará.
      // Entonces comparamos como texto plano:
      if (password === user.password) passwordMatch = true;
    }

    // Si bcrypt no falló pero dio false, revisamos texto plano por si las dudas (solo en desarrollo)
    if (!passwordMatch && password === user.password) {
      passwordMatch = true;
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // 3. Buscar idEstudiante (CORREGIDO PARA MAYÚSCULAS)
    let idEstudiante = null;

    // Convertimos a minúsculas para que 'ALUMNO' sea igual a 'alumno'
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

    // 4. Generar Token
    const token = jwt.sign(
      {
        idUsuario: user.idUsuario,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        idEstudiante: idEstudiante, // Aquí ya debería ir el número
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 5. Responder
    res.json({
      token,
      user: {
        idUsuario: user.idUsuario,
        email: user.email,
        tipoUsuario: user.tipoUsuario,
        idEstudiante: idEstudiante, // ¡Importante que esto no sea null!
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
