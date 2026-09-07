-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "archivedAt" DATETIME;

-- AlterTable
ALTER TABLE "MeasurementRequest" ADD COLUMN "archivedAt" DATETIME;

-- AlterTable
ALTER TABLE "QuoteRequest" ADD COLUMN "archivedAt" DATETIME;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "archivedAt" DATETIME;

-- AlterTable
ALTER TABLE "Technician" ADD COLUMN "archivedAt" DATETIME;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "deactivatedAt" DATETIME;

-- CreateIndex
CREATE INDEX "Appointment_archivedAt_idx" ON "Appointment"("archivedAt");

-- CreateIndex
CREATE INDEX "MeasurementRequest_archivedAt_idx" ON "MeasurementRequest"("archivedAt");

-- CreateIndex
CREATE INDEX "QuoteRequest_archivedAt_idx" ON "QuoteRequest"("archivedAt");

-- CreateIndex
CREATE INDEX "Review_archivedAt_idx" ON "Review"("archivedAt");

-- CreateIndex
CREATE INDEX "Technician_archivedAt_idx" ON "Technician"("archivedAt");

-- CreateIndex
CREATE INDEX "User_deactivatedAt_idx" ON "User"("deactivatedAt");
