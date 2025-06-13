/*
  Warnings:

  - A unique constraint covering the columns `[email,purchaseId,type]` on the table `EmailNotification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmailNotification_email_purchaseId_type_idx";

-- CreateIndex
CREATE UNIQUE INDEX "EmailNotification_email_purchaseId_type_key" ON "EmailNotification"("email", "purchaseId", "type");
