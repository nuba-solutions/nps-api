/*
  Warnings:

  - Added the required column `clientProviderId` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "clientProviderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_clientProviderId_fkey" FOREIGN KEY ("clientProviderId") REFERENCES "ClientProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
