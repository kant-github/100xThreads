/*
  Warnings:

  - You are about to drop the column `user_id` on the `chats` table. All the data in the column will be lost.
  - Added the required column `org_user_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_user_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "user_id",
ADD COLUMN     "org_user_id" INTEGER NOT NULL,
ADD COLUMN     "usersId" INTEGER;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE INDEX "chats_channel_id_idx" ON "chats"("channel_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_org_user_id_fkey" FOREIGN KEY ("org_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
