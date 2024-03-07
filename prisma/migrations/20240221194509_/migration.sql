-- CreateTable
CREATE TABLE "ClientCredential" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientProviderId" INTEGER NOT NULL,

    CONSTRAINT "ClientCredential_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClientCredential" ADD CONSTRAINT "ClientCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCredential" ADD CONSTRAINT "ClientCredential_clientProviderId_fkey" FOREIGN KEY ("clientProviderId") REFERENCES "ClientProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
