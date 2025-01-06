-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::VARCHAR(50)[];

-- AlterTable
ALTER TABLE "welcome_channels" ALTER COLUMN "welcome_message" DROP NOT NULL;

-- CreateTable
CREATE TABLE "welcomed_users" (
    "id" UUID NOT NULL,
    "welcome_channel_id" UUID NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT,
    "welcomed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "welcomed_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "welcomed_users_welcome_channel_id_user_id_key" ON "welcomed_users"("welcome_channel_id", "user_id");

-- AddForeignKey
ALTER TABLE "welcomed_users" ADD CONSTRAINT "welcomed_users_welcome_channel_id_fkey" FOREIGN KEY ("welcome_channel_id") REFERENCES "welcome_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "welcomed_users" ADD CONSTRAINT "welcomed_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
