# PostgreSQL Feature Showcase

A focused demo web application showing PostgreSQL's strongest DBMS capabilities — not a production app, but a hands-on presentation tool for understanding what makes PostgreSQL stand out.

---

## PostgreSQL Features Demonstrated

| PostgreSQL Feature | Demo Screen | SQL / Object Used | Why It Matters |
|---|---|---|---|
| UUID | Flexible Data | `gen_random_uuid()` | Collision-resistant IDs for distributed systems |
| JSONB | Flexible Data | `attributes->>'brand'` | Flexible document-like attributes without a rigid schema |
| Array | Flexible Data | `tags @> ARRAY['travel']` | Store multi-value tags in a single column |
| GIN Index | Flexible Data | `CREATE INDEX ... USING GIN` | Speeds up JSONB and Array queries |
| Custom ENUM | Transaction | `transfer_status` type | Schema-enforced status values |
| ACID Transaction | Transaction | `BEGIN / COMMIT / ROLLBACK` | Prevents partial updates across multiple rows |
| Row-level Lock | Transaction | `SELECT ... FOR UPDATE` | Serialises concurrent access to the same row |
| PostGIS | Extensions | `ST_Distance`, `<->` operator | Geospatial search natively inside PostgreSQL |
| pgvector | Extensions | `<->` cosine distance | AI semantic search without a separate vector store |
| EXPLAIN ANALYZE | Optimizer | `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` | Shows exactly how PostgreSQL executes a query |
| Trigger | Enterprise | `AFTER UPDATE` trigger | Automatic audit log on every product price change |
| View | Enterprise | `CREATE VIEW revenue_by_region` | Reusable analytics query stored as a named object |
| CHECK Constraint | Enterprise | `CHECK (price > 0)` | Schema-level data validation, no app code needed |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 4 + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 |
| Extensions | pgcrypto, PostGIS 3, pgvector |
| Container | Docker + Docker Compose |

---

## Project Structure

```
postgresql-feature-showcase/
├── package.json              # Root convenience scripts
├── docker-compose.yml
├── database/
│   ├── Dockerfile            # postgres:16 + PostGIS + pgvector
│   └── init/                 # SQL init scripts (run in alpha order)
│       ├── 01_extensions.sql
│       ├── 02_types.sql
│       ├── 03_tables.sql
│       ├── 04_indexes.sql
│       ├── 05_triggers.sql
│       ├── 06_seed.sql
│       └── 07_views.sql
├── backend/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── db.ts
│       ├── routes/
│       ├── services/
│       └── utils/
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── pages/
│       ├── components/
│       └── services/
├── scripts/
│   └── smoke-test.ps1        # PowerShell smoke test
└── docs/
    ├── demo-script-vi.md     # Vietnamese presentation script
    └── sql-demo-queries.md   # Key SQL queries reference
```

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+
- npm v9+

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nguyentrungnghia1802/PostgreSQL-Demo.git
cd PostgreSQL-Demo
git checkout feat/postgresql-feature-showcase
```

### 2. Start the database

```bash
docker compose up -d postgres
```

Wait for the container to finish initialising (runs all `database/init/*.sql` scripts):

```bash
docker compose logs postgres --follow
# Wait until you see: database system is ready to accept connections
```

### 3. Start the backend

```bash
cd backend
cp .env.example .env   # only needed once
npm install
npm run dev
```

Backend runs at: **http://localhost:4000**

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Reset Database

Wipe all data and re-run init scripts from scratch:

```bash
docker compose down -v
docker compose up -d postgres
```

Reset only demo data (accounts, audit logs, optimizer index) without rebuilding Docker:

```
POST http://localhost:4000/api/demo/reset-all
```

Or click **Reset All Demo Data** on the Home page.

---

## Run Checks

From the repo root (requires both `backend/` and `frontend/` to have been `npm install`-ed):

```bash
npm run check
```

This runs `build:backend` then `build:frontend` in sequence.

PowerShell smoke test (backend must be running on port 4000):

```powershell
.\scripts\smoke-test.ps1
```

---

## Demo Flow

Recommended order for a 10–12 minute presentation:

1. **Home** (`/`) — show the feature mapping table and "Reset All Demo Data"
2. **Flexible Data** (`/demo/jsonb`) — filter products by JSONB attributes and Array tags
3. **Transaction** (`/demo/transaction`) — run a successful transfer, then a failed one; show rollback proof
4. **Extensions** (`/demo/extensions`) — find nearest Hanoi stores; run AI semantic search
5. **Optimizer** (`/demo/optimizer`) — drop index → Seq Scan; create index → Index Scan
6. **Enterprise** (`/demo/enterprise`) — trigger CHECK constraint; update price and see audit log; load revenue view

See [`docs/demo-script-vi.md`](docs/demo-script-vi.md) for the full Vietnamese presentation script.

---

## Troubleshooting

### PostGIS or pgvector extension not available

```bash
docker compose down -v
docker compose build --no-cache postgres
docker compose up -d postgres
```

If packages cannot be installed in the build environment, the APIs return a descriptive error message instead of crashing.

### Docker volume caches old init SQL

Always use `-v` when resetting to remove the named volume:

```bash
docker compose down -v
docker compose up -d postgres
```

### Backend cannot connect to database

1. Check `.env` has `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/pg_feature_showcase`
2. Verify the container is healthy: `docker compose ps`
3. Port 5433 is used (not 5432) to avoid conflict with a local PostgreSQL instance.

### Port conflicts

| Service | Default port | Change in |
|---|---|---|
| PostgreSQL (Docker) | 5433 | `docker-compose.yml` |
| Backend | 4000 | `backend/.env` |
| Frontend | 5173 | `frontend/vite.config.ts` |

---

## Team Notes

| Role | Responsibility |
|---|---|
| Database | `database/init/` SQL scripts, seed data, index design |
| Backend | Express routes and services in `backend/src/` |
| Frontend | React pages and components in `frontend/src/` |
| Presenter | Run through `docs/demo-script-vi.md` |
