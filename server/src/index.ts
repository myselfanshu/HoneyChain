import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { Prisma, PrismaClient, Role, DataStatus, HiveStatus, TraceabilityStatus, VerificationMethod, AlertSeverity } from '@prisma/client';
import { z } from 'zod';
import { tokenHash, hashPassword, comparePassword, verifyCaptcha } from './security.js';

const prisma = new PrismaClient();
const app = express();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === 'production') throw new Error('JWT_SECRET is required in production');
const signingSecret = jwtSecret || 'development-only-change-me';

type AuthUser = { id: string; role: Role | 'GUEST'; email: string; isGuest?: boolean };
declare global { namespace Express { interface Request { auth?: AuthUser } } }

const toJson = <T>(value: T): T => JSON.parse(JSON.stringify(value, (_key, item) =>
  item instanceof Prisma.Decimal ? item.toNumber() : item,
));
const routeParam = (req: Request, name: string): string => {
  const value = req.params[name];
  return Array.isArray(value) ? value[0] || '' : value || '';
};

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: (process.env.WEB_ORIGIN || 'http://localhost:5173').split(','), credentials: true }));
app.use(express.json({ limit: '100kb' }));

// General API rate limit
app.use('/v1', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }));

// Strict auth rate limit (prevents brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes.' },
});

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const raw = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!raw) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.auth = jwt.verify(raw, signingSecret) as AuthUser;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// For routes that allow guest tokens as well as user tokens
const verifyAnyToken = (req: Request, res: Response, next: NextFunction) => {
  const raw = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!raw) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.auth = jwt.verify(raw, signingSecret) as AuthUser;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Reject guest tokens for write/private routes
const requireAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth || req.auth.isGuest) {
    return res.status(403).json({ error: 'Guests cannot perform this action. Please sign in or create an account.' });
  }
  next();
};

const requireRole = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) =>
  !req.auth || req.auth.isGuest || !roles.includes(req.auth.role as Role)
    ? res.status(403).json({ error: 'Insufficient permissions' })
    : next();

const parse = <T>(schema: z.ZodType<T>, input: unknown, res: Response): T | undefined => {
  const result = schema.safeParse(input);
  if (!result.success) { res.status(400).json({ error: 'Invalid request', details: result.error.flatten() }); return; }
  return result.data;
};

// ─── Health ───────────────────────────────────────────────────────────────────
app.get(['/health', '/v1/health'], (_req, res) => res.json({ status: 'ok', captchaConfigured: !!process.env.CAPTCHA_SECRET_KEY }));

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

// POST /v1/auth/register — create new account
app.post('/v1/auth/register', authLimiter, async (req, res) => {
  const body = parse(
    z.object({
      name: z.string().min(2).max(100).trim(),
      email: z.string().email().max(254).toLowerCase().trim(),
      password: z.string().min(8).max(128),
      confirmPassword: z.string().min(8).max(128),
      role: z.enum(['BEEKEEPER', 'ADMIN', 'AUDITOR', 'PROCESSOR', 'PACKER', 'DISTRIBUTOR', 'RETAILER']).default('BEEKEEPER'),
      captchaToken: z.string().optional(),
    }),
    req.body,
    res
  );
  if (!body) return;

  if (body.password !== body.confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // CAPTCHA verification
  const captcha = await verifyCaptcha(body.captchaToken, req.ip);
  if (!captcha.success) {
    return res.status(400).json({ error: captcha.message || 'CAPTCHA verification failed' });
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await hashPassword(body.password);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role as Role,
    },
  });

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, isGuest: false },
    signingSecret,
    { expiresIn: '8h' }
  );

  res.status(201).json({
    accessToken,
    captchaDemoMode: captcha.isDemo,
    user: toJson({ id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, isGuest: false }),
  });
});

// POST /v1/auth/login — sign in with email + password
app.post('/v1/auth/login', authLimiter, async (req, res) => {
  const body = parse(
    z.object({
      email: z.string().email().max(254).toLowerCase().trim(),
      password: z.string().min(1).max(128),
      captchaToken: z.string().optional(),
    }),
    req.body,
    res
  );
  if (!body) return;

  // CAPTCHA verification
  const captcha = await verifyCaptcha(body.captchaToken, req.ip);
  if (!captcha.success) {
    return res.status(400).json({ error: captcha.message || 'CAPTCHA verification failed' });
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } });
  const passwordValid = user ? await comparePassword(body.password, user.passwordHash) : false;

  // Constant-time response: always run comparePassword to prevent timing attacks
  if (!user || !passwordValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, isGuest: false },
    signingSecret,
    { expiresIn: '8h' }
  );

  res.json({
    accessToken,
    captchaDemoMode: captcha.isDemo,
    user: toJson({ id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, isGuest: false }),
  });
});

// POST /v1/auth/guest — issue a limited-privilege guest token
app.post('/v1/auth/guest', authLimiter, async (req, res) => {
  const body = parse(z.object({ captchaToken: z.string().optional() }), req.body, res);
  if (!body) return;

  const captcha = await verifyCaptcha(body.captchaToken, req.ip);
  if (!captcha.success) {
    return res.status(400).json({ error: captcha.message || 'CAPTCHA verification failed' });
  }

  // Guest token: not tied to a DB user, limited role
  const guestToken = jwt.sign(
    { id: 'guest', email: 'guest@honeychain.local', role: 'GUEST', isGuest: true },
    signingSecret,
    { expiresIn: '4h' }
  );

  res.json({
    accessToken: guestToken,
    captchaDemoMode: captcha.isDemo,
    user: { id: 'guest', name: 'Guest Explorer', email: null, role: 'GUEST', isGuest: true, location: null },
  });
});

// GET /v1/auth/me — return current user profile
app.get('/v1/auth/me', verifyAnyToken, async (req, res) => {
  if (req.auth?.isGuest) {
    return res.json({ id: 'guest', name: 'Guest Explorer', email: null, role: 'GUEST', isGuest: true, location: null });
  }
  const user = await prisma.user.findUnique({ where: { id: req.auth!.id } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(toJson({ id: user.id, name: user.name, email: user.email, role: user.role, location: user.location, isGuest: false }));
});

// POST /v1/auth/logout — client-side JWT invalidation (instruct frontend to clear token)
app.post('/v1/auth/logout', (_req, res) => {
  res.json({ message: 'Logged out. Please clear your authentication token.' });
});

// ─── Hive Endpoints (Fully Owned & Scoped) ───────────────────────────────────

// GET /v1/hives — list authenticated user's hives
app.get('/v1/hives', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const where = req.auth!.role === Role.ADMIN ? {} : { ownerId: req.auth!.id };
  const hives = await prisma.hive.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      telemetry: { take: 1, orderBy: { recordedAt: 'desc' } },
      apiary: true,
    },
  });
  res.json(toJson(hives));
});

// POST /v1/hives — create a new hive for the authenticated user
app.post('/v1/hives', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const body = parse(
    z.object({
      id: z.string().min(2).max(40).optional(),
      name: z.string().min(2).max(100).trim(),
      location: z.string().min(2).max(160).trim(),
      status: z.nativeEnum(HiveStatus).default(HiveStatus.HEALTHY),
      queenAgeMonths: z.number().int().min(0).max(120).optional(),
      lastInspection: z.coerce.date().optional(),
      apiaryName: z.string().max(100).optional(),
    }),
    req.body,
    res
  );
  if (!body) return;

  // Derive unique hive ID if not provided
  const hiveId = body.id?.trim() || `H-${Math.floor(100 + Math.random() * 900)}`;

  // Check if ID already in use
  const existing = await prisma.hive.findUnique({ where: { id: hiveId } });
  if (existing) {
    return res.status(409).json({ error: `Hive ID '${hiveId}' already exists. Please choose another ID.` });
  }

  // Handle optional apiary creation/linking
  let apiaryId: string | undefined = undefined;
  if (body.apiaryName?.trim()) {
    const apiary = await prisma.apiary.create({
      data: {
        name: body.apiaryName.trim(),
        location: body.location,
      },
    });
    apiaryId = apiary.id;
  }

  // Always bind ownerId to authenticated user from JWT
  const hive = await prisma.hive.create({
    data: {
      id: hiveId,
      name: body.name,
      location: body.location,
      status: body.status,
      queenAgeMonths: body.queenAgeMonths,
      lastInspection: body.lastInspection || new Date(),
      ownerId: req.auth!.id,
      apiaryId,
    },
    include: {
      telemetry: { take: 1, orderBy: { recordedAt: 'desc' } },
      apiary: true,
    },
  });

  res.status(201).json(toJson(hive));
});

// GET /v1/hives/:hiveId — get single hive (owner or ADMIN)
app.get('/v1/hives/:hiveId', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const hiveId = routeParam(req, 'hiveId');
  const where = req.auth!.role === Role.ADMIN ? { id: hiveId } : { id: hiveId, ownerId: req.auth!.id };
  const hive = await prisma.hive.findFirst({
    where,
    include: {
      telemetry: { orderBy: { recordedAt: 'desc' }, take: 168 },
      apiary: true,
      batches: { orderBy: { harvestDate: 'desc' } },
    },
  });
  if (!hive) return res.status(404).json({ error: 'Hive not found' });
  res.json(toJson(hive));
});

// PATCH /v1/hives/:hiveId — update hive (owner or ADMIN)
app.patch('/v1/hives/:hiveId', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const hiveId = routeParam(req, 'hiveId');
  const where = req.auth!.role === Role.ADMIN ? { id: hiveId } : { id: hiveId, ownerId: req.auth!.id };
  const exists = await prisma.hive.findFirst({ where });
  if (!exists) return res.status(404).json({ error: 'Hive not found' });

  const body = parse(
    z.object({
      name: z.string().min(2).max(100).trim().optional(),
      location: z.string().min(2).max(160).trim().optional(),
      status: z.nativeEnum(HiveStatus).optional(),
      queenAgeMonths: z.number().int().min(0).max(120).optional(),
      lastInspection: z.coerce.date().optional(),
    }),
    req.body,
    res
  );
  if (!body) return;

  const updated = await prisma.hive.update({
    where: { id: exists.id },
    data: body,
    include: {
      telemetry: { take: 1, orderBy: { recordedAt: 'desc' } },
      apiary: true,
    },
  });

  res.json(toJson(updated));
});

// DELETE /v1/hives/:hiveId — delete hive (owner or ADMIN)
app.delete('/v1/hives/:hiveId', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const hiveId = routeParam(req, 'hiveId');
  const where = req.auth!.role === Role.ADMIN ? { id: hiveId } : { id: hiveId, ownerId: req.auth!.id };
  const exists = await prisma.hive.findFirst({ where });
  if (!exists) return res.status(404).json({ error: 'Hive not found' });

  // Delete telemetry and batches associated
  await prisma.telemetryReading.deleteMany({ where: { hiveId: exists.id } });
  await prisma.hive.delete({ where: { id: exists.id } });

  res.status(204).end();
});

// POST /v1/hives/:hiveId/telemetry — record real sensor/IoT telemetry (owner or ADMIN)
app.post('/v1/hives/:hiveId/telemetry', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const hiveId = routeParam(req, 'hiveId');
  const where = req.auth!.role === Role.ADMIN ? { id: hiveId } : { id: hiveId, ownerId: req.auth!.id };
  const hive = await prisma.hive.findFirst({ where });
  if (!hive) return res.status(404).json({ error: 'Hive not found' });

  const body = parse(
    z.object({
      recordedAt: z.coerce.date().default(() => new Date()),
      temperatureC: z.number().min(-40).max(80).optional(),
      humidityPct: z.number().min(0).max(100).optional(),
      weightKg: z.number().min(0).max(1000).optional(),
      colonyActivity: z.number().min(0).max(100).optional(),
      acousticLevel: z.number().min(0).max(10000).optional(),
      source: z.string().min(1).max(80).default('manual-field-log'),
      dataStatus: z.nativeEnum(DataStatus).default(DataStatus.OBSERVED),
    }),
    req.body,
    res
  );
  if (!body) return;

  const reading = await prisma.telemetryReading.create({
    data: { hiveId: hive.id, ...body },
  });
  res.status(201).json(toJson(reading));
});

// ─── Batch / Passport / Traceability (Scoped) ────────────────────────────────

const batchesVisibleTo = (auth: AuthUser) =>
  auth.role === Role.ADMIN ? {} : { hive: { is: { ownerId: auth.id } } };

app.get('/v1/batches', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const batches = await prisma.batch.findMany({
    where: batchesVisibleTo(req.auth!),
    include: { passport: true, product: true, hive: true },
    orderBy: { harvestDate: 'desc' },
  });
  res.json(toJson(batches));
});

app.get('/v1/batches/:batchId', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const batch = await prisma.batch.findFirst({
    where: { id: routeParam(req, 'batchId'), ...batchesVisibleTo(req.auth!) },
    include: { passport: true, events: { orderBy: { occurredAt: 'asc' } }, product: true, hive: true },
  });
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  res.json(toJson(batch));
});

app.post('/v1/batches', verifyAnyToken, requireAuthenticated, requireRole(Role.ADMIN, Role.BEEKEEPER, Role.PROCESSOR), async (req, res) => {
  const body = parse(
    z.object({
      id: z.string().optional(),
      name: z.string().min(2).max(100),
      location: z.string().min(2).max(160).optional(),
      harvestDate: z.coerce.date().default(() => new Date()),
      hiveId: z.string().min(1),
      weightKg: z.number().positive().max(10000),
      floralSource: z.string().optional(),
      purityPct: z.number().min(0).max(100).optional(),
      moisturePct: z.number().min(0).max(100).optional(),
      dataStatus: z.nativeEnum(DataStatus).default(DataStatus.OBSERVED),
    }),
    req.body,
    res
  );
  if (!body) return;
  const hive = await prisma.hive.findFirst({
    where: { id: body.hiveId, ...(req.auth!.role === Role.ADMIN ? {} : { ownerId: req.auth!.id }) }
  });
  if (!hive) return res.status(400).json({ error: 'The selected hive does not exist or is not yours' });

  const batchId = body.id || `HC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const batchLocation = body.location || hive.location;
  const rawToken = `hc-token-${batchId.toLowerCase()}-${Date.now()}`;

  const batch = await prisma.batch.create({
    data: {
      id: batchId,
      name: body.name,
      location: batchLocation,
      harvestDate: body.harvestDate,
      hiveId: hive.id,
      weightKg: body.weightKg,
      dataStatus: body.dataStatus,
      publicTokenHash: tokenHash(rawToken),
      passport: {
        create: {
          floralSource: body.floralSource || 'Mustard & Wildflower',
          purityPct: body.purityPct ?? 98.5,
          moisturePct: body.moisturePct ?? 17.2,
          qualityStatus: body.dataStatus,
        },
      },
      events: {
        create: [
          {
            stage: 'Harvest Recorded',
            description: `Harvested ${body.weightKg} kg from ${hive.name} (${hive.id}) at ${batchLocation}.`,
            occurredAt: body.harvestDate,
            actorName: req.auth?.email || 'Verified Beekeeper',
            actorRole: req.auth?.role && req.auth.role !== 'GUEST' ? req.auth.role : Role.BEEKEEPER,
            location: batchLocation,
            status: TraceabilityStatus.COMPLETED,
            dataStatus: body.dataStatus,
            verificationMethod: VerificationMethod.RECORDED,
          },
        ],
      },
    },
    include: { passport: true, events: true, hive: true },
  });
  res.status(201).json(toJson(batch));
});

app.put('/v1/batches/:batchId/passport', verifyAnyToken, requireAuthenticated, requireRole(Role.ADMIN, Role.PROCESSOR, Role.AUDITOR), async (req, res) => {
  const body = parse(
    z.object({
      floralSource: z.string().max(100).optional(),
      purityPct: z.number().min(0).max(100).optional(),
      moisturePct: z.number().min(0).max(100).optional(),
      hmfMgKg: z.number().min(0).max(1000).optional(),
      antibioticsDetected: z.boolean().optional(),
      certificateUrl: z.string().url().optional(),
      qualityStatus: z.nativeEnum(DataStatus).default(DataStatus.OBSERVED),
    }),
    req.body,
    res
  );
  if (!body) return;
  const batchId = routeParam(req, 'batchId');
  const exists = await prisma.batch.findFirst({ where: { id: batchId, ...batchesVisibleTo(req.auth!) } });
  if (!exists) return res.status(404).json({ error: 'Batch not found' });
  res.json(toJson(await prisma.passport.upsert({ where: { batchId }, create: { batchId, ...body }, update: body })));
});

app.post('/v1/batches/:batchId/events', verifyAnyToken, requireAuthenticated, requireRole(Role.ADMIN, Role.BEEKEEPER, Role.PROCESSOR, Role.PACKER, Role.DISTRIBUTOR), async (req, res) => {
  const body = parse(
    z.object({
      stage: z.string().min(2).max(80),
      description: z.string().min(2).max(500),
      occurredAt: z.coerce.date(),
      actorName: z.string().min(2).max(100),
      actorRole: z.nativeEnum(Role),
      location: z.string().min(2).max(160),
      status: z.nativeEnum(TraceabilityStatus).default(TraceabilityStatus.COMPLETED),
      dataStatus: z.nativeEnum(DataStatus).default(DataStatus.OBSERVED),
      verificationMethod: z.nativeEnum(VerificationMethod).default(VerificationMethod.RECORDED),
      externalProofRef: z.string().max(300).optional(),
    }),
    req.body,
    res
  );
  if (!body) return;
  if (body.verificationMethod === VerificationMethod.BLOCKCHAIN_CONFIRMED && !body.externalProofRef) {
    return res.status(400).json({ error: 'Blockchain confirmation requires an externally verifiable proof reference' });
  }
  const batch = await prisma.batch.findFirst({ where: { id: routeParam(req, 'batchId'), ...batchesVisibleTo(req.auth!) } });
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  const event = await prisma.traceabilityEvent.create({ data: { batchId: batch.id, ...body } });
  res.status(201).json(toJson(event));
});

// ─── Alerts & Field Reports (User Scoped) ───────────────────────────────────

// GET /v1/alerts — list user's alerts
app.get('/v1/alerts', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { recipientId: req.auth!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(toJson(alerts));
});

// POST /v1/alerts — create alert for user (e.g. system alert or test trigger)
app.post('/v1/alerts', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const body = parse(
    z.object({
      hiveId: z.string().optional(),
      severity: z.nativeEnum(AlertSeverity).default(AlertSeverity.INFO),
      title: z.string().min(2).max(120),
      message: z.string().min(2).max(500),
      source: z.string().default('sensor-monitor'),
    }),
    req.body,
    res
  );
  if (!body) return;

  const alert = await prisma.alert.create({
    data: {
      recipientId: req.auth!.id,
      ...body,
    },
  });
  res.status(201).json(toJson(alert));
});

// PATCH /v1/alerts/:id/read — mark alert as read
app.patch('/v1/alerts/:id/read', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const alert = await prisma.alert.updateMany({
    where: { id: routeParam(req, 'id'), recipientId: req.auth!.id },
    data: { readAt: new Date() },
  });
  if (!alert.count) return res.status(404).json({ error: 'Alert not found' });
  res.status(204).end();
});

// GET /v1/reports — list user's field inspection reports
app.get('/v1/reports', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const reports = await prisma.fieldReport.findMany({
    where: { userId: req.auth!.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(toJson(reports));
});

// POST /v1/reports — create field report
app.post('/v1/reports', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const body = parse(
    z.object({
      hiveId: z.string().nullable().optional(),
      title: z.string().min(1).max(120),
      period: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
      status: z.string().default('Completed'),
    }),
    req.body,
    res
  );
  if (!body) return;

  const report = await prisma.fieldReport.create({
    data: {
      userId: req.auth!.id,
      hiveId: body.hiveId?.trim() || null,
      title: body.title.trim(),
      period: body.period?.trim() || null,
      notes: body.notes?.trim() || null,
      status: body.status || 'Completed',
    },
  });
  res.status(201).json(toJson(report));
});

// GET /v1/reports/summary — strictly aggregates current user's hives, alerts, and harvest
app.get('/v1/reports/summary', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const hiveWhere = req.auth!.role === Role.ADMIN ? {} : { ownerId: req.auth!.id };
  const batchWhere = req.auth!.role === Role.ADMIN ? {} : { hive: { is: { ownerId: req.auth!.id } } };

  const [totalHives, healthyHives, unreadAlerts, harvest] = await Promise.all([
    prisma.hive.count({ where: hiveWhere }),
    prisma.hive.count({ where: { ...hiveWhere, status: HiveStatus.HEALTHY } }),
    prisma.alert.count({ where: { recipientId: req.auth!.id, readAt: null } }),
    prisma.batch.aggregate({ _sum: { weightKg: true }, where: batchWhere }),
  ]);

  res.json(toJson({
    totalHives,
    healthyHives,
    unreadAlerts,
    totalHarvestKg: Number(harvest._sum.weightKg ?? 0),
    note: 'Aggregated strictly from your authenticated account records.',
  }));
});

// ─── Marketplace & Regional Pricing ─────────────────────────────────────────

// Visible to all users (Beekeepers, Market Heads, Guests)
app.get('/v1/market/rates', verifyAnyToken, async (_req, res) => {
  const rates = [
    {
      id: 'rate-kashmir',
      region: 'Kashmir Valley',
      state: 'Jammu & Kashmir',
      floralSource: 'White Acacia & Wild Clover',
      benchmarkPrice: 850.0,
      minSupportPrice: 650.0,
      maxCeilingPrice: 1100.0,
      demandIndex: 1.35,
      weeklyChangePct: 4.8,
      moistureMaxPct: 17.5,
    },
    {
      id: 'rate-sundarbans',
      region: 'Sundarbans Mangrove',
      state: 'West Bengal',
      floralSource: 'Wild Mangrove & Khalisa',
      benchmarkPrice: 680.0,
      minSupportPrice: 520.0,
      maxCeilingPrice: 900.0,
      demandIndex: 1.20,
      weeklyChangePct: 2.3,
      moistureMaxPct: 18.0,
    },
    {
      id: 'rate-coorg',
      region: 'Coorg & Western Ghats',
      state: 'Karnataka',
      floralSource: 'Multifloral Coffee Blossom',
      benchmarkPrice: 540.0,
      minSupportPrice: 420.0,
      maxCeilingPrice: 720.0,
      demandIndex: 1.10,
      weeklyChangePct: -1.2,
      moistureMaxPct: 18.0,
    },
    {
      id: 'rate-himachal',
      region: 'Himachal Foothills',
      state: 'Himachal Pradesh',
      floralSource: 'Apple & Cherry Blossom',
      benchmarkPrice: 720.0,
      minSupportPrice: 550.0,
      maxCeilingPrice: 950.0,
      demandIndex: 1.28,
      weeklyChangePct: 3.5,
      moistureMaxPct: 17.0,
    },
    {
      id: 'rate-rajasthan',
      region: 'Rajasthan Semi-Arid',
      state: 'Rajasthan',
      floralSource: 'Mustard & Ber (Sidr)',
      benchmarkPrice: 420.0,
      minSupportPrice: 340.0,
      maxCeilingPrice: 560.0,
      demandIndex: 0.95,
      weeklyChangePct: 1.1,
      moistureMaxPct: 18.5,
    },
  ];
  res.json(toJson(rates));
});

// Visible to all users (Beekeepers, Market Heads, Guests)
app.get('/v1/market/products', verifyAnyToken, async (_req, res) => {
  const products = await prisma.marketProduct.findMany({
    where: { active: true },
    include: { batch: { include: { passport: true, hive: true } } },
  });
  res.json(toJson(products));
});

// Modification restricted explicitly to MARKET_HEAD or ADMIN
app.post('/v1/market/products', verifyAnyToken, requireAuthenticated, requireRole(Role.ADMIN, Role.MARKET_HEAD), async (req, res) => {
  const body = parse(
    z.object({
      batchId: z.string(),
      pricePerKg: z.number().positive(),
      availableWeightKg: z.number().positive(),
      currency: z.string().default('INR'),
      sellerName: z.string().min(2).max(100),
      sellerRole: z.nativeEnum(Role).default(Role.MARKET_HEAD),
    }),
    req.body,
    res
  );
  if (!body) return;

  const product = await prisma.marketProduct.upsert({
    where: { batchId: body.batchId },
    create: body,
    update: body,
  });
  res.status(201).json(toJson(product));
});

app.get('/v1/settings', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const settings = await prisma.userSetting.upsert({
    where: { userId: req.auth!.id },
    create: { userId: req.auth!.id },
    update: {},
  });
  res.json(toJson(settings));
});

app.put('/v1/settings', verifyAnyToken, requireAuthenticated, async (req, res) => {
  const body = parse(
    z.object({
      language: z.string().regex(/^[a-z]{2}$/).optional(),
      theme: z.enum(['light', 'dark', 'system']).optional(),
      alertsOn: z.boolean().optional(),
    }),
    req.body,
    res
  );
  if (!body) return;
  const updated = await prisma.userSetting.upsert({
    where: { userId: req.auth!.id },
    create: { userId: req.auth!.id, ...body },
    update: body,
  });
  res.json(toJson(updated));
});

// ─── Public Endpoints (no auth required) ─────────────────────────────────────
const publicRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false });

// Public QR verification (by hashed token)
app.get('/v1/public/verify/:token', publicRateLimit, async (req, res) => {
  const batch = await prisma.batch.findUnique({
    where: { publicTokenHash: tokenHash(routeParam(req, 'token')) },
    include: { passport: true, events: { orderBy: { occurredAt: 'asc' } } },
  });
  if (!batch) return res.status(404).json({ verificationStatus: 'NOT_FOUND' });
  const hasIndependentProof = batch.events.some(
    (event) => event.verificationMethod === VerificationMethod.BLOCKCHAIN_CONFIRMED || event.verificationMethod === VerificationMethod.THIRD_PARTY_CERTIFICATE
  );
  const publicBatch = {
    id: batch.id,
    name: batch.name,
    location: batch.location,
    harvestDate: batch.harvestDate,
    weightKg: batch.weightKg,
    dataStatus: batch.dataStatus,
    passport: batch.passport ? {
      floralSource: batch.passport.floralSource,
      purityPct: batch.passport.purityPct,
      moisturePct: batch.passport.moisturePct,
      hmfMgKg: batch.passport.hmfMgKg,
      antibioticsDetected: batch.passport.antibioticsDetected,
      qualityStatus: batch.passport.qualityStatus,
      issuedAt: batch.passport.issuedAt,
    } : null,
    events: batch.events.map((e) => ({
      stage: e.stage,
      description: e.description,
      occurredAt: e.occurredAt,
      actorName: e.actorName,
      actorRole: e.actorRole,
      location: e.location,
      status: e.status,
      dataStatus: e.dataStatus,
      verificationMethod: e.verificationMethod,
    })),
  };
  res.json(toJson({
    verificationStatus: batch.dataStatus === DataStatus.DEMO ? 'DEMO_RECORD_NOT_INDEPENDENTLY_VERIFIED' : hasIndependentProof ? 'VERIFIED_RECORD' : 'RECORDED_NOT_INDEPENDENTLY_VERIFIED',
    batch: publicBatch,
  }));
});

// Public batch detail (by batch ID — safe public fields only)
app.get('/v1/public/batches/:batchId', publicRateLimit, async (req, res) => {
  const batch = await prisma.batch.findUnique({
    where: { id: routeParam(req, 'batchId') },
    include: { passport: true, events: { orderBy: { occurredAt: 'asc' } } },
  });
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  res.json(toJson({
    id: batch.id,
    name: batch.name,
    location: batch.location,
    harvestDate: batch.harvestDate,
    weightKg: batch.weightKg,
    dataStatus: batch.dataStatus,
    passport: batch.passport ? {
      floralSource: batch.passport.floralSource,
      purityPct: batch.passport.purityPct,
      moisturePct: batch.passport.moisturePct,
      hmfMgKg: batch.passport.hmfMgKg,
      antibioticsDetected: batch.passport.antibioticsDetected,
      qualityStatus: batch.passport.qualityStatus,
      issuedAt: batch.passport.issuedAt,
    } : null,
    events: batch.events.map((e) => ({
      stage: e.stage,
      description: e.description,
      occurredAt: e.occurredAt,
      actorName: e.actorName,
      actorRole: e.actorRole,
      location: e.location,
      status: e.status,
      dataStatus: e.dataStatus,
      verificationMethod: e.verificationMethod,
    })),
  }));
});

// ─── Error Handlers ───────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Unexpected server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`HoneyChain API listening on http://localhost:${port}`));
}
export { app, tokenHash };
