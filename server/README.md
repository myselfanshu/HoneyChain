# HoneyChain API

Express + TypeScript + PostgreSQL/Prisma backend for the existing React frontend. It treats the original UI values as `DEMO` seed data—never as sensor evidence, certified quality, AI output, or blockchain confirmation.

## Setup

1. Copy `.env.example` to `.env` and set a private PostgreSQL `DATABASE_URL` plus a long `JWT_SECRET`. A PostgreSQL database is required; there is no general HoneyChain API key.
2. Run `npm install`, `npm run db:generate`, `npm run db:migrate -- --name init`, and `npm run db:seed` from this `server` folder.
3. Run `npm run dev`. The API is served at `http://localhost:4000`.

For local seeded testing only, sign in as `ravi@example.test` with `ChangeMe123!`, then replace/delete this demo account before deployment. Public registration creates beekeepers only. Create administrator, auditor, and processor accounts through a controlled administrator provisioning process; never expose those roles in public sign-up.

## Environment variables and keys

Create `server/.env` from `server/.env.example` (it is private and must never be committed):

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/honeychain?schema=public
PORT=4000
JWT_SECRET=PASTE_A_NEW_64_BYTE_RANDOM_SECRET_HERE
WEB_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Generate the JWT secret from the `server` directory with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`.

CAPTCHA is optional for local development. For production, create a Cloudflare Turnstile widget in the Cloudflare dashboard, add its **secret key** as `CAPTCHA_SECRET_KEY` in `server/.env`, and put its **site key** in `../.env` as `VITE_CAPTCHA_SITE_KEY`. The site key is intentionally public; the secret key must stay on the backend. Set `WEB_ORIGIN` to the exact deployed frontend URL in production.

The frontend's `VITE_API_BASE_URL` can stay empty locally because Vite proxies `/api` to this server. In production set it to your API's `/v1` URL, for example `https://api.example.com/v1`.

## API surface

- `POST /v1/auth/login`; protected: `GET /v1/hives`, `GET /v1/hives/:id`, `POST /v1/hives/:id/telemetry`
- protected batch/passport/traceability: `GET|POST /v1/batches`, `GET /v1/batches/:id`, `PUT /v1/batches/:id/passport`, `POST /v1/batches/:id/events`
- protected: `GET /v1/market/products`, `/v1/alerts`, `/v1/settings`, `/v1/reports/summary`; mutation endpoints are role-limited.
- public QR: `GET /v1/public/verify/:token` where only a hashed QR token is stored. It intentionally distinguishes `DEMO_RECORD_NOT_INDEPENDENTLY_VERIFIED`, `RECORDED_NOT_INDEPENDENTLY_VERIFIED`, and `VERIFIED_RECORD`.

The API never invents an AI prediction and does not label a trace event as blockchain-confirmed without an external proof reference. Add a real model/provider later behind a separate service endpoint that records model version, inputs, timestamp, confidence, and `dataStatus`.
