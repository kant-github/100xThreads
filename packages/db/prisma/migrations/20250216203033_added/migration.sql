/*
  Warnings:

  - You are about to drop the column `projectId` on the `chats` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_projectId_fkey";

-- AlterTable
ALTER TABLE "ChatReaction" ADD COLUMN     "projectChatId" UUID;

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "projectId";

-- AlterTable
ALTER TABLE "liked_users" ADD COLUMN     "projectChatId" UUID;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "project_chats" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "org_user_id" INTEGER NOT NULL,
    "message" TEXT,
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "edited_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,

    CONSTRAINT "project_chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_chats_created_at_idx" ON "project_chats"("created_at");

-- CreateIndex
CREATE INDEX "project_chats_project_id_idx" ON "project_chats"("project_id");

-- CreateIndex
CREATE INDEX "project_chats_organization_id_org_user_id_idx" ON "project_chats"("organization_id", "org_user_id");

-- AddForeignKey
ALTER TABLE "project_chats" ADD CONSTRAINT "project_chats_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_chats" ADD CONSTRAINT "project_chats_organization_id_org_user_id_fkey" FOREIGN KEY ("organization_id", "org_user_id") REFERENCES "organization_users"("organization_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_chats" ADD CONSTRAINT "project_chats_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatReaction" ADD CONSTRAINT "ChatReaction_projectChatId_fkey" FOREIGN KEY ("projectChatId") REFERENCES "project_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_users" ADD CONSTRAINT "liked_users_projectChatId_fkey" FOREIGN KEY ("projectChatId") REFERENCES "project_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
