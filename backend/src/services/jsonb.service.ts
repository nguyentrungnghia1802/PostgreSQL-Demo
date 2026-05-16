import pool from '../db';

export const queryJsonb = async (category?: string, brand?: string) => {
  const conditions: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (category) {
    conditions.push(`category = $${idx++}`);
    params.push(category);
  }
  if (brand) {
    conditions.push(`attributes->>'brand' = $${idx++}`);
    params.push(brand);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `
    SELECT id, name, category, price, tags, attributes
    FROM products
    ${where}
    ORDER BY name
  `;

  const result = await pool.query(sql, params);
  return { sql: sql.trim(), rows: result.rows };
};

export const queryByTag = async (tag: string) => {
  const sql = `
    SELECT id, name, category, price, tags, attributes
    FROM products
    WHERE $1 = ANY(tags)
    ORDER BY name
  `;
  const result = await pool.query(sql, [tag]);
  return { sql: sql.trim(), rows: result.rows };
};

export const queryJsonbOperators = async () => {
  const sql = `
    SELECT
      name,
      attributes->>'brand'              AS brand,
      attributes->>'color'              AS color,
      (attributes->>'ram_gb')::int       AS ram_gb,
      (attributes->>'storage_gb')::int   AS storage_gb,
      tags
    FROM products
    WHERE attributes ? 'brand'
    ORDER BY name
  `;
  const result = await pool.query(sql);
  return { sql: sql.trim(), rows: result.rows };
};
