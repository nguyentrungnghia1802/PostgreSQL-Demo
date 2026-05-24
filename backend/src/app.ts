import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import healthRoutes from './routes/health.routes';
import demoRoutes from './routes/demo.routes';
import jsonbRoutes from './routes/jsonb.routes';
import transactionRoutes from './routes/transaction.routes';
import extensionRoutes from './routes/extension.routes';
import optimizerRoutes from './routes/optimizer.routes';
import enterpriseRoutes from './routes/enterprise.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files if dist exists
const FRONTEND_DIST = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
}

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/demo/jsonb', jsonbRoutes);
app.use('/api/demo/transaction', transactionRoutes);
app.use('/api/demo/extensions', extensionRoutes);
app.use('/api/demo/optimizer', optimizerRoutes);
app.use('/api/demo/enterprise', enterpriseRoutes);

// SPA fallback — must be after all API routes
if (fs.existsSync(FRONTEND_DIST)) {
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// 404 handler (only reached when frontend dist is absent)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
