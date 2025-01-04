-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
