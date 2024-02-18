/*
  Warnings:

  - You are about to drop the column `linkedId` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact" DROP COLUMN "linkedId";

-- CreateTable
CREATE TABLE "_id" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_id_AB_unique" ON "_id"("A", "B");

-- CreateIndex
CREATE INDEX "_id_B_index" ON "_id"("B");

-- AddForeignKey
ALTER TABLE "_id" ADD CONSTRAINT "_id_A_fkey" FOREIGN KEY ("A") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_id" ADD CONSTRAINT "_id_B_fkey" FOREIGN KEY ("B") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
