/*
  Warnings:

  - The values [PASSWORD_PROTECTED,PUBLIC_WITH_APPROVAL] on the enum `OrganizationAccessType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hasPassword` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationAccessType_new" AS ENUM ('PRIVATE', 'PUBLIC', 'INVITE_ONLY');
ALTER TABLE "organizations" ALTER COLUMN "access_type" DROP DEFAULT;
ALTER TABLE "organizations" ALTER COLUMN "access_type" TYPE "OrganizationAccessType_new" USING ("access_type"::text::"OrganizationAccessType_new");
ALTER TYPE "OrganizationAccessType" RENAME TO "OrganizationAccessType_old";
ALTER TYPE "OrganizationAccessType_new" RENAME TO "OrganizationAccessType";
DROP TYPE "OrganizationAccessType_old";
ALTER TABLE "organizations" ALTER COLUMN "access_type" SET DEFAULT 'PRIVATE';
COMMIT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "hasPassword",
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
