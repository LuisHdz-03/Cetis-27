-- CreateTable
CREATE TABLE `estudiantes` (
    `idEstudiante` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `idEspecialidad` INTEGER NOT NULL,
    `numeroControl` BIGINT NOT NULL,
    `curp` VARCHAR(191) NOT NULL,
    `fechaNacimiento` DATETIME(3) NOT NULL,
    `direccion` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `semestreActual` INTEGER NOT NULL,
    `fechaIngreso` DATETIME(3) NULL,
    `fechaCreacion` DATETIME(3) NULL,
    `fechaEdicion` DATETIME(3) NULL,
    `foto` LONGTEXT NULL,
    `codigoQr` VARCHAR(191) NULL,

    PRIMARY KEY (`idEstudiante`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `idUsuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `apellidoPaterno` VARCHAR(191) NOT NULL,
    `apellidoMaterno` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `tipoUsuario` VARCHAR(191) NOT NULL,
    `productosactivo` BOOLEAN NULL,
    `activo` BOOLEAN NULL,
    `fechaCreacion` DATETIME(3) NULL,
    `fechaActualizacion` DATETIME(3) NULL,
    `telefono` VARCHAR(191) NULL,
    `fechaNacimiento` DATETIME(3) NULL,
    `curp` VARCHAR(191) NULL,
    `numeroEmpleado` VARCHAR(191) NULL,
    `especialidad` VARCHAR(191) NULL,
    `grupo` VARCHAR(191) NULL,
    `cargo` VARCHAR(191) NULL,
    `matricula` VARCHAR(191) NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`idUsuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscripciones` (
    `idInscripcion` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstudiante` INTEGER NOT NULL,
    `idGrupo` INTEGER NOT NULL,
    `fechaInscripcion` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idInscripcion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos` (
    `idGrupo` INTEGER NOT NULL AUTO_INCREMENT,
    `idPeriodo` INTEGER NOT NULL,
    `idDocente` INTEGER NOT NULL,
    `idMateria` INTEGER NOT NULL,
    `idEspecialidad` INTEGER NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `semestre` INTEGER NOT NULL,
    `aula` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,
    `fechaEdicion` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idGrupo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materias` (
    `idMateria` INTEGER NOT NULL AUTO_INCREMENT,
    `idEspecialidad` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `semestre` INTEGER NOT NULL,
    `horas` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,
    `fechaEdicion` DATETIME(3) NULL,

    PRIMARY KEY (`idMateria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periodos` (
    `idPeriodo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,
    `fechaEdicion` DATETIME(3) NULL,

    PRIMARY KEY (`idPeriodo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistencias` (
    `idAsistencia` INTEGER NOT NULL AUTO_INCREMENT,
    `idInscripcion` INTEGER NOT NULL,
    `idDocente` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `horaRegistro` DATETIME(3) NOT NULL,
    `tipoAsistencia` VARCHAR(191) NOT NULL,
    `observaciones` VARCHAR(191) NOT NULL,
    `fechaRegistro` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idAsistencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reportes` (
    `idReporte` INTEGER NOT NULL AUTO_INCREMENT,
    `idEstudiante` INTEGER NOT NULL,
    `idGrupo` INTEGER NOT NULL,
    `idDocente` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `fechaReporte` DATETIME(3) NOT NULL,
    `gravedad` VARCHAR(191) NOT NULL,
    `estatus` BOOLEAN NOT NULL,
    `accionTomada` VARCHAR(191) NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,
    `fechaRevision` DATETIME(3) NULL,
    `lugarEncontraba` VARCHAR(191) NULL,
    `leClasesReportado` VARCHAR(191) NULL,
    `nombreFirmaAlumno` VARCHAR(191) NULL,
    `nombreFirmaMaestro` VARCHAR(191) NULL,
    `nombreTutor` VARCHAR(191) NULL,
    `nombrePapaMamaTutor` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,

    PRIMARY KEY (`idReporte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidades` (
    `idEspecialidad` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL,
    `fechaCreacion` DATETIME(3) NOT NULL,
    `fechaEdicion` DATETIME(3) NULL,

    PRIMARY KEY (`idEspecialidad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `estudiantes` ADD CONSTRAINT `estudiantes_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`idUsuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estudiantes` ADD CONSTRAINT `estudiantes_idEspecialidad_fkey` FOREIGN KEY (`idEspecialidad`) REFERENCES `especialidades`(`idEspecialidad`) ON DELETE RESTRICT ON UPDATE CASCADE;
