-- DropForeignKey
ALTER TABLE "contact" DROP CONSTRAINT "contact_linked_id_fkey";

-- AlterTable
ALTER TABLE "contact" ALTER COLUMN "linked_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_linked_id_fkey" FOREIGN KEY ("linked_id") REFERENCES "contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
