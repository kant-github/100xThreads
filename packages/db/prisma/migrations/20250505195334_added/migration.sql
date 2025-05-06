-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'FILE');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "ChatMessageOneToOne" (
    "id" UUID NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seenAt" TIMESTAMP(3),
    "messageType" "MessageType" NOT NULL DEFAULT 'TEXT',

    CONSTRAINT "ChatMessageOneToOne_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatMessageOneToOne_senderId_idx" ON "ChatMessageOneToOne"("senderId");

-- CreateIndex
CREATE INDEX "ChatMessageOneToOne_receiverId_idx" ON "ChatMessageOneToOne"("receiverId");

-- AddForeignKey
ALTER TABLE "ChatMessageOneToOne" ADD CONSTRAINT "ChatMessageOneToOne_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageOneToOne" ADD CONSTRAINT "ChatMessageOneToOne_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
