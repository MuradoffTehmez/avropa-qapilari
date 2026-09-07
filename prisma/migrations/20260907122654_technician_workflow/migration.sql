-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "declineReason" TEXT;

-- AlterTable
ALTER TABLE "MeasurementRequest" ADD COLUMN "frameDepth" INTEGER;
ALTER TABLE "MeasurementRequest" ADD COLUMN "measuredAt" DATETIME;
ALTER TABLE "MeasurementRequest" ADD COLUMN "openingDirection" TEXT;
ALTER TABLE "MeasurementRequest" ADD COLUMN "resultHeight" INTEGER;
ALTER TABLE "MeasurementRequest" ADD COLUMN "resultNote" TEXT;
ALTER TABLE "MeasurementRequest" ADD COLUMN "resultWidth" INTEGER;

-- AlterTable
ALTER TABLE "RepairRequest" ADD COLUMN "customerNote" TEXT;
ALTER TABLE "RepairRequest" ADD COLUMN "diagnosis" TEXT;
ALTER TABLE "RepairRequest" ADD COLUMN "handoverAt" DATETIME;
ALTER TABLE "RepairRequest" ADD COLUMN "labourCost" INTEGER;
ALTER TABLE "RepairRequest" ADD COLUMN "partsCost" INTEGER;
ALTER TABLE "RepairRequest" ADD COLUMN "startedAt" DATETIME;

-- CreateTable
CREATE TABLE "JobEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kind" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "actorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "JobEvent_kind_reference_idx" ON "JobEvent"("kind", "reference");

-- CreateIndex
CREATE INDEX "JobEvent_createdAt_idx" ON "JobEvent"("createdAt");
