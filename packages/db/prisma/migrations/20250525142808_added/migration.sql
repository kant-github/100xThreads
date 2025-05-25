-- CreateEnum
CREATE TYPE "LocationMode" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "OrganizationLocations" (
    "id" UUID NOT NULL,
    "mode" "LocationMode" NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "OrganizationLocations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationLocations_organization_id_idx" ON "OrganizationLocations"("organization_id");

-- AddForeignKey
ALTER TABLE "OrganizationLocations" ADD CONSTRAINT "OrganizationLocations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
