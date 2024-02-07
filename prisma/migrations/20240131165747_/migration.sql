-- DropForeignKey
ALTER TABLE "Charge" DROP CONSTRAINT "Charge_clientProviderId_fkey";

-- AlterTable
ALTER TABLE "Charge" ALTER COLUMN "clientProviderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_clientProviderId_fkey" FOREIGN KEY ("clientProviderId") REFERENCES "ClientProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
