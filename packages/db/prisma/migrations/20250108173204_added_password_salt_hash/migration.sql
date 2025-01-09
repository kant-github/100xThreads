/*
  Warnings:

  - You are about to drop the column `password` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "password",
ADD COLUMN     "passwordHash" VARCHAR(191),
ADD COLUMN     "passwordSalt" TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
