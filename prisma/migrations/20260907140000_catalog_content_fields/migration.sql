-- AlterTable
ALTER TABLE "OptionValue" ADD COLUMN "badge" TEXT;
ALTER TABLE "OptionValue" ADD COLUMN "requiresGroup" TEXT;
ALTER TABLE "OptionValue" ADD COLUMN "swatch" TEXT;

-- CreateTable
CREATE TABLE "OptionGroup" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "hint" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "multi" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "SizePreset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Brand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "founded" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Brand" ("country", "founded", "id", "name", "slug") SELECT "country", "founded", "id", "name", "slug" FROM "Brand";
DROP TABLE "Brand";
ALTER TABLE "new_Brand" RENAME TO "Brand";
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "accent" TEXT NOT NULL DEFAULT 'var(--color-graphite)'
);
INSERT INTO "new_Category" ("id", "name", "slug") SELECT "id", "name", "slug" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "basePrice" INTEGER NOT NULL,
    "oldPrice" INTEGER,
    "material" TEXT NOT NULL,
    "securityClass" TEXT NOT NULL,
    "fireRating" TEXT,
    "soundInsulationDb" INTEGER NOT NULL,
    "thermalW" REAL NOT NULL DEFAULT 0,
    "warrantyYears" INTEGER NOT NULL,
    "style" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "isBestseller" BOOLEAN NOT NULL DEFAULT false,
    "onSale" BOOLEAN NOT NULL DEFAULT false,
    "hasGlass" BOOLEAN NOT NULL DEFAULT false,
    "smartLockReady" BOOLEAN NOT NULL DEFAULT false,
    "customSizeAvailable" BOOLEAN NOT NULL DEFAULT true,
    "installationAvailable" BOOLEAN NOT NULL DEFAULT false,
    "madeToOrder" BOOLEAN NOT NULL DEFAULT false,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "defaultWidth" INTEGER NOT NULL,
    "defaultHeight" INTEGER NOT NULL,
    "minWidth" INTEGER NOT NULL,
    "maxWidth" INTEGER NOT NULL,
    "minHeight" INTEGER NOT NULL,
    "maxHeight" INTEGER NOT NULL,
    "deliveryDaysMin" INTEGER NOT NULL,
    "deliveryDaysMax" INTEGER NOT NULL,
    "optionGroups" TEXT NOT NULL,
    "panelHexes" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "specs" TEXT NOT NULL DEFAULT '[]',
    "documents" TEXT NOT NULL DEFAULT '[]',
    "archivedAt" DATETIME,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("archivedAt", "basePrice", "brandId", "categoryId", "collection", "defaultHeight", "defaultWidth", "deliveryDaysMax", "deliveryDaysMin", "fireRating", "id", "inStock", "isBestseller", "isNew", "material", "maxHeight", "maxWidth", "minHeight", "minWidth", "name", "oldPrice", "onSale", "optionGroups", "panelHexes", "rating", "reviewCount", "securityClass", "sku", "slug", "soundInsulationDb", "status", "style", "warrantyYears") SELECT "archivedAt", "basePrice", "brandId", "categoryId", "collection", "defaultHeight", "defaultWidth", "deliveryDaysMax", "deliveryDaysMin", "fireRating", "id", "inStock", "isBestseller", "isNew", "material", "maxHeight", "maxWidth", "minHeight", "minWidth", "name", "oldPrice", "onSale", "optionGroups", "panelHexes", "rating", "reviewCount", "securityClass", "sku", "slug", "soundInsulationDb", "status", "style", "warrantyYears" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");
CREATE INDEX "Product_basePrice_idx" ON "Product"("basePrice");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_archivedAt_idx" ON "Product"("archivedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SizePreset_width_height_key" ON "SizePreset"("width", "height");
