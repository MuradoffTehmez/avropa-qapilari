-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuoteRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "productId" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "amount" INTEGER,
    "validUntil" TEXT,
    "adminNote" TEXT,
    "sentAt" DATETIME,
    "respondedAt" DATETIME,
    "orderId" TEXT,
    "archivedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuoteRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuoteRequest_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "QuoteRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_QuoteRequest" ("adminNote", "amount", "archivedAt", "createdAt", "email", "height", "id", "message", "name", "number", "orderId", "phone", "productId", "respondedAt", "sentAt", "status", "userId", "validUntil", "width") SELECT "adminNote", "amount", "archivedAt", "createdAt", "email", "height", "id", "message", "name", "number", "orderId", "phone", "productId", "respondedAt", "sentAt", "status", "userId", "validUntil", "width" FROM "QuoteRequest";
DROP TABLE "QuoteRequest";
ALTER TABLE "new_QuoteRequest" RENAME TO "QuoteRequest";
CREATE UNIQUE INDEX "QuoteRequest_number_key" ON "QuoteRequest"("number");
CREATE UNIQUE INDEX "QuoteRequest_orderId_key" ON "QuoteRequest"("orderId");
CREATE INDEX "QuoteRequest_status_idx" ON "QuoteRequest"("status");
CREATE INDEX "QuoteRequest_archivedAt_idx" ON "QuoteRequest"("archivedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
