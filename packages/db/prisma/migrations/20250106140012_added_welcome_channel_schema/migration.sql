-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('WELCOME', 'GENERAL', 'ANNOUNCEMENT', 'RESOURCE', 'HELP_DESK', 'PROJECT', 'LEARNING', 'MENTORSHIP', 'SOCIAL', 'CAREER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- AlterTable
ALTER TABLE "chat_groups" ADD COLUMN     "allowed_roles" "UserRole"[] DEFAULT ARRAY['MEMBER']::"UserRole"[],
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "ChannelType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "welcome_channels" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "welcome_message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "welcome_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_requests" (
    "id" UUID NOT NULL,
    "welcome_channel_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "requested_role" "UserRole" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "channel_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "requires_ack" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_acknowledgments" (
    "id" SERIAL NOT NULL,
    "announcement_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "acked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_acknowledgments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "welcome_channels_organization_id_key" ON "welcome_channels"("organization_id");

-- CreateIndex
CREATE INDEX "announcements_channel_id_created_at_idx" ON "announcements"("channel_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_acknowledgments_announcement_id_user_id_key" ON "announcement_acknowledgments"("announcement_id", "user_id");

-- AddForeignKey
ALTER TABLE "chat_groups" ADD CONSTRAINT "chat_groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcome_channels" ADD CONSTRAINT "welcome_channels_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_welcome_channel_id_fkey" FOREIGN KEY ("welcome_channel_id") REFERENCES "welcome_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_acknowledgments" ADD CONSTRAINT "announcement_acknowledgments_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
