/*
  Warnings:

  - A unique constraint covering the columns `[name,owner_id]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_owner_id_key" ON "organizations"("name", "owner_id");
