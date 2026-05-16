import pool from '../db';

export const explainWithoutIndex = async () => {
  const sql = `
    EXPLAIN (ANALYZE, FORMAT TEXT)
    SELECT region, SUM(amount) AS total
    FROM sales
    WHERE region = 'Hanoi' AND sale_date >= '2024-01-01'
    GROUP BY region
  `;
  const result = await pool.query(sql);
  const plan = result.rows.map((r: any) => Object.values(r)[0]).join('\n');
  return { sql: sql.trim(), plan };
};

export const createSalesIndex = async () => {
  const sql = `
    CREATE INDEX IF NOT EXISTS idx_sales_region_date
    ON sales (region, sale_date)
  `;
  await pool.query(sql);
  return { sql: sql.trim() };
};

export const dropSalesIndex = async () => {
  const sql = `DROP INDEX IF EXISTS idx_sales_region_date`;
  await pool.query(sql);
  return { sql: sql.trim() };
};

export const explainWithIndex = async () => {
  const sql = `
    EXPLAIN (ANALYZE, FORMAT TEXT)
    SELECT region, SUM(amount) AS total
    FROM sales
    WHERE region = 'Hanoi' AND sale_date >= '2024-01-01'
    GROUP BY region
  `;
  const result = await pool.query(sql);
  const plan = result.rows.map((r: any) => Object.values(r)[0]).join('\n');
  return { sql: sql.trim(), plan };
};

export const checkIndexExists = async () => {
  const result = await pool.query(
    `SELECT 1 FROM pg_indexes WHERE indexname = 'idx_sales_region_date'`
  );
  return result.rows.length > 0;
};
