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
        password: hashedPassword,
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

router.post("/uploadFoto", upload.single("foto"), async (req, res) => {
  try {
    const { idUsuario } = req.body;

    if (!req.file) return res.status(400).json({ error: "NO se pudo subir" });
    if (!idUsuario)
      return res.status(400).json({ error: "falta el idUsuario" });

    const urlFotoNueva = req.file.path;
    console.log("foto para el chaval: ", idUsuario);

    const estudianteEncontrado = await prisma.estudiante.findFirst({
      where: { idUsuario: parseInt(idUsuario, 10) },
    });

    if (!estudianteEncontrado)
      return res.status(400).json({ error: "no se encontro al estudiante" });

    const fotoVieja = estudianteEncontrado.foto;

    if (fotoVieja) {
      try {
        const nombreArchivo = fotoVieja.split("/").pop().split(".")[0];
        const publicId = `fotos_chavales_cetis27/${nombreArchivo}`;

        console.log(
          "Intentando eliminar la foto vieja de Cloudinary: ",
          publicId,
        );
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error al borrar la foto vieja:", error);
      }
    }

    const estudianteActualizado = await prisma.estudiante.update({
      where: { idEstudiante: estudianteEncontrado.idEstudiante },
      data: { foto: urlFotoNueva },
    });

    const respuestaSegura = JSON.parse(
      JSON.stringify(estudianteActualizado, (key, value) =>
        typeof value === "bigint" ? value.toString() : value,
      ),
    );

    res.json({
      mensaje: "foto actualizada",
      foto: urlFotoNueva,
      estudiante: respuestaSegura,
    });
  } catch (error) {
    console.error("error al subir la foto:", error);
    res.status(500).json({ error: "error al subir la foto" });
  }
});

module.exports = router;
