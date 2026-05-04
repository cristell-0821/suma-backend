/*
  Warnings:

  - You are about to drop the column `ciudad` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `job_offers` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `job_offers` table. All the data in the column will be lost.
  - You are about to drop the column `ciudad` on the `postulantes` table. All the data in the column will be lost.
  - You are about to drop the column `ciudadPreferida` on the `postulantes` table. All the data in the column will be lost.
  - You are about to drop the column `sectorPreferido` on the `postulantes` table. All the data in the column will be lost.
  - Added the required column `ciudadId` to the `job_offers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectorId` to the `job_offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "ciudad",
DROP COLUMN "sector",
ADD COLUMN     "ciudadId" TEXT,
ADD COLUMN     "sectorId" TEXT;

-- AlterTable
ALTER TABLE "job_offers" DROP COLUMN "ciudad",
DROP COLUMN "sector",
ADD COLUMN     "ciudadId" TEXT NOT NULL,
ADD COLUMN     "sectorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "postulantes" DROP COLUMN "ciudad",
DROP COLUMN "ciudadPreferida",
DROP COLUMN "sectorPreferido",
ADD COLUMN     "ciudadId" TEXT,
ADD COLUMN     "ciudadPreferidaId" TEXT,
ADD COLUMN     "sectorId" TEXT;

-- CreateTable
CREATE TABLE "departamentos" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ciudades" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "departamentoId" TEXT NOT NULL,

    CONSTRAINT "ciudades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sectores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "sectores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "departamentos_nombre_key" ON "departamentos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ciudades_nombre_departamentoId_key" ON "ciudades"("nombre", "departamentoId");

-- CreateIndex
CREATE UNIQUE INDEX "sectores_nombre_key" ON "sectores"("nombre");

-- AddForeignKey
ALTER TABLE "ciudades" ADD CONSTRAINT "ciudades_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulantes" ADD CONSTRAINT "postulantes_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "ciudades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulantes" ADD CONSTRAINT "postulantes_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postulantes" ADD CONSTRAINT "postulantes_ciudadPreferidaId_fkey" FOREIGN KEY ("ciudadPreferidaId") REFERENCES "ciudades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "ciudades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_ciudadId_fkey" FOREIGN KEY ("ciudadId") REFERENCES "ciudades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
