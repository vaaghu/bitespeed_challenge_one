/*
  Warnings:

  - You are about to drop the column `contactId` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `linkPrecedence` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `contact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,phone_number]` on the table `contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `linked_id` to the `contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contact" DROP CONSTRAINT "contact_contactId_fkey";

-- DropIndex
DROP INDEX "contact_email_phoneNumber_key";

-- AlterTable
ALTER TABLE "contact" DROP COLUMN "contactId",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "linkPrecedence",
DROP COLUMN "phoneNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "link_precedence" "linkPrecedence" NOT NULL DEFAULT 'primary',
ADD COLUMN     "linked_id" INTEGER NOT NULL,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contact_email_phone_number_key" ON "contact"("email", "phone_number");

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_linked_id_fkey" FOREIGN KEY ("linked_id") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
