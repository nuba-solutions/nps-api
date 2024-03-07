/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `ClientCredential` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientCredential_clientId_key" ON "ClientCredential"("clientId");
