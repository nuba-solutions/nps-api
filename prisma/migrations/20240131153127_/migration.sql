-- DropForeignKey
ALTER TABLE "ChargeItem" DROP CONSTRAINT "ChargeItem_chargeId_fkey";

-- AddForeignKey
ALTER TABLE "ChargeItem" ADD CONSTRAINT "ChargeItem_chargeId_fkey" FOREIGN KEY ("chargeId") REFERENCES "Charge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
