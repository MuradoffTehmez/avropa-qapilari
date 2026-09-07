ALTER TABLE "Product" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'PUBLISHED';
CREATE INDEX "Product_status_idx" ON "Product"("status");
