/*
  Warnings:

  - Added the required column `organization_type` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('CORPORATE', 'NON_PROFIT', 'EDUCATIONAL', 'GOVERNMENT', 'OTHER');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "organization_type" "OrganizationType" NOT NULL;
