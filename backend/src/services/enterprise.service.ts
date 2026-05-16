import pool from '../db';

/* ─────────────── 1. Constraint Demo ─────────────── */
const SQL_INVALID_INSERT = `INSERT INTO products(name, category, price)
VALUES ('Invalid Product', 'test', -1000);`;

export const tryInvalidProduct = async () => {
  try {
    await pool.query(SQL_INVALID_INSERT);
    return { constraintWorked: false, databaseError: null };
  } catch (err: unknown) {
    const msg = (err as Error).message ?? 'Unknown database error';
    return { constraintWorked: true, databaseError: msg };
  }
};

/* ─────────────── 2. Trigger + Audit Log Demo ─────────────── */
const SQL_UPDATE_PRICE = `UPDATE products
SET price = price + $1
WHERE name = $2
RETURNING *;`;

const SQL_LATEST_AUDIT = `SELECT id, table_name, action, old_data, new_data, created_at
FROM audit_logs
WHERE table_name = 'products'
ORDER BY created_at DESC
LIMIT 1;`;

export const updateProductPrice = async (productName: string, increaseAmount: number) => {
  const updateResult = await pool.query(SQL_UPDATE_PRICE, [increaseAmount, productName]);
  const updatedProduct = updateResult.rows[0] ?? null;

  const auditResult = await pool.query(SQL_LATEST_AUDIT);
  const latestAuditLog = auditResult.rows[0] ?? null;

  return { updatedProduct, latestAuditLog, updateSql: SQL_UPDATE_PRICE };
};

const SQL_AUDIT_LOGS = `SELECT id, table_name, action, old_data, new_data, created_at
FROM audit_logs
ORDER BY created_at DESC
LIMIT 10;`;

export const getAuditLogs = async () => {
  const result = await pool.query(SQL_AUDIT_LOGS);
  return { rows: result.rows, sql: SQL_AUDIT_LOGS };
};

/* ─────────────── 3. View Demo ─────────────── */
const SQL_REVENUE_VIEW = `SELECT * FROM revenue_by_region ORDER BY total_revenue DESC;`;

export const getRevenueByRegion = async () => {
  const result = await pool.query(SQL_REVENUE_VIEW);
  return { rows: result.rows, sql: SQL_REVENUE_VIEW };
};
