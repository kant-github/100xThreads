-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "organizationColor" DROP NOT NULL,
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];
