-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MASTER', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "UserPreferences" ALTER COLUMN "theme" DROP NOT NULL;
