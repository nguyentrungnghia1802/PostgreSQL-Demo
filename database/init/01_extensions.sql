-- 01_extensions.sql
-- Enable required PostgreSQL extensions

-- pgcrypto: provides gen_random_uuid() for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- postgis: enables geographic/spatial data types and functions
-- (e.g., GEOGRAPHY, ST_MakePoint, ST_Distance)
CREATE EXTENSION IF NOT EXISTS postgis;

-- vector: enables VECTOR type for AI/ML embedding similarity search (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
