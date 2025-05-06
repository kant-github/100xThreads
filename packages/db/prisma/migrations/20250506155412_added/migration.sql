-- AlterTable
ALTER TABLE "ChatMessageOneToOne" ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
