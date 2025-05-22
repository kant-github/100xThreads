-- AlterTable
ALTER TABLE "event_rooms" ADD COLUMN     "google_calendar_id" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "google_event_id" TEXT,
ADD COLUMN     "meet_link" TEXT;

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
