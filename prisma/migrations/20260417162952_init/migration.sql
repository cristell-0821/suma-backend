-- CreateEnum
CREATE TYPE "Role" AS ENUM ('POSTULANTE', 'EMPRESA', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('ENVIADO', 'EN_REVISION', 'ENTREVISTA', 'RECHAZADO', 'CONTRATADO');

-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('REMOTO', 'HIBRIDO', 'PRESENCIAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postulantes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "ciudad" TEXT,
    "skills" TEXT[],
    "cvUrl" TEXT,
    "modalidadPreferida" "Modality",
    "sectorPreferido" TEXT,
    "ciudadPreferida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postulantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "tamaño" TEXT NOT NULL,
    "descripcion" TEXT,
    "sitioWeb" TEXT,
    "ciudad" TEXT,
    "direccion" TEXT,
    "nombreContacto" TEXT NOT NULL,
    "cargoContacto" TEXT,
    "telefonoContacto" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "accommodations" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disabilities" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "disabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_offers" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "requisitos" TEXT[],
    "funciones" TEXT[],
    "modalidad" "Modality" NOT NULL,
    "sector" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "salarioMin" INTEGER,
    "salarioMax" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "postulanteId" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'ENVIADO',
    "mensaje" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_jobs" (
    "id" TEXT NOT NULL,
    "postulanteId" TEXT NOT NULL,
    "jobOfferId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DisabilityToPostulante" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DisabilityToPostulante_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DisabilityToJobOffer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DisabilityToJobOffer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "postulantes_userId_key" ON "postulantes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_userId_key" ON "empresas"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_ruc_key" ON "empresas"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "disabilities_nombre_key" ON "disabilities"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "applications_postulanteId_jobOfferId_key" ON "applications"("postulanteId", "jobOfferId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_postulanteId_jobOfferId_key" ON "saved_jobs"("postulanteId", "jobOfferId");

-- CreateIndex
CREATE INDEX "_DisabilityToPostulante_B_index" ON "_DisabilityToPostulante"("B");

-- CreateIndex
CREATE INDEX "_DisabilityToJobOffer_B_index" ON "_DisabilityToJobOffer"("B");

-- AddForeignKey
ALTER TABLE "postulantes" ADD CONSTRAINT "postulantes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_postulanteId_fkey" FOREIGN KEY ("postulanteId") REFERENCES "postulantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_postulanteId_fkey" FOREIGN KEY ("postulanteId") REFERENCES "postulantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_jobOfferId_fkey" FOREIGN KEY ("jobOfferId") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisabilityToPostulante" ADD CONSTRAINT "_DisabilityToPostulante_A_fkey" FOREIGN KEY ("A") REFERENCES "disabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisabilityToPostulante" ADD CONSTRAINT "_DisabilityToPostulante_B_fkey" FOREIGN KEY ("B") REFERENCES "postulantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisabilityToJobOffer" ADD CONSTRAINT "_DisabilityToJobOffer_A_fkey" FOREIGN KEY ("A") REFERENCES "disabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisabilityToJobOffer" ADD CONSTRAINT "_DisabilityToJobOffer_B_fkey" FOREIGN KEY ("B") REFERENCES "job_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
