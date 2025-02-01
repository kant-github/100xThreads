/*
  Warnings:

  - A unique constraint covering the columns `[organization_id,user_id]` on the table `organization_users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "organization_users_organization_id_key";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_organization_id_user_id_key" ON "organization_users"("organization_id", "user_id");
