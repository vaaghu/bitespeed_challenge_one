/*
  Warnings:

  - You are about to drop the column `created_At` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact" DROP COLUMN "created_At",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
