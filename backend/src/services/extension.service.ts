import pool from '../db';

const DISPLAY_SQL_POSTGIS = `SELECT
  name,
  address,
  ROUND(
    (ST_Distance(
      location,
      ST_MakePoint($1, $2)::geography
    ) / 1000)::numeric,
    2
  ) AS distance_km
FROM stores
ORDER BY location <-> ST_MakePoint($1, $2)::geography
LIMIT $3;`;

export const findNearestStores = async (lat: number, lng: number, limit: number) => {
  try {
    const result = await pool.query(DISPLAY_SQL_POSTGIS, [lng, lat, limit]);
    return { sql: DISPLAY_SQL_POSTGIS, rows: result.rows };
  } catch (err: unknown) {
    const msg = (err as Error).message ?? '';
    if (msg.includes('postgis') || msg.includes('function st_') || msg.includes('ST_')) {
      throw new Error('PostGIS extension is not available. Please check database Docker image.');
    }
    throw err;
  }
};

const QUERY_VECTORS: Record<string, number[]> = {
  travel_camera:     [0.9, 0.8, 0.7],
  work_laptop:       [0.2, 0.9, 0.6],
  sport_lightweight: [0.7, 0.2, 0.9],
};

const DISPLAY_SQL_PGVECTOR = `SELECT
  p.name,
  p.category,
  p.price,
  pe.description,
  pe.embedding <-> $1::vector AS distance
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <-> $1::vector
LIMIT 5;`;

export const semanticSearchByType = async (queryType: string) => {
  const vector = QUERY_VECTORS[queryType] ?? QUERY_VECTORS['travel_camera'];
  const vectorStr = `[${vector.join(',')}]`;
  try {
    const result = await pool.query(DISPLAY_SQL_PGVECTOR, [vectorStr]);
    return { sql: DISPLAY_SQL_PGVECTOR, rows: result.rows, vector };
  } catch (err: unknown) {
    const msg = (err as Error).message ?? '';
    if (msg.toLowerCase().includes('vector')) {
      throw new Error('pgvector extension is not available. Please check database Docker image.');
    }
    throw err;
  }
};
