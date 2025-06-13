-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Purchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "laptopId" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Purchase_laptopId_fkey" FOREIGN KEY ("laptopId") REFERENCES "Laptop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Purchase" ("amount", "createdAt", "id", "laptopId", "userId") SELECT "amount", "createdAt", "id", "laptopId", "userId" FROM "Purchase";
DROP TABLE "Purchase";
ALTER TABLE "new_Purchase" RENAME TO "Purchase";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
