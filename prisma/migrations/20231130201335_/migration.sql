-- CreateTable
CREATE TABLE "ClientProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ClientProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientProvider_id_key" ON "ClientProvider"("id");

-- AddForeignKey
ALTER TABLE "ClientProvider" ADD CONSTRAINT "ClientProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
