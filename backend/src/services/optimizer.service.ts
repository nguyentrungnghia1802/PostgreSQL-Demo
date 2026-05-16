import pool from '../db';

const QUERY_SQL = (region: string) =>
  `SELECT region, SUM(amount) AS total_revenue\nFROM sales\nWHERE region = '${region}'\n  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY region;`;

const EXPLAIN_SQL = (region: string) =>
  `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)\nSELECT region, SUM(amount) AS total_revenue\nFROM sales\nWHERE region = '${region}'\n  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'\nGROUP BY region;`;

/** Recursively find first leaf scan type in EXPLAIN JSON plan */
function extractScanType(plan: any): string {
  if (!plan) return 'Unknown';
  const nodeType: string = plan['Node Type'] ?? '';
  const scanKeywords = ['Seq Scan', 'Index Scan', 'Bitmap Index Scan', 'Index Only Scan', 'Bitmap Heap Scan'];
  if (scanKeywords.some((k) => nodeType.includes(k))) return nodeType;
  const children: any[] = plan['Plans'] ?? [];
  for (const child of children) {
    const found = extractScanType(child);
    if (found !== 'Unknown') return found;
  }
  return nodeType || 'Unknown';
}

export const runQuery = async (region: string) => {
  const displaySql = QUERY_SQL(region);
  const start = process.hrtime.bigint();
  const result = await pool.query(
    `SELECT region, SUM(amount) AS total_revenue
     FROM sales
     WHERE region = $1
       AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY region`,
    [region]
  );
  const elapsed = Number(process.hrtime.bigint() - start) / 1_000_000;
  const row = result.rows[0];
  return {
    sql: displaySql,
    totalRevenue: row ? Number(row.total_revenue) : 0,
    rowCount: result.rowCount ?? 0,
    executionTimeMs: Math.round(elapsed * 100) / 100,
  };
};

export const explainQuery = async (region: string) => {
  const displaySql = EXPLAIN_SQL(region);
  const result = await pool.query(
    `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
     SELECT region, SUM(amount) AS total_revenue
     FROM sales
     WHERE region = $1
       AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
     GROUP BY region`,
    [region]
  );
  const planJson = result.rows[0]['QUERY PLAN'][0];
  const planSummary = extractScanType(planJson['Plan']);
  const executionTimeMs =
    typeof planJson['Execution Time'] === 'number'
      ? Math.round(planJson['Execution Time'] * 100) / 100
      : null;
  return { sql: displaySql, planJson, planSummary, executionTimeMs };
};

export const createSalesIndex = async () => {
  const sql = `CREATE INDEX IF NOT EXISTS idx_sales_region_date\nON sales (region, sale_date);`;
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_sales_region_date ON sales (region, sale_date)`);
  return { sql };
};

export const dropSalesIndex = async () => {
  const sql = `DROP INDEX IF EXISTS idx_sales_region_date;`;
  await pool.query(`DROP INDEX IF EXISTS idx_sales_region_date`);
  return { sql };
};

export const checkIndexExists = async () => {
  const result = await pool.query(
    `SELECT 1 FROM pg_indexes WHERE indexname = 'idx_sales_region_date'`
  );
  return result.rows.length > 0;
};

// Keep old helpers for backward compat with existing routes
export const explainWithoutIndex = async () => {
  await dropSalesIndex();
  return explainQuery('Hanoi');
};

export const explainWithIndex = async () => {
  await createSalesIndex();
  return explainQuery('Hanoi');
};
