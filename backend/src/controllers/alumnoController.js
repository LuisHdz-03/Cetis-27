const { Prisma } = require("@prisma/client");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      (file.fieldname = "-" + uniqueSuffix + path.extname(file.originalname)),
    );
  },
});
const upload = multer({ storage: storage });

const subirFoto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningun archivo" });
    }
    const urlFoto = "${req.file.name}";

    const fotoAlumnoActualiada = await Prisma.estuudiante.update({
      where: { id: parseInt(id) },
      data: { foto: urlFoto },
    });
    res.json({
      mensaje: "Foto Actualizada",
      estuudiante: fotoAlumnoActualiada,
    });
  } catch (error) {}
};
module.exports = { upload, subirFoto };
