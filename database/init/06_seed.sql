-- 06_seed.sql
-- Demo seed data

-- ============================================================
-- PRODUCTS (JSONB + Array demo)
-- ============================================================
INSERT INTO products (name, category, price, tags, attributes) VALUES
(
  'iPhone 15 Pro',
  'smartphone',
  29990000,
  ARRAY['flagship', 'ios', 'camera'],
  '{"brand": "Apple", "color": "Black", "storage": "256GB", "screen": "6.1 inch", "chip": "A17 Pro"}'::jsonb
),
(
  'Samsung Galaxy S24 Ultra',
  'smartphone',
  27990000,
  ARRAY['flagship', 'android', 'pen'],
  '{"brand": "Samsung", "color": "Titanium", "storage": "512GB", "screen": "6.8 inch", "chip": "Snapdragon 8 Gen 3"}'::jsonb
),
(
  'MacBook Pro 14 M3',
  'laptop',
  49990000,
  ARRAY['apple', 'work', 'developer'],
  '{"brand": "Apple", "color": "Space Gray", "ram": "18GB", "storage": "512GB", "chip": "M3 Pro"}'::jsonb
),
(
  'Dell XPS 15',
  'laptop',
  39990000,
  ARRAY['windows', 'work', 'creator'],
  '{"brand": "Dell", "color": "Silver", "ram": "32GB", "storage": "1TB", "chip": "Intel Core i9"}'::jsonb
),
(
  'Nike Air Max 270',
  'shoes',
  3290000,
  ARRAY['sport', 'running', 'casual'],
  '{"brand": "Nike", "color": "White", "size": "42", "material": "mesh", "sole": "Air Max"}'::jsonb
),
(
  'The North Face Surge Backpack',
  'backpack',
  2890000,
  ARRAY['travel', 'outdoor', 'laptop'],
  '{"brand": "The North Face", "color": "Black", "capacity": "31L", "laptop_slot": "15 inch"}'::jsonb
),
(
  'Sony Alpha A7 IV',
  'camera',
  62990000,
  ARRAY['mirrorless', 'travel', 'professional'],
  '{"brand": "Sony", "color": "Black", "sensor": "Full-frame 33MP", "video": "4K 60fps", "mount": "E-mount"}'::jsonb
),
(
  'Sony WH-1000XM5',
  'headphone',
  8990000,
  ARRAY['wireless', 'noise-cancelling', 'premium'],
  '{"brand": "Sony", "color": "Black", "connectivity": "Bluetooth 5.2", "battery": "30h", "anc": true}'::jsonb
),
(
  'Xiaomi 14 Ultra',
  'smartphone',
  22990000,
  ARRAY['android', 'camera', 'leica'],
  '{"brand": "Xiaomi", "color": "White", "storage": "512GB", "screen": "6.73 inch", "chip": "Snapdragon 8 Gen 3"}'::jsonb
),
(
  'Asus ROG Zephyrus G14',
  'laptop',
  44990000,
  ARRAY['gaming', 'amd', 'portable'],
  '{"brand": "Asus", "color": "Eclipse Gray", "ram": "32GB", "storage": "1TB", "gpu": "RTX 4070"}'::jsonb
);

-- ============================================================
-- ACCOUNTS (ACID Transaction demo)
-- ============================================================
INSERT INTO accounts (owner_name, balance) VALUES
('Alice', 10000000),
('Bob',   2000000);

-- ============================================================
-- STORES with PostGIS coordinates (Hanoi districts)
-- ST_MakePoint(longitude, latitude)
-- ============================================================
INSERT INTO stores (name, address, location) VALUES
(
  'TechStore Hoan Kiem',
  '25 Trang Tien, Hoan Kiem, Hanoi',
  ST_MakePoint(105.8542, 21.0285)::geography
),
(
  'TechStore Cau Giay',
  '11 Nguyen Phong Sac, Cau Giay, Hanoi',
  ST_MakePoint(105.7978, 21.0378)::geography
),
(
  'TechStore Ha Dong',
  '36 Quang Trung, Ha Dong, Hanoi',
  ST_MakePoint(105.7732, 20.9718)::geography
),
(
  'TechStore Ba Dinh',
  '8 Lieu Giai, Ba Dinh, Hanoi',
  ST_MakePoint(105.8180, 21.0388)::geography
),
(
  'TechStore Tay Ho',
  '52 Xuan Dieu, Tay Ho, Hanoi',
  ST_MakePoint(105.8429, 21.0578)::geography
),
(
  'TechStore Long Bien',
  '15 Nguyen Van Cu, Long Bien, Hanoi',
  ST_MakePoint(105.8758, 21.0427)::geography
);

-- ============================================================
-- PRODUCT EMBEDDINGS (pgvector demo — mock VECTOR(3))
-- Vectors represent product characteristics: [price_tier, portability, tech_level]
-- ============================================================
INSERT INTO product_embeddings (product_id, description, embedding)
SELECT
  p.id,
  CASE p.name
    WHEN 'iPhone 15 Pro'             THEN 'Premium smartphone with professional camera system, ideal for photography and travel'
    WHEN 'Sony Alpha A7 IV'          THEN 'Professional full-frame mirrorless camera, perfect for travel and professional photography'
    WHEN 'The North Face Surge Backpack' THEN 'Durable travel backpack with laptop compartment, ideal for outdoor and travel use'
    WHEN 'MacBook Pro 14 M3'         THEN 'High-performance laptop for developers and creative professionals'
    WHEN 'Sony WH-1000XM5'          THEN 'Premium wireless noise-cancelling headphones for travel and work'
    WHEN 'Asus ROG Zephyrus G14'     THEN 'Portable gaming laptop with powerful GPU for gaming enthusiasts'
    WHEN 'Dell XPS 15'               THEN 'Professional laptop for creators and developers with large display'
  END,
  CASE p.name
    WHEN 'iPhone 15 Pro'             THEN '[0.9, 0.8, 0.9]'::vector
    WHEN 'Sony Alpha A7 IV'          THEN '[0.9, 0.7, 0.8]'::vector
    WHEN 'The North Face Surge Backpack' THEN '[0.3, 0.9, 0.2]'::vector
    WHEN 'MacBook Pro 14 M3'         THEN '[0.9, 0.6, 1.0]'::vector
    WHEN 'Sony WH-1000XM5'           THEN '[0.7, 0.9, 0.7]'::vector
    WHEN 'Asus ROG Zephyrus G14'     THEN '[0.8, 0.7, 0.9]'::vector
    WHEN 'Dell XPS 15'               THEN '[0.8, 0.5, 0.9]'::vector
  END
FROM products p
WHERE p.name IN (
  'iPhone 15 Pro',
  'Sony Alpha A7 IV',
  'The North Face Surge Backpack',
  'MacBook Pro 14 M3',
  'Sony WH-1000XM5',
  'Asus ROG Zephyrus G14',
  'Dell XPS 15'
);

-- ============================================================
-- SALES — ~100,000 rows via generate_series (Optimizer demo)
-- ============================================================
INSERT INTO sales (product_name, category, amount, sale_date, region)
SELECT
  (ARRAY[
    'iPhone 15 Pro', 'Samsung Galaxy S24', 'MacBook Pro', 'Dell XPS 15',
    'Nike Air Max', 'Sony Camera', 'Sony Headphone', 'Asus ROG'
  ])[ceil(random() * 8)::int],
  (ARRAY['smartphone', 'laptop', 'shoes', 'camera', 'headphone'])[ceil(random() * 5)::int],
  (random() * 50000000 + 500000)::numeric(12,2),
  CURRENT_DATE - (random() * 365)::int,
  (ARRAY['Hanoi', 'HCM', 'Da Nang', 'Can Tho'])[ceil(random() * 4)::int]
FROM generate_series(1, 100000);
