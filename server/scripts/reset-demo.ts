import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, DataStatus, HiveStatus, Role, TraceabilityStatus, VerificationMethod } from '@prisma/client';
import { tokenHash } from '../src/security.js';

const prisma = new PrismaClient();

async function resetDemo() {
  console.log('Resetting HoneyChain demo environment...');

  await prisma.alert.deleteMany({});
  await prisma.fieldReport.deleteMany({});
  await prisma.telemetryReading.deleteMany({});
  await prisma.traceabilityEvent.deleteMany({});
  await prisma.passport.deleteMany({});
  await prisma.marketProduct.deleteMany({});
  await prisma.batch.deleteMany({});
  await prisma.hive.deleteMany({});
  await prisma.apiary.deleteMany({});

  const ravi = await prisma.user.upsert({
    where: { email: 'ravi@example.test' },
    update: {},
    create: {
      email: 'ravi@example.test',
      passwordHash: await bcrypt.hash('ChangeMe123!', 12),
      name: 'Ravi Kumar',
      role: Role.BEEKEEPER,
      location: 'Uttar Pradesh, India',
    },
  });

  const apiary = await prisma.apiary.create({
    data: {
      id: 'apiary-up-north',
      name: 'Northern Apiary Field',
      location: 'Uttar Pradesh',
    },
  });

  const hive = await prisma.hive.create({
    data: {
      id: 'H-104',
      name: 'Hive 104',
      location: 'Sector B, Eastern Edge',
      status: HiveStatus.WATCH,
      queenAgeMonths: 14,
      lastInspection: new Date('2026-08-20T09:45:00Z'),
      ownerId: ravi.id,
      apiaryId: apiary.id,
    },
  });

  await prisma.telemetryReading.createMany({
    data: [
      {
        hiveId: hive.id,
        recordedAt: new Date('2026-09-04T08:00:00Z'),
        temperatureC: 35.1,
        humidityPct: 46,
        weightKg: 38.2,
        colonyActivity: 55,
        acousticLevel: 196.4,
        source: 'demo-seed',
        dataStatus: DataStatus.DEMO,
      },
      {
        hiveId: hive.id,
        recordedAt: new Date('2026-09-04T10:00:00Z'),
        temperatureC: 34.9,
        humidityPct: 47,
        weightKg: 38.1,
        colonyActivity: 52,
        acousticLevel: 190.0,
        source: 'demo-seed',
        dataStatus: DataStatus.DEMO,
      },
    ],
  });

  const batch = await prisma.batch.create({
    data: {
      id: 'HC-2026-0142',
      name: 'MUSTARD GOLD',
      location: 'Uttar Pradesh',
      harvestDate: new Date('2026-08-28T08:00:00Z'),
      hiveId: hive.id,
      weightKg: 18.4,
      dataStatus: DataStatus.DEMO,
      publicTokenHash: tokenHash('demo-hc-2026-0142'),
    },
  });

  await prisma.passport.create({
    data: {
      batchId: batch.id,
      floralSource: 'Mustard',
      purityPct: 99.2,
      moisturePct: 16.5,
      hmfMgKg: 12.4,
      antibioticsDetected: false,
      qualityStatus: DataStatus.DEMO,
    },
  });

  await prisma.traceabilityEvent.createMany({
    data: [
      {
        batchId: batch.id,
        stage: 'Harvest Recorded',
        description: 'Demo seed record imported from frontend mock data.',
        occurredAt: new Date('2026-08-28T08:00:00Z'),
        actorName: 'Ravi Kumar',
        actorRole: Role.BEEKEEPER,
        location: 'Uttar Pradesh',
        status: TraceabilityStatus.COMPLETED,
        dataStatus: DataStatus.DEMO,
        verificationMethod: VerificationMethod.RECORDED,
      },
      {
        batchId: batch.id,
        stage: 'Quality Check',
        description: 'Demo seed record; lab testing stage.',
        occurredAt: new Date('2026-08-28T11:16:00Z'),
        actorName: 'HoneyPure Pvt. Ltd.',
        actorRole: Role.PROCESSOR,
        location: 'Haryana Lab',
        status: TraceabilityStatus.COMPLETED,
        dataStatus: DataStatus.DEMO,
        verificationMethod: VerificationMethod.RECORDED,
      },
    ],
  });

  await prisma.marketProduct.create({
    data: {
      batchId: batch.id,
      pricePerKg: 650,
      availableWeightKg: 18.4,
      sellerName: 'Ravi Kumar',
      sellerRole: Role.BEEKEEPER,
      dataStatus: DataStatus.DEMO,
    },
  });

  await prisma.alert.create({
    data: {
      id: 'ALT-001',
      recipientId: ravi.id,
      hiveId: hive.id,
      severity: 'CRITICAL',
      title: 'Hive H-104 needs inspection',
      message: 'Colony acoustic variance detected. Inspect brood frames.',
      source: 'demo-seed',
      dataStatus: DataStatus.DEMO,
    },
  });

  console.log('Demo reset complete! Ravi Kumar ready.');
}

resetDemo()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('Reset demo error:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
