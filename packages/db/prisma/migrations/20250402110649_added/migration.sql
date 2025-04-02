-- CreateEnum
CREATE TYPE "ProjectActivityType" AS ENUM ('MEMBER_ADDED', 'MEMBER_REMOVED', 'MEMBER_ROLE_CHANGED', 'TASK_CREATED', 'TASK_ASSIGNED', 'TASK_STATUS_CHANGED', 'PROJECT_UPDATED', 'OTHER');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "project_chats" ADD COLUMN     "activity_data" JSONB,
ADD COLUMN     "activity_type" "ProjectActivityType",
ADD COLUMN     "is_activity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "related_user_id" INTEGER;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateIndex
CREATE INDEX "project_chats_is_activity_idx" ON "project_chats"("is_activity");
