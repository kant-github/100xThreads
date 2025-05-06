/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ChatMessageOneToOne` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessageOneToOne" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
