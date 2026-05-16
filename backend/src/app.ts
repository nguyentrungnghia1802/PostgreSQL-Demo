import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

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
