# SQL Demo Queries — PostgreSQL Feature Showcase

Key SQL statements used by the backend. All queries use parameterized inputs in the actual code; the versions below show readable literals for reference.

---

## 1. JSONB & Flexible Data

```sql
-- Filter products by JSONB attribute and Array tag
SELECT name, category, price, attributes, tags
FROM products
WHERE category = 'smartphone'
  AND attributes->>'brand' = 'Apple'
  AND attributes->>'color' = 'Black'
  AND tags @> ARRAY['travel'];

-- GIN index that makes the above query fast
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
CREATE INDEX idx_products_tags       ON products USING GIN (tags);
```

---

## 2. ACID Transaction — Successful Transfer

```sql
BEGIN;

SELECT id, balance FROM accounts WHERE owner_name = 'Alice' FOR UPDATE;
SELECT id, balance FROM accounts WHERE owner_name = 'Bob'   FOR UPDATE;

-- Debit Alice
UPDATE accounts
SET balance = balance - 3000000
WHERE owner_name = 'Alice';

-- Credit Bob
UPDATE accounts
SET balance = balance + 3000000
WHERE owner_name = 'Bob';

INSERT INTO transfer_logs (from_account, to_account, amount, status, note)
VALUES ('<alice_id>', '<bob_id>', 3000000, 'SUCCESS', 'Demo transfer');

COMMIT;
```

---

## 3. ACID Transaction — Failed Transfer (Rollback)

```sql
BEGIN;

SELECT id, balance FROM accounts WHERE owner_name = 'Alice' FOR UPDATE;
SELECT id, balance FROM accounts WHERE owner_name = 'Bob'   FOR UPDATE;

-- Debit Alice
UPDATE accounts
SET balance = balance - 3000000
WHERE owner_name = 'Alice';

-- Simulated error: division by zero
SELECT 1 / 0;

-- Execution never reaches here; client issues ROLLBACK on error
ROLLBACK;

-- After ROLLBACK: Alice and Bob balances unchanged, no log inserted
```

---

## 4. PostGIS — Nearest Store

```sql
-- Find stores nearest to a GPS coordinate (Hoan Kiem, Hanoi)
-- Note: ST_MakePoint takes (longitude, latitude)
SELECT
  name,
  address,
  ROUND(
    (ST_Distance(
      location,
      ST_MakePoint(105.8542, 21.0285)::geography
    ) / 1000)::numeric,
    2
  ) AS distance_km
FROM stores
ORDER BY location <-> ST_MakePoint(105.8542, 21.0285)::geography
LIMIT 5;
```

---

## 5. pgvector — Semantic Search

```sql
-- Find products most similar to a query vector (3-dimensional mock embedding)
-- Query vector for "travel camera" type: [0.9, 0.8, 0.7]
SELECT
  p.name,
  p.category,
  p.price,
  pe.description,
  pe.embedding <-> '[0.9,0.8,0.7]'::vector AS distance
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <-> '[0.9,0.8,0.7]'::vector
LIMIT 5;
```

---

## 6. Query Optimizer — EXPLAIN ANALYZE

```sql
-- Drop index to force Seq Scan
DROP INDEX IF EXISTS idx_sales_region_date;

-- Aggregation query on 100k-row sales table
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;

-- Read the execution plan
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;

-- Create composite index (region + sale_date)
CREATE INDEX IF NOT EXISTS idx_sales_region_date ON sales(region, sale_date);

-- Re-run EXPLAIN to see Index Scan / Bitmap Index Scan
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;
```

---

## 7. Enterprise — CHECK Constraint Violation

```sql
-- This insert is rejected by CHECK (price > 0)
INSERT INTO products (name, category, price)
VALUES ('Invalid Product', 'test', -1000);
-- ERROR: new row for relation "products" violates check constraint "products_price_check"
```

---

## 8. Enterprise — Trigger + Audit Log

```sql
-- Update product price — trigger fires automatically
UPDATE products
SET price = price + 1000000
WHERE name = 'iPhone 15 Pro'
RETURNING *;

-- The trigger (trg_products_audit) writes to audit_logs automatically:
-- SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 5;

-- Trigger function definition (reference)
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, action, old_data, new_data)
  VALUES ('products', 'UPDATE', row_to_json(OLD), row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 9. Enterprise — View: revenue_by_region

```sql
-- View definition
CREATE OR REPLACE VIEW revenue_by_region AS
SELECT
  region,
  SUM(amount)  AS total_revenue,
  COUNT(*)     AS total_sales
FROM sales
GROUP BY region;

-- Query the view
SELECT * FROM revenue_by_region ORDER BY total_revenue DESC;
```

---

## 10. Utility — Record Counts

```sql
SELECT
  (SELECT COUNT(*)::int FROM products)           AS products,
  (SELECT COUNT(*)::int FROM accounts)           AS accounts,
  (SELECT COUNT(*)::int FROM transfer_logs)      AS transfer_logs,
  (SELECT COUNT(*)::int FROM stores)             AS stores,
  (SELECT COUNT(*)::int FROM product_embeddings) AS product_embeddings,
  (SELECT COUNT(*)::int FROM sales)              AS sales,
  (SELECT COUNT(*)::int FROM audit_logs)         AS audit_logs;
```
