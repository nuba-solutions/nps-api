-- DropIndex
DROP INDEX "User_stripeId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "stripeId" DROP DEFAULT;
