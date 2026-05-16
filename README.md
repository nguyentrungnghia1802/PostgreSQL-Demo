# PostgreSQL Feature Showcase

A demo web application showcasing the strengths of PostgreSQL as a modern, enterprise-grade DBMS.

## Features Demonstrated

| Demo | PostgreSQL Feature |
|------|-------------------|
| JSONB & Flexible Data | JSONB, Array, UUID, Custom Types |
| ACID Transaction | BEGIN/COMMIT/ROLLBACK, row-level locking |
| Query Optimizer | EXPLAIN ANALYZE, GIN/GiST indexes |
| PostGIS | Geographic queries, nearest-store search |
| pgvector | AI vector similarity search |
| Enterprise Features | Constraints, Triggers, Audit Logs, Views |

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 16 with PostGIS & pgvector

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+
- npm v9+

### 1. Start the Database

```bash
docker compose up -d postgres
```

Wait for the container to be healthy:

```bash
docker compose ps
```

### 2. Start the Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend will run at: http://localhost:4000

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### 4. Health Check

- Backend: http://localhost:4000/api/health
- Database: http://localhost:4000/api/health/db

## Database Schema

| Table | Demo Feature | Description |
|-------|-------------|-------------|
| `products` | JSONB attributes, Array tags | Flexible product data with JSONB and tag arrays |
| `accounts` | ACID transactions | Alice & Bob accounts for transfer demo |
| `transfer_logs` | Custom ENUM type | Fund transfer history with `transfer_status` ENUM |
| `stores` | PostGIS geography | Store locations in Hanoi for nearest-store search |
| `product_embeddings` | pgvector similarity search | Mock VECTOR(3) embeddings for AI semantic search |
| `sales` | Large dataset for optimizer demo | ~100,000 rows for EXPLAIN ANALYZE performance demo |
| `audit_logs` | Trigger-based audit trail | Auto-populated by trigger on products UPDATE |

### Reset Database

To wipe all data and re-initialize from scratch:

```bash
docker compose down -v
docker compose up -d postgres
```

## Troubleshooting

### PostGIS or pgvector not available

If `CREATE EXTENSION postgis` or `CREATE EXTENSION vector` fails:

1. Ensure the custom Dockerfile was used (not the default `postgres:16` image):
   ```bash
   docker compose down -v
   docker compose build postgres
   docker compose up -d postgres
   ```

2. Check build logs:
   ```bash
   docker compose build --no-cache postgres
   ```

### Reset Database

To wipe all data and re-initialize:

```bash
docker compose down -v
docker compose up -d postgres
```

### Port conflicts

- PostgreSQL: 5433 (mapped from container port 5432, avoids conflict with local PostgreSQL on 5432) — change in `docker-compose.yml`
- Backend: 4000 — change in `backend/.env`
- Frontend: 5173 — change in `frontend/vite.config.ts`

## Development

### Build for production

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Project structure

```
postgresql-feature-showcase/
├── docker-compose.yml
├── database/
│   ├── Dockerfile          # postgres:16 + PostGIS + pgvector
│   └── init/               # SQL init scripts (run in order)
├── backend/
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── db.ts
│       └── routes/
└── frontend/
    └── src/
        ├── App.tsx
        ├── main.tsx
        └── services/
```
