import pool from '../db';

export const findNearbyStores = async (lat: number, lon: number, radiusKm = 5) => {
  const sql = `
    SELECT
      name,
      address,
      ROUND(
        ST_Distance(location::geography, ST_MakePoint($2, $1)::geography) / 1000.0,
        2
      ) AS distance_km
    FROM stores
    WHERE ST_DWithin(
      location::geography,
      ST_MakePoint($2, $1)::geography,
      $3 * 1000
    )
    ORDER BY distance_km
  `;
  const result = await pool.query(sql, [lat, lon, radiusKm]);
  return { sql: sql.trim(), rows: result.rows };
};

export const semanticSearch = async (queryVector: number[]) => {
  if (queryVector.length !== 3) {
    throw new Error('Vector phải có 3 chiều (demo dùng VECTOR(3))');
  }
  const vectorStr = `[${queryVector.join(',')}]`;
  const sql = `
    SELECT
      p.name,
      p.category,
      pe.description,
      pe.embedding,
      ROUND((1 - (pe.embedding <=> $1::vector))::numeric, 4) AS similarity
    FROM product_embeddings pe
    JOIN products p ON pe.product_id = p.id
    ORDER BY pe.embedding <=> $1::vector
    LIMIT 5
  `;
  const result = await pool.query(sql, [vectorStr]);
  return { sql: sql.trim(), rows: result.rows };
};
