import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { getFeatureList, getSampleProducts, resetAll, getCounts } from '../services/demo.service';

const router = Router();

router.get('/features', asyncHandler(async (_req, res) => {
  const features = await getFeatureList();
  return sendSuccess(res, {
    feature: 'demo-features',
    data: features,
    explanation: 'Danh sách các PostgreSQL feature được demo trong project này.',
  });
}));

router.get('/products/sample', asyncHandler(async (_req, res) => {
  const { sql, rows } = await getSampleProducts();
  return sendSuccess(res, {
    feature: 'sample-products',
    sql,
    data: rows,
    explanation: 'Lấy vài sản phẩm mẫu để xác nhận database có dữ liệu.',
  });
}));

router.post('/reset-all', asyncHandler(async (_req, res) => {
  await resetAll();
  return sendSuccess(res, {
    feature: 'reset-all',
    data: { reset: true, message: 'Demo data reset successfully' },
    explanation: 'Alice/Bob balances restored, transfer_logs cleared, optimizer index dropped, audit_logs cleared.',
  });
}));

router.get('/counts', asyncHandler(async (_req, res) => {
  const counts = await getCounts();
  return sendSuccess(res, {
    feature: 'counts',
    data: counts,
    explanation: 'Record counts for all demo tables.',
  });
}));

export default router;
