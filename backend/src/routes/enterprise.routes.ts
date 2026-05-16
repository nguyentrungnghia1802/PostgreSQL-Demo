import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import {
  tryInvalidProduct,
  updateProductPrice,
  getAuditLogs,
  getRevenueByRegion,
} from '../services/enterprise.service';

const router = Router();

// POST /api/demo/enterprise/constraint/invalid-product
router.post('/constraint/invalid-product', asyncHandler(async (_req, res) => {
  const result = await tryInvalidProduct();
  return sendSuccess(res, {
    feature: 'CHECK Constraint',
    sql: `INSERT INTO products(name, category, price)\nVALUES ('Invalid Product', 'test', -1000);`,
    data: {
      constraintWorked: result.constraintWorked,
      databaseError: result.databaseError,
    },
    explanation:
      'PostgreSQL rejected the INSERT because price = -1000 violates ' +
      'CHECK (price > 0). The database enforces data integrity at the schema level, ' +
      'not just in application code.',
  });
}));

// POST /api/demo/enterprise/audit/update-product-price
router.post('/audit/update-product-price', asyncHandler(async (req, res) => {
  const productName    = String(req.body.productName    ?? 'iPhone 15 Pro');
  const increaseAmount = Number(req.body.increaseAmount ?? 1_000_000);

  const { updatedProduct, latestAuditLog, updateSql } = await updateProductPrice(productName, increaseAmount);

  return sendSuccess(res, {
    feature: 'Trigger + Audit Log',
    sql: updateSql,
    data: { updatedProduct, latestAuditLog },
    explanation:
      'The trigger trg_products_audit fires AFTER UPDATE on the products table. ' +
      'It automatically calls log_product_changes(), which writes old_data and ' +
      'new_data as JSONB into audit_logs — no application code required.',
  });
}));

// GET /api/demo/enterprise/audit/logs
router.get('/audit/logs', asyncHandler(async (_req, res) => {
  const { rows, sql } = await getAuditLogs();
  return sendSuccess(res, {
    feature: 'Audit Log',
    sql,
    data: { logs: rows, count: rows.length },
    explanation: 'Recent audit records written automatically by the PostgreSQL trigger.',
  });
}));

// GET /api/demo/enterprise/views/revenue-by-region
router.get('/views/revenue-by-region', asyncHandler(async (_req, res) => {
  const { rows, sql } = await getRevenueByRegion();
  return sendSuccess(res, {
    feature: 'View — revenue_by_region',
    sql,
    data: { rows },
    explanation:
      'revenue_by_region is a PostgreSQL VIEW that encapsulates the GROUP BY aggregation. ' +
      'Query it like a table: SELECT * FROM revenue_by_region. ' +
      'It hides complexity and can be reused across many queries.',
  });
}));

export default router;
