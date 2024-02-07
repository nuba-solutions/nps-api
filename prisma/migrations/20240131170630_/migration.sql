-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('OPEN', 'PAID', 'PENDING', 'DELETED');

-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "status" "ChargeStatus" NOT NULL DEFAULT 'OPEN';
