/*
  Warnings:

  - You are about to drop the column `description` on the `OrganizationLocations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationLocations" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
