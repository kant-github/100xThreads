-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "RSVPStatus" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('COMMUNITY', 'STARTUP', 'CORPORATE', 'NON_PROFIT', 'EDUCATIONAL', 'GOVERNMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'LIVE', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EVENT_MANAGER', 'MODERATOR', 'MEMBER', 'GUEST', 'ORGANIZER', 'OBSERVER', 'IT_SUPPORT', 'HR_MANAGER', 'FINANCE_MANAGER');

-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('WELCOME', 'GENERAL', 'ANNOUNCEMENT', 'RESOURCE', 'HELP_DESK', 'PROJECT', 'LEARNING', 'MENTORSHIP', 'SOCIAL', 'CAREER');

-- CreateEnum
CREATE TYPE "OrganizationAccessType" AS ENUM ('PRIVATE', 'PUBLIC', 'INVITE_ONLY');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "provider" TEXT NOT NULL,
    "oauth_id" TEXT NOT NULL,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT DEFAULT 'This is the default description for your organization 🌻',
    "owner_id" INTEGER NOT NULL,
    "access_type" "OrganizationAccessType" NOT NULL DEFAULT 'PRIVATE',
    "privateFlag" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" VARCHAR(191),
    "passwordSalt" TEXT,
    "image" VARCHAR(191),
    "organizationColor" VARCHAR(7),
    "organization_type" "OrganizationType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_join_requests" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "response_note" TEXT,

    CONSTRAINT "organization_join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_invites" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "used_by_id" INTEGER,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_users" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_groups" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "type" "ChannelType" NOT NULL DEFAULT 'GENERAL',
    "passcode" VARCHAR(20),
    "groupImage" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "allowed_roles" "UserRole"[] DEFAULT ARRAY['MEMBER']::"UserRole"[],
    "description" TEXT,

    CONSTRAINT "chat_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rooms" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,

    CONSTRAINT "event_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcome_channels" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "welcome_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "welcome_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcomed_users" (
    "id" UUID NOT NULL,
    "welcome_channel_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT,
    "welcomed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "welcomed_users_pkey" PRIMARY KEY ("id")
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
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "creator_org_user_id" INTEGER NOT NULL,
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

-- CreateTable
CREATE TABLE "chats" (
    "id" UUID NOT NULL,
    "channel_id" UUID NOT NULL,
    "org_user_id" INTEGER NOT NULL,
    "message" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usersId" INTEGER,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatReaction" (
    "id" UUID NOT NULL,
    "chat_id" UUID NOT NULL,
    "emoji" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatReaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_users" (
    "id" SERIAL NOT NULL,
    "message_id" UUID NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liked_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recently_joined_groups" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" UUID NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recently_joined_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "event_room_id" UUID NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3),
    "location" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "rsvp_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendees" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "event_id" UUID NOT NULL,
    "status" "RSVPStatus" NOT NULL,

    CONSTRAINT "event_attendees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_owner_id_key" ON "organizations"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_join_requests_organization_id_user_id_key" ON "organization_join_requests"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_invites_code_key" ON "organization_invites"("code");

-- CreateIndex
CREATE INDEX "organization_invites_code_idx" ON "organization_invites"("code");

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_user_id_key" ON "organization_users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_users_organization_id_user_id_key" ON "organization_users"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "chat_groups_organization_id_created_at_idx" ON "chat_groups"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "event_rooms_organization_id_idx" ON "event_rooms"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "welcome_channels_organization_id_key" ON "welcome_channels"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "welcomed_users_welcome_channel_id_user_id_key" ON "welcomed_users"("welcome_channel_id", "user_id");

-- CreateIndex
CREATE INDEX "announcements_channel_id_created_at_idx" ON "announcements"("channel_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_acknowledgments_announcement_id_user_id_key" ON "announcement_acknowledgments"("announcement_id", "user_id");

-- CreateIndex
CREATE INDEX "chats_created_at_idx" ON "chats"("created_at");

-- CreateIndex
CREATE INDEX "chats_channel_id_idx" ON "chats"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "liked_users_message_id_user_id_key" ON "liked_users"("message_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "recently_joined_groups_user_id_group_id_key" ON "recently_joined_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "events_event_room_id_start_time_idx" ON "events"("event_room_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendees_user_id_event_id_key" ON "event_attendees"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_used_by_id_fkey" FOREIGN KEY ("used_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_users" ADD CONSTRAINT "organization_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_groups" ADD CONSTRAINT "chat_groups_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_groups" ADD CONSTRAINT "chat_groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rooms" ADD CONSTRAINT "event_rooms_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rooms" ADD CONSTRAINT "event_rooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcome_channels" ADD CONSTRAINT "welcome_channels_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcomed_users" ADD CONSTRAINT "welcomed_users_welcome_channel_id_fkey" FOREIGN KEY ("welcome_channel_id") REFERENCES "welcome_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcomed_users" ADD CONSTRAINT "welcomed_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_requests" ADD CONSTRAINT "role_requests_welcome_channel_id_fkey" FOREIGN KEY ("welcome_channel_id") REFERENCES "welcome_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_creator_org_user_id_fkey" FOREIGN KEY ("creator_org_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_acknowledgments" ADD CONSTRAINT "announcement_acknowledgments_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_org_user_id_fkey" FOREIGN KEY ("org_user_id") REFERENCES "organization_users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatReaction" ADD CONSTRAINT "ChatReaction_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatReaction" ADD CONSTRAINT "ChatReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_users" ADD CONSTRAINT "liked_users_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_users" ADD CONSTRAINT "liked_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recently_joined_groups" ADD CONSTRAINT "recently_joined_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recently_joined_groups" ADD CONSTRAINT "recently_joined_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "chat_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_event_room_id_fkey" FOREIGN KEY ("event_room_id") REFERENCES "event_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendees" ADD CONSTRAINT "event_attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
