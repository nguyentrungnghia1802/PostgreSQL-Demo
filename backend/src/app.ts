import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
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

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/demo/jsonb', jsonbRoutes);
app.use('/api/demo/transaction', transactionRoutes);
app.use('/api/demo/extensions', extensionRoutes);
app.use('/api/demo/optimizer', optimizerRoutes);
app.use('/api/demo/enterprise', enterpriseRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
