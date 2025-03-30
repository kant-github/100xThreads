/*
  Warnings:

  - You are about to drop the column `org_user_id` on the `task_assignees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[task_id,project_member_id]` on the table `task_assignees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator_id` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_member_id` to the `task_assignees` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProjectMemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "task_assignees" DROP CONSTRAINT "task_assignees_org_user_id_fkey";

-- DropIndex
DROP INDEX "task_assignees_task_id_org_user_id_key";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "creator_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "task_assignees" DROP COLUMN "org_user_id",
ADD COLUMN     "project_member_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "project_members" (
    "id" SERIAL NOT NULL,
    "project_id" UUID NOT NULL,
    "org_user_id" INTEGER NOT NULL,
    "role" "ProjectMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_org_user_id_key" ON "project_members"("project_id", "org_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "task_assignees_task_id_project_member_id_key" ON "task_assignees"("task_id", "project_member_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "organization_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_org_user_id_fkey" FOREIGN KEY ("org_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignees" ADD CONSTRAINT "task_assignees_project_member_id_fkey" FOREIGN KEY ("project_member_id") REFERENCES "project_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
