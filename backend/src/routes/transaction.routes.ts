import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import {
  getTransactionState,
  resetTransactionDemo,
  transferSuccess,
  transferFailure,
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
    sql: "DELETE FROM transfer_logs;\nUPSERT accounts SET balance = ... WHERE owner_name IN ('Alice','Bob');",
    data: state,
    explanation: 'Reset lại số dư Alice = 10,000,000 VND, Bob = 2,000,000 VND. Xóa toàn bộ transfer_logs.',
  });
}));

router.post('/success', asyncHandler(async (_req, res) => {
  const result = await transferSuccess();
  return sendSuccess(res, {
    feature: 'ACID Transaction',
    sql: result.sql,
    data: {
      beforeState: result.beforeState,
      afterState: result.afterState,
      transactionStatus: result.transactionStatus,
    },
    explanation:
      'Chuyển 3,000,000 VND từ Alice sang Bob thành công. ' +
      'SELECT ... FOR UPDATE giữ row-level lock suốt transaction. ' +
      'COMMIT đảm bảo toàn bộ thay đổi được lưu vĩnh viễn (Durability).',
  });
}));

router.post('/failure', asyncHandler(async (_req, res) => {
  const result = await transferFailure();
  return sendSuccess(res, {
    feature: 'ACID Transaction',
    sql: result.sql,
    data: {
      beforeState: result.beforeState,
      afterState: result.afterState,
      transactionStatus: result.transactionStatus,
    },
    explanation:
      'Transaction bị ROLLBACK do lỗi xảy ra giữa chừng (division by zero). ' +
      'Số dư Alice và Bob không thay đổi — PostgreSQL đảm bảo Atomicity.',
  });
}));

export default router;
