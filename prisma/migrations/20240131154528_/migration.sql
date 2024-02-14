/*
  Warnings:

  - A unique constraint covering the columns `[chargeId]` on the table `ChargeItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChargeItem_chargeId_key" ON "ChargeItem"("chargeId");
