/*
  Warnings:

  - You are about to drop the column `group_id` on the `chats` table. All the data in the column will be lost.
  - Added the required column `channel_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_group_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "group_id",
ADD COLUMN     "channel_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
