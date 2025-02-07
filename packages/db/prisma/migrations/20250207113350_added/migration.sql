-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "edited_at" TIMESTAMP(3),
ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
