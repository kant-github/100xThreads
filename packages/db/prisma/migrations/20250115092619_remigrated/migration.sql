/*
  Warnings:

  - You are about to drop the column `created_by` on the `announcements` table. All the data in the column will be lost.
  - Added the required column `creator_org_user_id` to the `announcements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "announcements" DROP COLUMN "created_by",
ADD COLUMN     "creator_org_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_creator_org_user_id_fkey" FOREIGN KEY ("creator_org_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
