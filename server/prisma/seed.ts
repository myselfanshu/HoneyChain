import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, DataStatus, HiveStatus, Role, TraceabilityStatus, VerificationMethod } from '@prisma/client';
import { tokenHash } from '../src/security.js';

const prisma = new PrismaClient();
async function main() {
  const ravi = await prisma.user.upsert({ where: { email: 'ravi@example.test' }, update: {}, create: { email: 'ravi@example.test', passwordHash: await bcrypt.hash('ChangeMe123!', 12), name: 'Ravi Kumar', role: Role.BEEKEEPER, location: 'Uttar Pradesh, India' } });
  const apiary = await prisma.apiary.upsert({ where: { id: 'apiary-up-north' }, update: {}, create: { id: 'apiary-up-north', name: 'Northern Field', location: 'Uttar Pradesh' } });
  const hive = await prisma.hive.upsert({ where: { id: 'H-104' }, update: {}, create: { id: 'H-104', name: 'Hive 104', location: 'Sector B, Eastern Edge', status: HiveStatus.WATCH, queenAgeMonths: 14, lastInspection: new Date('2026-08-20T09:45:00Z'), ownerId: ravi.id, apiaryId: apiary.id } });
  await prisma.telemetryReading.deleteMany({ where: { hiveId: hive.id } });
  await prisma.telemetryReading.createMany({ data: [
    { hiveId: hive.id, recordedAt: new Date('2026-09-04T08:00:00Z'), temperatureC: 35.1, humidityPct: 46, weightKg: 38.2, colonyActivity: 55, acousticLevel: 196.4, source: 'demo-seed', dataStatus: DataStatus.DEMO },
    { hiveId: hive.id, recordedAt: new Date('2026-09-04T10:00:00Z'), temperatureC: 34.9, humidityPct: 47, weightKg: 38.1, colonyActivity: 52, acousticLevel: 190, source: 'demo-seed', dataStatus: DataStatus.DEMO },
  ] });
  const batch = await prisma.batch.upsert({ where: { id: 'HC-2026-0142' }, update: { publicTokenHash: tokenHash('demo-hc-2026-0142') }, create: { id: 'HC-2026-0142', name: 'MUSTARD GOLD', location: 'Uttar Pradesh', harvestDate: new Date('2026-08-28T08:00:00Z'), hiveId: hive.id, weightKg: 18.4, dataStatus: DataStatus.DEMO, publicTokenHash: tokenHash('demo-hc-2026-0142') } });
  await prisma.passport.upsert({ where: { batchId: batch.id }, update: {}, create: { batchId: batch.id, floralSource: 'Mustard', purityPct: 99.2, moisturePct: 16.5, hmfMgKg: 12.4, antibioticsDetected: false, qualityStatus: DataStatus.DEMO } });
  await prisma.traceabilityEvent.deleteMany({ where: { batchId: batch.id } });
  await prisma.traceabilityEvent.createMany({ data: [
    { batchId: batch.id, stage: 'Harvest Recorded', description: 'Demo seed record imported from the existing frontend mock data.', occurredAt: new Date('2026-08-28T08:00:00Z'), actorName: 'Ravi Kumar', actorRole: Role.BEEKEEPER, location: 'Uttar Pradesh', status: TraceabilityStatus.COMPLETED, dataStatus: DataStatus.DEMO, verificationMethod: VerificationMethod.RECORDED },
    { batchId: batch.id, stage: 'Quality Check', description: 'Demo seed record; attach a real certificate before representing this as independently verified.', occurredAt: new Date('2026-08-28T11:16:00Z'), actorName: 'HoneyPure Pvt. Ltd.', actorRole: Role.PROCESSOR, location: 'Haryana Lab', status: TraceabilityStatus.COMPLETED, dataStatus: DataStatus.DEMO, verificationMethod: VerificationMethod.RECORDED },
  ] });
  await prisma.marketProduct.upsert({ where: { batchId: batch.id }, update: {}, create: { batchId: batch.id, pricePerKg: 650, availableWeightKg: 18.4, sellerName: 'Ravi Kumar', sellerRole: Role.BEEKEEPER, dataStatus: DataStatus.DEMO } });
  await prisma.alert.upsert({ where: { id: 'ALT-001' }, update: {}, create: { id: 'ALT-001', recipientId: ravi.id, hiveId: hive.id, severity: 'CRITICAL', title: 'Hive H-104 needs inspection', message: 'Demo alert seeded from the frontend. Confirm with physical inspection.', source: 'demo-seed', dataStatus: DataStatus.DEMO } });
}
main().then(() => prisma.$disconnect()).catch(async (error) => { console.error(error); await prisma.$disconnect(); process.exit(1); });
