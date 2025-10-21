/*
  Warnings:

  - You are about to drop the column `eventId` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `_EventsOnOffers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_eventId_fkey";

-- DropForeignKey
ALTER TABLE "_EventsOnOffers" DROP CONSTRAINT "_EventsOnOffers_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventsOnOffers" DROP CONSTRAINT "_EventsOnOffers_B_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "eventId";

-- DropTable
DROP TABLE "_EventsOnOffers";
