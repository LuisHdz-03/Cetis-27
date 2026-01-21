const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

BigInt.prototype.toJSON = function () {
  return this.toString();
};
//cosas para fotos
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "fotos_chavales_cetis27",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// GET: Obtener todos
router.get("/", async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      password,
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

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

//subir foto
router.post("/uploadFoto", upload.single("foto"), async (req, res) => {
  try {
    const { idUsuario } = req.body;

    if (!req.file) return res.status(400).json({ error: "NO se pudo subir" });
    if (!idUsuario)
      return res.status(400).json({ error: "falta el idUsuario" });

    const urlFoto = req.file.path;
    console.log("foto para el chaval: ", idUsuario);

    const estudianteEcnotrado = await prisma.estudiante.findFirst({
      where: { idUsuario: parseInt(idUsuario, 10) },
    });

    if (!estudianteEcnotrado)
      return res.status(400).json({ error: "no se encontro al estudiante" });

    const estudianteActualizado = await prisma.estudiante.update({
      where: { idEstudiante: estudianteEcnotrado.idEstudiante },
      data: { foto: urlFoto },
    });
    const respuestaSegura = JSON.parse(
      JSON.stringify(estudianteActualizado, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );
    res.json({
      mensaje: "foto actualizada",
      foto: urlFoto,
      estudiante: respuestaSegura,
    });
  } catch (error) {
    console.error("error al subir la foto:", error);
    res.status(500).json({ error: "error al subir la foto" });
  }
});

module.exports = router;
