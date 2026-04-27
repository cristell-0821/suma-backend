-- AlterTable
ALTER TABLE "empresas" ALTER COLUMN "razonSocial" DROP NOT NULL,
ALTER COLUMN "ruc" DROP NOT NULL,
ALTER COLUMN "sector" DROP NOT NULL,
ALTER COLUMN "tamaño" DROP NOT NULL,
ALTER COLUMN "nombreContacto" DROP NOT NULL,
ALTER COLUMN "telefonoContacto" DROP NOT NULL;

-- AlterTable
ALTER TABLE "postulantes" ADD COLUMN     "fotoPerfil" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "salarioEsperado" INTEGER,
ADD COLUMN     "sobreMi" TEXT;
