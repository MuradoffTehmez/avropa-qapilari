-- Məhsul və biznes tarixçəsi əlaqələri pozulmadan arxivlənir (PRD §95, §160).
ALTER TABLE "Product" ADD COLUMN "archivedAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "archivedAt" DATETIME;
ALTER TABLE "RepairRequest" ADD COLUMN "archivedAt" DATETIME;
ALTER TABLE "Warranty" ADD COLUMN "archivedAt" DATETIME;

CREATE INDEX "Product_archivedAt_idx" ON "Product"("archivedAt");
CREATE INDEX "Order_archivedAt_idx" ON "Order"("archivedAt");
CREATE INDEX "RepairRequest_archivedAt_idx" ON "RepairRequest"("archivedAt");
CREATE INDEX "Warranty_archivedAt_idx" ON "Warranty"("archivedAt");
