/*
  Warnings:

  - You are about to drop the `_id` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactId` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_id" DROP CONSTRAINT "_id_A_fkey";

-- DropForeignKey
ALTER TABLE "_id" DROP CONSTRAINT "_id_B_fkey";

-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "contactId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_id";

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
