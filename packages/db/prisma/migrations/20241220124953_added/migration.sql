/*
  Warnings:

  - The `role` column on the `organization_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'MEMBER', 'GUEST', 'ORGANIZER', 'OBSERVER', 'IT_SUPPORT', 'HR_MANAGER', 'FINANCE_MANAGER');

-- AlterTable
ALTER TABLE "organization_users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'MEMBER';
