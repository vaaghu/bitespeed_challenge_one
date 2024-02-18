/*
  Warnings:

  - You are about to drop the `Contact` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Contact";

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "linkedId" INTEGER,
    "linkPrecedence" "linkPrecedence" NOT NULL DEFAULT 'primary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_email_phoneNumber_key" ON "contact"("email", "phoneNumber");
