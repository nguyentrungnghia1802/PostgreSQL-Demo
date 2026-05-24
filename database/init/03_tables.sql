-- 03_tables.sql
-- Core demo tables

-- products: demo JSONB (attributes), Array (tags), UUID, CHECK constraint
CREATE TABLE IF NOT EXISTS products (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       TEXT NOT NULL,
    category   TEXT NOT NULL,
    price      NUMERIC(12,2) NOT NULL CHECK (price > 0),
    tags       TEXT[] DEFAULT ARRAY[]::TEXT[],
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

-- accounts: demo ACID transactions (balance must be >= 0)
CREATE TABLE IF NOT EXISTS accounts (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_name TEXT NOT NULL UNIQUE,
    balance    NUMERIC(12,2) NOT NULL CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- transfer_logs: demo custom ENUM type and foreign keys
CREATE TABLE IF NOT EXISTS transfer_logs (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account UUID REFERENCES accounts(id),
    to_account   UUID REFERENCES accounts(id),
    amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    status       transfer_status NOT NULL DEFAULT 'PENDING',
    note         TEXT,
    created_at   TIMESTAMP DEFAULT NOW()
);

-- stores: demo PostGIS geography type
CREATE TABLE IF NOT EXISTS stores (
    id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name     TEXT NOT NULL,
    address  TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL
);

-- product_embeddings: demo pgvector similarity search with VECTOR(3) mock embeddings
CREATE TABLE IF NOT EXISTS product_embeddings (
    product_id  UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    embedding   VECTOR(3)
);

-- sales: large dataset (~100k rows) for query optimizer / EXPLAIN ANALYZE demo
CREATE TABLE IF NOT EXISTS sales (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    category     TEXT NOT NULL,
    amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    sale_date    DATE NOT NULL,
    region       TEXT NOT NULL
);

-- audit_logs: demo trigger-based audit trail (populated by trigger on products)
CREATE TABLE IF NOT EXISTS audit_logs (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    action     TEXT NOT NULL,
    old_data   JSONB,
    new_data   JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
