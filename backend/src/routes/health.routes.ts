import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

// GET /api/health — backend health check
router.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'backend' });
});

// GET /api/health/db — database health check
router.get('/db', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT 1 AS result');
    res.json({
      status: 'ok',
      service: 'database',
      result: result.rows[0].result,
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'database',
      message: (error as Error).message,
    });
  }
});

export default router;
