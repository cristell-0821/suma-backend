/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `empresas` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `empresas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "empresas" DROP COLUMN "approvedAt",
DROP COLUMN "isApproved";
