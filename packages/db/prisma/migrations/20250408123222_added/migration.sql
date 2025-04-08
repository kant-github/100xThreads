-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "friend_requests" (
    "id" UUID NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "reciever_id" INTEGER NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT,

    CONSTRAINT "friend_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendships" (
    "id" UUID NOT NULL,
    "user_id_1" INTEGER NOT NULL,
    "user_id_2" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_message_at" TIMESTAMP(3),

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friend_requests_sender_id_idx" ON "friend_requests"("sender_id");

-- CreateIndex
CREATE INDEX "friend_requests_reciever_id_idx" ON "friend_requests"("reciever_id");

-- CreateIndex
CREATE INDEX "friend_requests_status_idx" ON "friend_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friend_requests_sender_id_reciever_id_key" ON "friend_requests"("sender_id", "reciever_id");

-- CreateIndex
CREATE INDEX "friendships_user_id_1_idx" ON "friendships"("user_id_1");

-- CreateIndex
CREATE INDEX "friendships_user_id_2_idx" ON "friendships"("user_id_2");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_user_id_1_user_id_2_key" ON "friendships"("user_id_1", "user_id_2");

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friend_requests" ADD CONSTRAINT "friend_requests_reciever_id_fkey" FOREIGN KEY ("reciever_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_1_fkey" FOREIGN KEY ("user_id_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_user_id_2_fkey" FOREIGN KEY ("user_id_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
