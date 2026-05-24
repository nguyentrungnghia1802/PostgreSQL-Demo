import pool from '../db';

export const queryJsonb = async (
  category?: string,
  brand?: string,
  color?: string,
  tag?: string
) => {
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
  if (color) {
    conditions.push(`attributes->>'color' = $${idx++}`);
    params.push(color);
  }
  if (tag) {
    conditions.push(`$${idx++} = ANY(tags)`);
    params.push(tag);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Build human-readable demo SQL
  const demoConditions: string[] = [];
  if (category) demoConditions.push(`category = '${category}'`);
  if (brand) demoConditions.push(`attributes->>'brand' = '${brand}'`);
  if (color) demoConditions.push(`attributes->>'color' = '${color}'`);
  if (tag) demoConditions.push(`tags @> ARRAY['${tag}']`);
  const demoWhere = demoConditions.length > 0 ? `WHERE ${demoConditions.join('\n  AND ')}` : '';

  const displaySql = `SELECT name, category, price, attributes, tags\nFROM products\n${demoWhere ? demoWhere + '\n' : ''}ORDER BY name;`;

  const execSql = `SELECT id, name, category, price, tags, attributes FROM products ${where} ORDER BY name`;
  const result = await pool.query(execSql, params);
  return { sql: displaySql, rows: result.rows };
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
