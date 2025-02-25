-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "tags" VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[];
