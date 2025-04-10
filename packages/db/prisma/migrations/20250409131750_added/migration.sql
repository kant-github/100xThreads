-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_REQUEST_RECEIVED', 'FRIEND_REQUEST_ACCEPTED', 'FRIEND_REQUEST_REJECTED', 'FRIEND_ONLINE', 'FRIEND_MESSAGE_RECEIVED', 'ORG_INVITE_RECEIVED', 'ORG_JOIN_REQUEST_RESPONSE', 'ORG_ROLE_CHANGED', 'ORG_JOIN_REQUEST_RECEIVED', 'NEW_CHANNEL_MESSAGE', 'CHANNEL_MENTION', 'NEW_ANNOUNCEMENT', 'ANNOUNCEMENT_REQUIRING_ACK', 'EVENT_CREATED', 'EVENT_REMINDER', 'EVENT_UPDATED', 'EVENT_CANCELLED', 'PROJECT_ADDED', 'TASK_ASSIGNED', 'TASK_DUE_SOON', 'TASK_STATUS_CHANGED', 'NEW_POLL', 'POLL_ENDING_SOON', 'POLL_RESULTS', 'ISSUE_ASSIGNED', 'ISSUE_STATUS_CHANGED', 'CHAT_REACTION', 'LIKED_MESSAGE');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference_id" UUID,
    "organization_id" UUID,
    "channel_id" UUID,
    "sender_id" INTEGER,
    "metadata" JSONB,
    "action_url" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_created_at_idx" ON "notifications"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
