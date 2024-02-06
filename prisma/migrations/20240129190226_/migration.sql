/*
  Warnings:

  - You are about to drop the column `userId` on the `ClientProvider` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientProvider" DROP CONSTRAINT "ClientProvider_userId_fkey";

-- AlterTable
ALTER TABLE "ClientProvider" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_ClientProviderToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientProviderToUser_AB_unique" ON "_ClientProviderToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientProviderToUser_B_index" ON "_ClientProviderToUser"("B");

-- AddForeignKey
ALTER TABLE "_ClientProviderToUser" ADD CONSTRAINT "_ClientProviderToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientProviderToUser" ADD CONSTRAINT "_ClientProviderToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
