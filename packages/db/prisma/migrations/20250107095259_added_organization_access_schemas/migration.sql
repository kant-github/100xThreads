-- CreateEnum
CREATE TYPE "OrganizationAccessType" AS ENUM ('PRIVATE', 'PUBLIC', 'PASSWORD_PROTECTED', 'INVITE_ONLY', 'PUBLIC_WITH_APPROVAL');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "access_type" "OrganizationAccessType" NOT NULL DEFAULT 'PRIVATE',
ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "organization_join_requests" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "response_note" TEXT,

    CONSTRAINT "organization_join_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_invites" (
    "id" SERIAL NOT NULL,
    "organization_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "created_by_id" INTEGER NOT NULL,
    "used_by_id" INTEGER,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 1,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_join_requests_organization_id_user_id_key" ON "organization_join_requests"("organization_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_invites_code_key" ON "organization_invites"("code");

-- CreateIndex
CREATE INDEX "organization_invites_code_idx" ON "organization_invites"("code");

-- AddForeignKey
ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_join_requests" ADD CONSTRAINT "organization_join_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_invites" ADD CONSTRAINT "organization_invites_used_by_id_fkey" FOREIGN KEY ("used_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
