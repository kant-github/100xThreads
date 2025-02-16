-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "projectId" UUID;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
