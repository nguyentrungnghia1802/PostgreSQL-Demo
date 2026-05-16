import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import {
  runQuery,
  explainQuery,
  createSalesIndex,
  dropSalesIndex,
  checkIndexExists,
} from '../services/optimizer.service';

const router = Router();

router.get('/status', asyncHandler(async (_req, res) => {
  const indexExists = await checkIndexExists();
  return sendSuccess(res, {
    feature: 'Query Optimizer Status',
    data: { indexExists },
    explanation: indexExists
      ? 'Index idx_sales_region_date is active. Query will use Index Scan.'
      : 'No index found. Query will use Sequential Scan.',
  });
}));

router.get('/run', asyncHandler(async (req, res) => {
  const region = String(req.query.region ?? 'Hanoi');
  const result = await runQuery(region);
  return sendSuccess(res, {
    feature: 'Query Optimizer — Run Query',
    sql: result.sql,
    data: {
      region,
      totalRevenue: result.totalRevenue,
      rowCount: result.rowCount,
      executionTimeMs: result.executionTimeMs,
    },
    explanation:
      'Run SUM(amount) GROUP BY region for last 30 days. ' +
      'Execution time depends on whether the index exists.',
  });
}));

router.get('/explain', asyncHandler(async (req, res) => {
  const region = String(req.query.region ?? 'Hanoi');
  const result = await explainQuery(region);
  return sendSuccess(res, {
    feature: 'EXPLAIN ANALYZE',
    sql: result.sql,
    data: {
      planSummary: result.planSummary,
      executionTimeMs: result.executionTimeMs,
      planJson: result.planJson,
    },
    explanation:
      'EXPLAIN ANALYZE executes the query and returns the query plan. ' +
      'Seq Scan = full table scan. Index Scan = fast lookup using index.',
  });
}));

router.post('/create-index', asyncHandler(async (_req, res) => {
  const { sql } = await createSalesIndex();
  return sendSuccess(res, {
    feature: 'Create Index',
    sql,
    data: { indexCreated: true },
    explanation: 'Creates a composite index on (region, sale_date) to speed up queries.',
  });
}));

router.post('/drop-index', asyncHandler(async (_req, res) => {
  const { sql } = await dropSalesIndex();
  return sendSuccess(res, {
    feature: 'Drop Index',
    sql,
    data: { indexDropped: true },
    explanation: 'Drops the index so we can demo sequential scan again.',
  });
}));

export default router;
