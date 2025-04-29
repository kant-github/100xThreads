/*
  Warnings:

  - You are about to drop the column `org_user_id` on the `project_chats` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `project_chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "project_chats" DROP CONSTRAINT "project_chats_organization_id_org_user_id_fkey";

-- DropIndex
DROP INDEX "project_chats_organization_id_org_user_id_idx";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "project_chats" DROP COLUMN "org_user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE INDEX "project_chats_organization_id_user_id_idx" ON "project_chats"("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "project_chats" ADD CONSTRAINT "project_chats_organization_id_user_id_fkey" FOREIGN KEY ("organization_id", "user_id") REFERENCES "organization_users"("organization_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
