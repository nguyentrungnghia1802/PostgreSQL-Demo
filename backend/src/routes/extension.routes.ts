import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { findNearestStores, semanticSearchByType } from '../services/extension.service';

const router = Router();

// GET /api/demo/extensions/postgis/nearest
router.get('/postgis/nearest', asyncHandler(async (req, res) => {
  const lat   = parseFloat(String(req.query.lat   ?? '21.0285'));
  const lng   = parseFloat(String(req.query.lng   ?? '105.8542'));
  const limit = parseInt(String(req.query.limit   ?? '5'), 10);

  const { sql, rows } = await findNearestStores(lat, lng, limit);
  return sendSuccess(res, {
    feature: 'PostGIS — Nearest Stores',
    sql,
    data: { query: { lat, lng, limit }, stores: rows },
    explanation:
      'PostGIS extends PostgreSQL with geographic data types (GEOGRAPHY). ' +
      'ST_MakePoint(lng, lat) creates a point. The <-> operator uses a GiST index ' +
      'for fast nearest-neighbor search. ST_Distance returns exact distance in meters.',
  });
}));

// POST /api/demo/extensions/pgvector/search
router.post('/pgvector/search', asyncHandler(async (req, res) => {
  const queryType = String(req.body.queryType ?? 'travel_camera');
  const { sql, rows, vector } = await semanticSearchByType(queryType);
  return sendSuccess(res, {
    feature: 'pgvector — Semantic Search',
    sql,
    data: { queryType, vector, results: rows },
    explanation:
      'pgvector extends PostgreSQL with the VECTOR type and <-> distance operator. ' +
      'Embeddings from AI models (OpenAI, Sentence Transformers…) are stored directly ' +
      'in the database. Nearest-neighbor search runs with an IVFFlat or HNSW index.',
  });
}));

export default router;
