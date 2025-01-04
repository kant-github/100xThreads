-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "tags" VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[];
