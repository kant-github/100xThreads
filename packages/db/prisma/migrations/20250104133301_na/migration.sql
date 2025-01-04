/*
  Warnings:

  - Added the required column `organizationColor` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "hasPassword" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" VARCHAR(191),
ADD COLUMN     "organizationColor" VARCHAR(7) NOT NULL,
ADD COLUMN     "password" VARCHAR(191),
ADD COLUMN     "privateFlag" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" SET DEFAULT 'This is a default description for the organization, you can change it anytime';
