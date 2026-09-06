# 🍯 HoneyChain — Intelligent Honey Provenance & Apiary Platform

> **Every Drop Has a Story.**  
> *Trace the journey. Understand the hive. Trust the honey.*

HoneyChain is an end-to-end, multi-tenant Web3 & IoT apiary management and cryptographic honey provenance platform. Built with **React, Vite, TypeScript, Express, Prisma ORM, and PostgreSQL**, HoneyChain connects beekeepers, honey processors, certifiers, market administrators, and consumers through authentic IoT telemetry, immutable custody tracking, and transparent verification.

---

## 📑 Table of Contents

1. [System Architecture](#-system-architecture)
2. [Core Platform Modules](#-core-platform-modules)
   - [Overview & Apiary Dashboard](#1-overview--apiary-dashboard)
   - [Smart Hives & IoT Node Telemetry](#2-smart-hives--iot-node-telemetry)
   - [Honey Passport & Cryptographic Minting](#3-honey-passport--cryptographic-minting)
   - [AI Intelligence & Colony Diagnostics](#4-ai-intelligence--colony-diagnostics)
   - [Dual-Mode Traceability Ledger](#5-dual-mode-traceability-ledger)
   - [Commercial Marketplace & Regional Pricing Feed](#6-commercial-marketplace--regional-pricing-feed)
   - [Field Reports & Analytics](#7-field-reports--analytics)
   - [Alerts & Colony Health Engine](#8-alerts--colony-health-engine)
   - [Settings, i18n & Theme Engine](#9-settings-i18n--theme-engine)
3. [Security & RBAC Architecture](#-security--rbac-architecture)
4. [Database Schema & Data Model](#-database-schema--data-model)
5. [Complete API Specification](#-complete-api-specification)
6. [Getting Started & Installation](#-getting-started--installation)
7. [Testing & Verification](#-testing--verification)
8. [Demo Accounts & Reset Utilities](#-demo-accounts--reset-utilities)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             HONEYCHAIN CLIENT                               │
│  React 18 · TypeScript · Vite · Tailwind CSS · Recharts · Lucide Icons      │
│  Contexts: AuthContext · ThemeContext (Dark/Light) · LanguageContext (12 L) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / JSON (Bearer JWT)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HONEYCHAIN EXPRESS API                             │
│  Node.js · Express · TypeScript · Helmet · Rate-Limiting · Zod Validation   │
│  JWT Authentication · SHA-256 Public Token Hashing · Strict RBAC            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Client v6
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           POSTGRESQL DATABASE                               │
│  Supabase Cloud DB · Relational Integrity · Cascade Deletions · Indexes     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Core Platform Modules

### 1. Overview & Apiary Dashboard
- **Live Local Calendar & Clock**: Reusable live-date component automatically bound to the browser's local timezone (`Intl.DateTimeFormat`), updating seamlessly at midnight.
- **Dynamic KPI Cards**: Displays real-time aggregated metrics computed live from the user's database records:
  - *Active Smart Hives* & *Colony Health Index* (percentage of healthy colonies).
  - *Harvest Yield* (total kg extracted across all user batches).
  - *Unread Telemetry Alerts* (live count of unread health flags).
- **Spatial Apiary Map**: Interactive coordinate grid displaying active hive nodes with live status indicators (`HEALTHY`, `WATCH`, `INSPECT`), hover telemetry tooltips, and one-click navigation to colony deep-dives.
- **Live Environmental Conditions**: Ambient temperature, humidity, atmospheric pressure, and foraging suitability ratings.

### 2. Smart Hives & IoT Node Telemetry
- **Complete CRUD Operations**: Add, inspect, update, and delete Smart Hive nodes with persistent database storage.
- **Node Metadata**: Hive name, unique node code (e.g., `H-104`), apiary geographic station, status, and queen lineage age (months).
- **Telemetry Ingestion**: Ingest real sensor readings:
  - **Acoustic Frequency (Hz)**: Colony audio frequency tracked against the 240 Hz standard baseline.
  - **Core Temperature (°C)**: Internal brood temperature.
  - **Internal Relative Humidity (%)**.
  - **Colony Biomass Mass (kg)**: Live hive weight scale.
- **Telemetry History Ledger**: Paginated, reverse-chronological table of all recorded telemetry logs.

### 3. Honey Passport & Cryptographic Minting
- **Harvest Batch Issuance**: Modal workflow allowing beekeepers to harvest honey from any active hive, logging weight, floral source, and lab analytics.
- **Cryptographic Digital Passport**: Automatically provisions a digital passport with:
  - **Quality Purity Index (%)** & **Moisture Content (%)**.
  - **HMF Levels (mg/kg)** & **Antibiotic Residue Screening**.
  - **Unique SHA-256 Hashed Public Verification Token**.
  - **Scannable QR Stamp**: Direct link to the public verification endpoint for consumer jar scanning.

### 4. AI Intelligence & Colony Diagnostics
The Intelligence module provides three specialized operational views, neatly arranged with top-right tab selectors:
1. **Colony Diagnostics (Observed Data)**:
   - Multi-hive dropdown selector to switch between active apiary nodes.
   - Live telemetry status card showing real-time acoustic, thermal, and weight data.
   - **24-Hour Acoustic Frequency Trend Chart**: Recharts line chart comparing observed audio vibrations against the 240 Hz baseline with deviation detection.
   - Comprehensive diagnostic breakdown modal explaining hive acoustics and stress indicators.
2. **Yield Forecast (Simulated Trajectory)**:
   - Dynamic biomass prediction model scaling across all user-registered apiary nodes.
   - Multi-horizon forecasting: **+24 Hours**, **+3 Days**, and **+7 Days** projected yield ranges with confidence intervals.
   - Microclimate Meteorological Outlook showing wind velocity, precipitation probability, and foraging window scores.
3. **Action-Oriented Recommendations**:
   - Automated apiary guidance generated individually for every registered colony:
     - Flags Queen aging advisories for queens older than 18 months.
     - Recommends ventilation / comb checks when acoustic frequency drops below 220 Hz.
     - Prompts physical brood inspection when hive status is `WATCH` or `INSPECT`.

### 5. Dual-Mode Traceability Ledger
- **No Empty Redirects**: Traceability supports two independent in-place provenance modes:
  - **Smart Hives Mode**: Traces the cryptographic lifecycle of individual hive nodes (Node Genesis, IoT Gateway Active, Health & Queen Attestation, Geographic Perimeter Binding, and Harvest Custody Readiness).
  - **Harvest Batches Mode**: Traces the complete batch journey (Harvest Recorded, Lab Quality Testing, Processing Facility, Bottling & Security Stamping, and Retail Verification).
- **Actors Involved Card**: Dynamically displays the authenticated Beekeeper's identity, apiary station, and participating supply chain entities.
- **Merkle Proof Inspection**: Modal inspects cryptographic transaction hashes, block numbers, and signature timestamps.

### 6. Commercial Marketplace & Regional Pricing Feed
- **Universal Visibility**: All users (Beekeepers, Market Heads, Guests, and Admins) can browse verified batch listings, filter by floral source (Mustard, Wildflower, Acacia, Eucalyptus), and sort by price, harvest date, or trust score.
- **Regional Market Price Benchmark Feed**: Live market benchmark matrix displaying current rates across major Indian beekeeping regions:
  - **Kashmir Valley**: White Acacia & Wild Clover (₹850/kg, Demand 1.35x).
  - **Sundarbans Mangrove**: Wild Mangrove & Khalisa (₹680/kg, Demand 1.20x).
  - **Coorg & Western Ghats**: Multifloral Coffee Blossom (₹540/kg, Demand 1.10x).
  - **Himachal Foothills**: Apple & Cherry Blossom (₹720/kg, Demand 1.28x).
  - **Rajasthan Semi-Arid**: Mustard & Ber Sidr (₹420/kg, Demand 0.95x).
- **Role-Based Editing Control**: Listing new commercial batches and updating price benchmarks is strictly restricted to `MARKET_HEAD` and `ADMIN` roles.

### 7. Field Reports & Analytics
- **Inspection Logs**: Create and maintain detailed field inspection reports linked to specific hives or apiary-wide.
- **Automated Summary Aggregations**: Generates real-time apiary performance statistics with export capabilities.

### 8. Alerts & Colony Health Engine
- Real-time notification system with severity tags (`CRITICAL`, `WARNING`, `INFO`).
- Interactive mark-as-read updates with dynamic unread counter badge updates in the top navigation and sidebar.

### 9. Settings, i18n & Theme Engine
- **Multi-Language Support (12 Indian Languages)**:
  - English (`en`), Hindi (`hi`), Bengali (`bn`), Marathi (`mr`), Gujarati (`gu`), Punjabi (`pa`), Odia (`or`), Assamese (`as`), Tamil (`ta`), Telugu (`te`), Kannada (`kn`), Malayalam (`ml`).
- **Theme Modes**: Seamless toggling between **Dark Mode**, **Light Mode**, and **System Default**, with full Tailwind CSS color variable synchronisation.

---

## 🔒 Security & RBAC Architecture

### 1. Multi-Tenant Data Isolation
- **Token-Derived Ownership**: In all backend controllers, the user's ID is extracted directly from the verified JWT (`req.auth.id`).
- **Isolation Guarantee**: User A cannot read, modify, delete, or submit telemetry to User B's hives or batches (returns `404 Not Found`).
- **Honest Empty State Policy**: Newly registered users start with an honest empty dashboard (0 hives, 0 batches, 0 alerts). No static mock data is injected.

### 2. Role-Based Access Control (RBAC) Matrix

| Platform Role | View Dashboard & Hives | Manage Own Hives & Telemetry | Harvest Batches | View Marketplace & Rates | Edit Market Listings & Rates | System Administration |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **GUEST** | Read-Only | ❌ | ❌ | Read-Only | ❌ | ❌ |
| **BEEKEEPER** | ✅ | ✅ | ✅ | Read-Only | ❌ | ❌ |
| **MARKET_HEAD** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **PROCESSOR** | ✅ | ❌ | Quality Tests | ✅ | ❌ | ❌ |
| **PACKER** | ✅ | ❌ | Bottling Events | ✅ | ❌ | ❌ |
| **AUDITOR** | Global Read | ❌ | ❌ | Read-Only | ❌ | ❌ |
| **ADMIN** | Global Read/Write | Global Read/Write | Global Read/Write | Global Read/Write | Global Read/Write | ✅ |

---

## 🗄️ Database Schema & Data Model

```mermaid
erDiagram
    User ||--o{ Hive : "owns"
    User ||--o{ FieldReport : "authors"
    User ||--o{ Alert : "receives"
    User ||--o| UserSetting : "configures"
    
    Apiary ||--o{ Hive : "contains"
    
    Hive ||--o{ TelemetryReading : "records"
    Hive ||--o{ Batch : "yields"
    
    Batch ||--o| Passport : "certified by"
    Batch ||--o{ TraceabilityEvent : "logs"
    Batch ||--o| MarketProduct : "listed as"
```

### Models Summary
- **User**: Authentication credentials (bcrypt hash), full name, role enum, location.
- **Hive**: Colony code, custom name, location, status (`HEALTHY`, `WATCH`, `INSPECT`), queen age, owner foreign key.
- **TelemetryReading**: Timestamp, temperature (°C), humidity (%), weight (kg), acoustic frequency (Hz), colony activity index.
- **Batch**: Harvest timestamp, weight, public token hash, linked hive.
- **Passport**: Purity %, moisture %, HMF mg/kg, antibiotic screening boolean, certificate URL.
- **TraceabilityEvent**: Stage name, actor name, actor role, location, cryptographic proof reference, timestamp.
- **MarketProduct**: Listing price/kg (INR), available inventory weight, seller metadata, active status.
- **RegionalMarketRate**: Regional benchmark price, MSP floor, ceiling price, demand index, weekly change percentage.
- **Alert**: Recipient ID, severity (`INFO`, `WARNING`, `CRITICAL`), title, message, read timestamp.
- **FieldReport**: Author ID, optional hive ID, title, period, inspection notes, status.
- **UserSetting**: Language preference, theme mode, notification toggles.

---

## 📡 Complete API Specification

### Authentication (`/v1/auth`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/auth/register` | Public | Register new user account |
| `POST` | `/v1/auth/login` | Public | Authenticate credentials & return JWT |
| `POST` | `/v1/auth/guest` | Public | Generate guest session token |
| `GET` | `/v1/auth/me` | Authenticated | Retrieve authenticated user profile |
| `POST` | `/v1/auth/logout` | Authenticated | Invalidate session |

### Smart Hives (`/v1/hives`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/hives` | Authenticated | List user's hives (or all for Admin) |
| `POST` | `/v1/hives` | Authenticated | Register a new smart hive |
| `GET` | `/v1/hives/:id` | Owner / Admin | Get hive details & telemetry logs |
| `PATCH` | `/v1/hives/:id` | Owner / Admin | Update hive parameters |
| `DELETE` | `/v1/hives/:id` | Owner / Admin | Delete hive and cascade readings |
| `POST` | `/v1/hives/:id/telemetry` | Owner / Admin | Ingest sensor telemetry reading |

### Batches & Passports (`/v1/batches`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/batches` | Authenticated | List user's harvest batches & passports |
| `POST` | `/v1/batches` | Authenticated | Harvest batch, mint passport & start traceability |
| `GET` | `/v1/batches/:id` | Authenticated | Get batch detail with custody events |
| `PUT` | `/v1/batches/:id/passport` | Processor/Admin | Update laboratory certification metrics |
| `POST` | `/v1/batches/:id/events` | Authorized Roles| Append supply chain custody event |

### Marketplace & Regional Pricing (`/v1/market`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/market/rates` | Public / All | Get regional market benchmark price feed |
| `GET` | `/v1/market/products` | Public / All | Browse active verified honey products |
| `POST` | `/v1/market/products` | Market Head/Admin| List or update batch market pricing |

### Reports & Alerts (`/v1/reports`, `/v1/alerts`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/reports/summary` | Authenticated | Get live user apiary statistics |
| `GET` | `/v1/reports` | Authenticated | List user's field inspection reports |
| `POST` | `/v1/reports` | Authenticated | Create field inspection report |
| `GET` | `/v1/alerts` | Authenticated | List user alerts |
| `PATCH` | `/v1/alerts/:id/read` | Authenticated | Mark alert as read |

### Public Verification (`/v1/public`)
| Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/public/verify/:token` | Public Rate-Limited | Consumer QR verification by token hash |
| `GET` | `/v1/public/batches/:id` | Public Rate-Limited | Public batch provenance details |

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL Database**: Local or Cloud (e.g. Supabase)

### 1. Clone & Configure Backend
```bash
cd server
npm install

# Copy example environment file
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/honeychain?schema=public"
PORT=4000
JWT_SECRET="replace-with-a-long-random-64-byte-secret"
WEB_ORIGIN="http://localhost:5173"
NODE_ENV="development"
```

Sync database schema & start API:
```bash
npx prisma db push
npm run dev
```
*Backend runs on `http://localhost:4000`.*

### 2. Configure & Start Frontend
```bash
# In the root repository directory
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with Vite proxying `/api` requests directly to backend port 4000.*

---

## 🧪 Testing & Verification

### Run Backend Test Suite
```bash
cd server
npm test
```
The automated test runner executes:
1. `tests/data-isolation.test.mjs`: Validates JWT isolation, empty initial states, and verifies User A cannot access or mutate User B's resources.
2. `tests/security.test.mjs`: Verifies deterministic cryptographic hashing and secure token masking.

### Run Production Builds
```bash
# Validate frontend compilation
npm run build

# Validate backend compilation
cd server
npm run build
```

---

## 🔑 Demo Accounts & Reset Utilities

To restore the standard demonstration apiary state at any time:
```bash
cd server
npm run db:reset-demo
```

### Pre-Configured Accounts
- **Demo Beekeeper**: `ravi@example.test` / `ChangeMe123!`
- **Market Administrator**: `markethead@honeychain.test` / `ChangeMe123!`
- **System Administrator**: `admin@honeychain.test` / `ChangeMe123!`

---

## 📄 License & Intellectual Property
© 2026 HoneyChain Platform. All rights reserved.
