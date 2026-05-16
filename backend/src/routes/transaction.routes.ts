import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import {
  getTransactionState,
  resetTransactionDemo,
  transferSuccess,
  transferRollback,
} from '../services/transaction.service';

const router = Router();

router.get('/state', asyncHandler(async (_req, res) => {
  const state = await getTransactionState();
  return sendSuccess(res, {
    feature: 'ACID Transaction State',
    data: state,
    explanation: 'Số dư hiện tại của Alice và Bob cùng số lần chuyển tiền đã thực hiện.',
  });
}));

router.post('/reset', asyncHandler(async (_req, res) => {
  await resetTransactionDemo();
  const state = await getTransactionState();
  return sendSuccess(res, {
    feature: 'ACID Transaction Reset',
    sql: `DELETE FROM transfer_logs;\nUPSERT accounts SET balance = ... WHERE owner_name IN ('Alice','Bob');`,
    data: state,
    explanation: 'Reset lại số dư Alice = 10,000,000 VND, Bob = 2,000,000 VND. Xóa toàn bộ transfer_logs.',
  });
}));

router.post('/transfer/success', asyncHandler(async (req, res) => {
  const amount = Number(req.body?.amount ?? 500000);
  const sql = await transferSuccess(amount);
  const state = await getTransactionState();
  return sendSuccess(res, {
    feature: 'ACID Transaction — COMMIT',
    sql,
    data: { amount, ...state },
    explanation:
      'Chuyển tiền thành công: debit Alice và credit Bob trong một transaction. ' +
      'Nếu bất kỳ bước nào lỗi, toàn bộ transaction bị ROLLBACK — đảm bảo tính Atomicity.',
  });
}));

router.post('/transfer/rollback', asyncHandler(async (req, res) => {
  const amount = Number(req.body?.amount ?? 999999999);
  const sql = await transferRollback(amount);
  const state = await getTransactionState();
  return sendSuccess(res, {
    feature: 'ACID Transaction — ROLLBACK',
    sql,
    data: { amount, ...state },
    explanation:
      'Transaction bị ROLLBACK do lỗi xảy ra giữa chừng. ' +
      'Số dư Alice và Bob không thay đổi — PostgreSQL đảm bảo Atomicity.',
  });
}));

export default router;
