/*
  Warnings:

  - Made the column `eventId` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "zones" TEXT[];

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "eventId" SET NOT NULL;

-- CreateTable
CREATE TABLE "_EventsOnOffers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventsOnOffers_AB_unique" ON "_EventsOnOffers"("A", "B");

-- CreateIndex
CREATE INDEX "_EventsOnOffers_B_index" ON "_EventsOnOffers"("B");

-- AddForeignKey
ALTER TABLE "_EventsOnOffers" ADD CONSTRAINT "_EventsOnOffers_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventsOnOffers" ADD CONSTRAINT "_EventsOnOffers_B_fkey" FOREIGN KEY ("B") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
