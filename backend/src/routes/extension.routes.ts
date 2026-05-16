import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { findNearbyStores, semanticSearch } from '../services/extension.service';

const router = Router();

// PostGIS — tìm cửa hàng gần nhất
router.get('/postgis/nearby', asyncHandler(async (req, res) => {
  const lat = parseFloat((req.query.lat as string) ?? '21.0285');
  const lon = parseFloat((req.query.lon as string) ?? '105.8542');
  const radiusKm = parseFloat((req.query.radius as string) ?? '5');

  const { sql, rows } = await findNearbyStores(lat, lon, radiusKm);
  return sendSuccess(res, {
    feature: 'PostGIS — Spatial Query',
    sql,
    data: { query: { lat, lon, radiusKm }, stores: rows },
    explanation:
      'PostGIS mở rộng PostgreSQL với kiểu dữ liệu địa lý (GEOGRAPHY). ' +
      'ST_DWithin tìm cửa hàng trong bán kính, ST_Distance tính khoảng cách chính xác. ' +
      'GiST index giúp spatial query cực kỳ nhanh ngay cả với triệu điểm dữ liệu.',
  });
}));

// pgvector — semantic search
router.post('/pgvector/search', asyncHandler(async (req, res) => {
  const { vector } = req.body;
  if (!Array.isArray(vector) || vector.length !== 3) {
    return res.status(400).json({
      success: false,
      message: 'Body phải có trường "vector" là mảng 3 số thực (demo dùng VECTOR(3))',
    });
  }

  const { sql, rows } = await semanticSearch(vector);
  return sendSuccess(res, {
    feature: 'pgvector — Semantic Search',
    sql,
    data: { queryVector: vector, results: rows },
    explanation:
      'pgvector mở rộng PostgreSQL với kiểu VECTOR và toán tử <=> (cosine distance). ' +
      'Có thể lưu embedding từ AI model (OpenAI, Sentence Transformers...) và tìm kiếm ngữ nghĩa ' +
      'ngay trong database, không cần Pinecone hay vector database riêng.',
  });
}));

export default router;
