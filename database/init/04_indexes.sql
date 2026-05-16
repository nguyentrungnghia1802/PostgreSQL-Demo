-- 04_indexes.sql
-- Performance indexes for demo features

-- GIN index on products.attributes (JSONB) — speeds up JSONB key/value queries
CREATE INDEX IF NOT EXISTS idx_products_attributes_gin
    ON products USING GIN (attributes);

-- GIN index on products.tags (TEXT Array) — speeds up array containment queries (@>)
CREATE INDEX IF NOT EXISTS idx_products_tags_gin
    ON products USING GIN (tags);

-- GiST index on stores.location (GEOGRAPHY) — speeds up geographic distance queries (<->)
CREATE INDEX IF NOT EXISTS idx_stores_location_gist
    ON stores USING GIST (location);

-- NOTE: idx_sales_region_date is intentionally NOT created here.
-- It is created/dropped dynamically in the Query Optimizer demo
-- to illustrate the difference between Seq Scan and Index Scan.
