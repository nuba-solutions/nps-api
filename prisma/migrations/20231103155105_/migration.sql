-- CreateTable
CREATE TABLE "UserPreferences" (
    "userId" INTEGER,
    "theme" TEXT NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_id_key" ON "UserPreferences"("id");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
