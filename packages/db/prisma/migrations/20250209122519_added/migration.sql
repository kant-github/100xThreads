-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'PENDING_INFO', 'PENDING_REVIEW', 'RESOLVED', 'CLOSED', 'REOPENED');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "issues" (
    "id" UUID NOT NULL,
    "channel_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "org_user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "issues_channel_id_idx" ON "issues"("channel_id");

-- CreateIndex
CREATE INDEX "issues_organization_id_org_user_id_idx" ON "issues"("organization_id", "org_user_id");

-- CreateIndex
CREATE INDEX "issues_status_idx" ON "issues"("status");

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_organization_id_org_user_id_fkey" FOREIGN KEY ("organization_id", "org_user_id") REFERENCES "organization_users"("organization_id", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;
