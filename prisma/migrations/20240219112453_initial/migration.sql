-- CreateEnum
CREATE TYPE "linkPrecedence" AS ENUM ('primary', 'secondary');

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "phone_number" TEXT,
    "email" TEXT,
    "link_precedence" "linkPrecedence" NOT NULL DEFAULT 'primary',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "linked_id" INTEGER,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_email_phone_number_key" ON "contact"("email", "phone_number");

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_linked_id_fkey" FOREIGN KEY ("linked_id") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
