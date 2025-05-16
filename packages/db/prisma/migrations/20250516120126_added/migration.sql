-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- CreateTable
CREATE TABLE "organization_tags" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "organization_id" UUID NOT NULL,
    "color" VARCHAR(7),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_user_tags" (
    "id" UUID NOT NULL,
    "organization_user_id" INTEGER NOT NULL,
    "tag_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_user_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_tags_name_organization_id_key" ON "organization_tags"("name", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "organization_user_tags_organization_user_id_tag_id_key" ON "organization_user_tags"("organization_user_id", "tag_id");

-- AddForeignKey
ALTER TABLE "organization_tags" ADD CONSTRAINT "organization_tags_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_user_tags" ADD CONSTRAINT "organization_user_tags_organization_user_id_fkey" FOREIGN KEY ("organization_user_id") REFERENCES "organization_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_user_tags" ADD CONSTRAINT "organization_user_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "organization_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
