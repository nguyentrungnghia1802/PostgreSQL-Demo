import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import {
  explainWithoutIndex,
  explainWithIndex,
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
      ? 'Index idx_sales_region_date đang tồn tại. Query sẽ dùng Index Scan.'
      : 'Index idx_sales_region_date chưa có. Query sẽ dùng Sequential Scan.',
  });
}));

router.get('/explain/before', asyncHandler(async (_req, res) => {
  await dropSalesIndex();
  const { sql, plan } = await explainWithoutIndex();
  return sendSuccess(res, {
    feature: 'EXPLAIN ANALYZE — No Index (Seq Scan)',
    sql,
    data: { plan },
    explanation:
      'Không có index → PostgreSQL phải đọc toàn bộ 100,000 dòng (Sequential Scan). ' +
      'Cost cao, thời gian thực thi lâu hơn nhiều.',
  });
}));

router.get('/explain/after', asyncHandler(async (_req, res) => {
  await createSalesIndex();
  const { sql, plan } = await explainWithIndex();
  return sendSuccess(res, {
    feature: 'EXPLAIN ANALYZE — With Index (Index Scan)',
    sql,
    data: { plan },
    explanation:
      'Sau khi tạo index trên (region, sale_date) → PostgreSQL dùng Index Scan. ' +
      'Cost giảm đáng kể, chỉ đọc các rows liên quan thay vì toàn bộ bảng.',
  });
}));

router.post('/index/create', asyncHandler(async (_req, res) => {
  const { sql } = await createSalesIndex();
  return sendSuccess(res, {
    feature: 'Create Index',
    sql,
    data: { indexCreated: true },
    explanation: 'Tạo composite index trên (region, sale_date) để tăng tốc độ truy vấn.',
  });
}));

router.post('/index/drop', asyncHandler(async (_req, res) => {
  const { sql } = await dropSalesIndex();
  return sendSuccess(res, {
    feature: 'Drop Index',
    sql,
    data: { indexDropped: true },
    explanation: 'Xóa index để demo lại sequential scan.',
  });
}));

export default router;
