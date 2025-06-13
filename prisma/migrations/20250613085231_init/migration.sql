-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Laptop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "laptopId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchase_laptopId_fkey" FOREIGN KEY ("laptopId") REFERENCES "Laptop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmailNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailNotification_email_fkey" FOREIGN KEY ("email") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmailNotification_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "EmailNotification_email_purchaseId_idx" ON "EmailNotification"("email", "purchaseId");
