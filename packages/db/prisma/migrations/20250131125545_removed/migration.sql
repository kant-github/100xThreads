/*
  Warnings:

  - Added the required column `organization_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_org_user_id_fkey";

-- DropIndex
DROP INDEX "organization_users_user_id_key";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "organization_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE INDEX "chats_organization_id_org_user_id_idx" ON "chats"("organization_id", "org_user_id");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_organization_id_org_user_id_fkey" FOREIGN KEY ("organization_id", "org_user_id") REFERENCES "organization_users"("organization_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
