import pool from '../db';

export const getFeatureList = async () => {
  return [
    {
      id: 'jsonb',
      title: 'JSONB & Flexible Data',
      description: 'Demo JSONB attributes, Array tags, GIN index search trên sản phẩm',
      endpoint: '/api/demo/jsonb',
    },
    {
      id: 'transaction',
      title: 'ACID Transaction',
      description: 'Demo chuyển tiền giữa Alice/Bob: commit thành công và rollback khi lỗi',
      endpoint: '/api/demo/transaction',
    },
    {
      id: 'postgis',
      title: 'PostGIS — Spatial Query',
      description: 'Demo tìm cửa hàng gần nhất theo tọa độ GPS thực tế',
      endpoint: '/api/demo/postgis',
    },
    {
      id: 'pgvector',
      title: 'pgvector — Semantic Search',
      description: 'Demo tìm kiếm sản phẩm tương tự theo vector embedding',
      endpoint: '/api/demo/pgvector',
    },
    {
      id: 'optimizer',
      title: 'Query Optimizer & EXPLAIN',
      description: 'Demo EXPLAIN ANALYZE trước/sau khi tạo index trên bảng 100k dòng',
      endpoint: '/api/demo/optimizer',
    },
    {
      id: 'trigger',
      title: 'Trigger & Audit Log',
      description: 'Demo trigger tự động ghi audit log khi update sản phẩm',
      endpoint: '/api/demo/trigger',
    },
  ];
};

export const getSampleProducts = async () => {
  const sql = `
    SELECT id, name, category, price, tags, attributes, created_at
    FROM products
    ORDER BY created_at DESC
    LIMIT 5
  `;
  const result = await pool.query(sql);
  return { sql: sql.trim(), rows: result.rows };
};
