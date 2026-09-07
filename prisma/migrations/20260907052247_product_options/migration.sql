-- CreateTable
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "optionValueId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductOption_optionValueId_fkey" FOREIGN KEY ("optionValueId") REFERENCES "OptionValue" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProductOption_productId_enabled_idx" ON "ProductOption"("productId", "enabled");

-- CreateIndex
CREATE INDEX "ProductOption_optionValueId_idx" ON "ProductOption"("optionValueId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductOption_productId_optionValueId_key" ON "ProductOption"("productId", "optionValueId");
