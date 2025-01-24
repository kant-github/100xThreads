/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `organization_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_org_user_id_fkey";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_user_id_key" ON "organization_users"("user_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_org_user_id_fkey" FOREIGN KEY ("org_user_id") REFERENCES "organization_users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
