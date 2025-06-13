/*
  Warnings:

  - Added the required column `type` to the `EmailNotification` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EmailNotification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "purchaseId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailNotification_email_fkey" FOREIGN KEY ("email") REFERENCES "User" ("email") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EmailNotification_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EmailNotification" ("createdAt", "email", "id", "purchaseId", "updatedAt") SELECT "createdAt", "email", "id", "purchaseId", "updatedAt" FROM "EmailNotification";
DROP TABLE "EmailNotification";
ALTER TABLE "new_EmailNotification" RENAME TO "EmailNotification";
CREATE INDEX "EmailNotification_email_purchaseId_type_idx" ON "EmailNotification"("email", "purchaseId", "type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
