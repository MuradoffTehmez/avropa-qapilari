-- AlterTable
ALTER TABLE "RepairRequest" ADD COLUMN "completedAt" DATETIME;
ALTER TABLE "RepairRequest" ADD COLUMN "resolution" TEXT;
ALTER TABLE "RepairRequest" ADD COLUMN "usedParts" TEXT;
