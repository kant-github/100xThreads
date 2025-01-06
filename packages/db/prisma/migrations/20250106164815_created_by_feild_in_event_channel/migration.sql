-- AlterTable
ALTER TABLE "event_rooms" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AddForeignKey
ALTER TABLE "event_rooms" ADD CONSTRAINT "event_rooms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
