-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_creator_id_fkey";

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
