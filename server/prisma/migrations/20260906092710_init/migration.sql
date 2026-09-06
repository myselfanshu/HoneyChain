-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BEEKEEPER', 'PROCESSOR', 'PACKER', 'DISTRIBUTOR', 'RETAILER', 'AUDITOR');

-- CreateEnum
CREATE TYPE "DataStatus" AS ENUM ('VERIFIED', 'OBSERVED', 'DEMO');

-- CreateEnum
CREATE TYPE "HiveStatus" AS ENUM ('HEALTHY', 'WATCH', 'INSPECT');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TraceabilityStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('RECORDED', 'THIRD_PARTY_CERTIFICATE', 'BLOCKCHAIN_CONFIRMED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BEEKEEPER',
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apiary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Apiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hive" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "HiveStatus" NOT NULL DEFAULT 'HEALTHY',
    "queenAgeMonths" INTEGER,
    "lastInspection" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "apiaryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelemetryReading" (
    "id" TEXT NOT NULL,
    "hiveId" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "temperatureC" DECIMAL(5,2),
    "humidityPct" DECIMAL(5,2),
    "weightKg" DECIMAL(8,2),
    "colonyActivity" DECIMAL(5,2),
    "acousticLevel" DECIMAL(8,2),
    "source" TEXT NOT NULL,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',

    CONSTRAINT "TelemetryReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "harvestDate" TIMESTAMP(3) NOT NULL,
    "hiveId" TEXT,
    "weightKg" DECIMAL(10,2) NOT NULL,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',
    "publicTokenHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "floralSource" TEXT,
    "purityPct" DECIMAL(5,2),
    "moisturePct" DECIMAL(5,2),
    "hmfMgKg" DECIMAL(8,2),
    "antibioticsDetected" BOOLEAN,
    "certificateUrl" TEXT,
    "qualityStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TraceabilityEvent" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "actorName" TEXT NOT NULL,
    "actorRole" "Role" NOT NULL,
    "location" TEXT NOT NULL,
    "status" "TraceabilityStatus" NOT NULL DEFAULT 'COMPLETED',
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',
    "verificationMethod" "VerificationMethod" NOT NULL DEFAULT 'RECORDED',
    "externalProofRef" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TraceabilityEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketProduct" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "pricePerKg" DECIMAL(10,2) NOT NULL,
    "availableWeightKg" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "sellerName" TEXT NOT NULL,
    "sellerRole" "Role" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',

    CONSTRAINT "MarketProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "hiveId" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "source" TEXT NOT NULL,
    "dataStatus" "DataStatus" NOT NULL DEFAULT 'OBSERVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSetting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" TEXT NOT NULL DEFAULT 'system',
    "alertsOn" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "TelemetryReading_hiveId_recordedAt_idx" ON "TelemetryReading"("hiveId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Batch_publicTokenHash_key" ON "Batch"("publicTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Passport_batchId_key" ON "Passport"("batchId");

-- CreateIndex
CREATE INDEX "TraceabilityEvent_batchId_occurredAt_idx" ON "TraceabilityEvent"("batchId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketProduct_batchId_key" ON "MarketProduct"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "UserSetting_userId_key" ON "UserSetting"("userId");

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hive" ADD CONSTRAINT "Hive_apiaryId_fkey" FOREIGN KEY ("apiaryId") REFERENCES "Apiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_hiveId_fkey" FOREIGN KEY ("hiveId") REFERENCES "Hive"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Passport" ADD CONSTRAINT "Passport_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TraceabilityEvent" ADD CONSTRAINT "TraceabilityEvent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketProduct" ADD CONSTRAINT "MarketProduct_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
