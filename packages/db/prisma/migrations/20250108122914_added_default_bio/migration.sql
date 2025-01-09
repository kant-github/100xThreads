-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "description" SET DEFAULT 'This is the default description for your organization 🌻',
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
