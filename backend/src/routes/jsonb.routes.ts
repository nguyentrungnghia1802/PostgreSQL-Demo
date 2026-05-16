import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { queryJsonb, queryByTag, queryJsonbOperators } from '../services/jsonb.service';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { category, brand } = req.query as { category?: string; brand?: string };
  const { sql, rows } = await queryJsonb(category, brand);
  return sendSuccess(res, {
    feature: 'JSONB & Flexible Data',
    sql,
    data: rows,
    explanation:
      'PostgreSQL JSONB cho phép lưu trữ và truy vấn dữ liệu bán cấu trúc với hiệu năng cao. ' +
      'GIN index giúp tìm kiếm trong JSONB và Array cực kỳ nhanh.',
  });
}));

router.get('/tag', asyncHandler(async (req, res) => {
  const { tag } = req.query as { tag?: string };
  if (!tag) {
    return res.status(400).json({ success: false, message: 'tag query param is required' });
  }
  const { sql, rows } = await queryByTag(tag);
  return sendSuccess(res, {
    feature: 'Array — ANY operator',
    sql,
    data: rows,
    explanation:
      'PostgreSQL TEXT[] array dùng ANY() để tìm sản phẩm có tag tương ứng. ' +
      'GIN index trên cột tags giúp tìm kiếm O(log n).',
  });
}));

router.get('/operators', asyncHandler(async (_req, res) => {
  const { sql, rows } = await queryJsonbOperators();
  return sendSuccess(res, {
    feature: 'JSONB Operators',
    sql,
    data: rows,
    explanation:
      'Dùng -> để lấy object, ->> để lấy text, ? để kiểm tra key tồn tại trong JSONB. ' +
      'PostgreSQL hỗ trợ đầy đủ các toán tử JSONB mà hầu hết RDBMS khác không có.',
  });
}));

export default router;
