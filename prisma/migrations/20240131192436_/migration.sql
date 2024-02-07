/*
  Warnings:

  - The values [OPEN,PAID,PENDING,DELETED] on the enum `ChargeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChargeStatus_new" AS ENUM ('open', 'paid', 'pending', 'deleted');
ALTER TABLE "Charge" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Charge" ALTER COLUMN "status" TYPE "ChargeStatus_new" USING ("status"::text::"ChargeStatus_new");
ALTER TYPE "ChargeStatus" RENAME TO "ChargeStatus_old";
ALTER TYPE "ChargeStatus_new" RENAME TO "ChargeStatus";
DROP TYPE "ChargeStatus_old";
ALTER TABLE "Charge" ALTER COLUMN "status" SET DEFAULT 'open';
COMMIT;

-- AlterTable
ALTER TABLE "Charge" ALTER COLUMN "status" SET DEFAULT 'open';
