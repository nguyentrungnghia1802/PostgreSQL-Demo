# BẢN THIẾT KẾ ĐƠN GIẢN HÓA PHẦN MỀM DEMO POSTGRESQL

# PostgreSQL Feature Showcase

## 1. Định hướng lại bài toán

### 1.1. Vấn đề của bản thiết kế cũ

Bản thiết kế trước đi theo hướng xây một phần mềm thương mại điện tử khá đầy đủ. Cách đó có ưu điểm là thực tế, nhưng nhược điểm là quá nặng nếu mục tiêu chính chỉ là **demo điểm mạnh của PostgreSQL**.

Nếu làm quá giống một sản phẩm thật, nhóm sẽ phải tốn nhiều thời gian cho các phần không trực tiếp làm nổi bật PostgreSQL, ví dụ:

- Đăng nhập.
- Giỏ hàng.
- Quản lý sản phẩm đầy đủ.
- Quản lý người dùng.
- Quản lý đơn hàng phức tạp.
- Giao diện bán hàng.
- Nghiệp vụ thương mại điện tử.

Những phần đó có thể làm bài demo bị loãng. Người xem có thể nhớ rằng nhóm làm một app bán hàng, nhưng lại không nhớ rõ **PostgreSQL mạnh ở đâu**.

Vì vậy, nên đổi hướng:

> Không xây một sản phẩm lớn. Chỉ xây một công cụ demo nhỏ, có các màn hình trực tiếp trình diễn từng điểm mạnh của PostgreSQL.

---

## 2. Tên phần mềm đề xuất

# PostgreSQL Feature Showcase

Tên tiếng Việt có thể dùng khi trình bày:

# Công cụ Demo Sức mạnh PostgreSQL

Mô tả ngắn:

> Đây là một web app nhỏ dùng để trình diễn các năng lực nổi bật của PostgreSQL thông qua các tình huống trực quan: dữ liệu JSONB, transaction rollback, extension, AI vector search, bản đồ, index và query optimizer.

---

## 3. Mục tiêu chính

Phần mềm này cần trả lời được câu hỏi:

> Tại sao PostgreSQL được xem là một DBMS open-source mạnh, linh hoạt và gần với enterprise-level?

Không cần làm một app lớn. Chỉ cần chứng minh rõ các điểm sau:

1. PostgreSQL xử lý tốt dữ liệu phức tạp.
2. PostgreSQL đảm bảo an toàn dữ liệu bằng ACID transaction.
3. PostgreSQL mở rộng mạnh nhờ extension.
4. PostgreSQL hỗ trợ các bài toán hiện đại như AI search và dữ liệu bản đồ.
5. PostgreSQL có query optimizer và index mạnh cho truy vấn lớn.

---

## 4. Nguyên tắc thiết kế mới

### 4.1. Không làm sản phẩm hoàn chỉnh

Không cần:

- Login thật.
- Phân quyền thật.
- Giỏ hàng hoàn chỉnh.
- Trang admin phức tạp.
- CRUD đầy đủ.
- Thanh toán thật.
- Deploy production.

### 4.2. Chỉ làm các demo trực tiếp

Mỗi màn hình chỉ cần trả lời một câu:

> Điểm mạnh PostgreSQL nào đang được chứng minh ở đây?

Ví dụ:

| Màn hình | Điểm mạnh cần show |
|---|---|
| JSONB Demo | PostgreSQL vừa giống SQL vừa xử lý dữ liệu linh hoạt như NoSQL |
| Transaction Demo | PostgreSQL đảm bảo rollback chính xác khi lỗi |
| Extension Demo | PostgreSQL mở rộng được bằng PostGIS, pgvector |
| Optimizer Demo | PostgreSQL tối ưu query tốt với index và EXPLAIN ANALYZE |

### 4.3. Mỗi demo phải có 4 phần

Mỗi màn hình demo nên có cùng cấu trúc:

```text
1. Tình huống thực tế
2. Dữ liệu đang lưu trong PostgreSQL
3. SQL query được chạy
4. Kết quả + ý nghĩa của PostgreSQL feature
```

Điểm cực kỳ quan trọng:

> Phải hiển thị SQL query trên giao diện.

Vì mục tiêu là demo PostgreSQL, người xem cần thấy PostgreSQL thực sự đang làm gì.

---

## 5. Ý tưởng phần mềm sau khi đơn giản hóa

Thay vì làm app bán hàng hoàn chỉnh, ta làm một dashboard gồm các demo độc lập.

## PostgreSQL Feature Showcase Dashboard

Gồm 5 demo chính:

```text
Demo 1: Flexible Data Demo
PostgreSQL với JSONB, Array, UUID, Custom Type

Demo 2: ACID Transaction Demo
PostgreSQL rollback chính xác khi lỗi

Demo 3: Extension Demo
PostGIS cho bản đồ và pgvector cho AI search

Demo 4: Query Optimizer Demo
Index, EXPLAIN ANALYZE, query performance

Demo 5: Enterprise Reliability Demo
Constraint, trigger, audit log, view/materialized view
```

Trong đó, nếu thời gian ít, chỉ cần làm chắc 3 demo đầu:

```text
1. JSONB Demo
2. Transaction Demo
3. Optimizer Demo
```

Nếu muốn nổi bật hơn, thêm:

```text
4. pgvector Demo
5. PostGIS Demo
```

---

# 6. Tổng quan hệ thống đơn giản

## 6.1. Kiến trúc

```text
Frontend đơn giản
React / Next.js
        ↓
Backend API
Node.js + Express
        ↓
PostgreSQL
```

### Công nghệ đề xuất

```text
Frontend: React hoặc Next.js
Backend: Node.js + Express
Database: PostgreSQL
Database library: node-postgres hoặc Prisma + raw SQL
UI: Tailwind CSS
Chart: Recharts nếu cần
Map: Leaflet nếu làm PostGIS
```

### Vì sao nên dùng raw SQL?

Vì đây là demo PostgreSQL. Nếu dùng ORM quá nhiều, người xem sẽ không thấy được sức mạnh thật của SQL và PostgreSQL.

Khuyến nghị:

> Backend nên dùng `node-postgres` để viết SQL trực tiếp cho các demo chính.

---

## 6.2. Sơ đồ module đơn giản

```text
PostgreSQL Feature Showcase
│
├── Demo Dashboard
│
├── JSONB Demo
│
├── Transaction Demo
│
├── Extension Demo
│   ├── pgvector AI Search
│   └── PostGIS Nearest Store
│
├── Optimizer Demo
│
└── Enterprise Feature Demo
    ├── Constraint
    ├── Trigger
    └── Materialized View
```

---

# 7. Database cần thiết

Chỉ cần một số bảng tối thiểu.

## 7.1. Danh sách bảng đơn giản

| Bảng | Mục đích |
|---|---|
| products | Demo JSONB, Array, UUID |
| accounts | Demo transaction chuyển tiền |
| transfer_logs | Ghi lịch sử chuyển tiền |
| stores | Demo PostGIS |
| product_embeddings | Demo pgvector |
| sales | Demo optimizer, index, analytics |
| audit_logs | Demo trigger, audit |

Không cần bảng users, carts, orders, order_items phức tạp như bản trước.

---

# 8. PostgreSQL extensions cần dùng

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

Ý nghĩa:

| Extension | Dùng để demo |
|---|---|
| pgcrypto | Tạo UUID bằng `gen_random_uuid()` |
| postgis | Xử lý dữ liệu bản đồ/GPS |
| vector | Lưu và tìm kiếm vector embedding cho AI search |

Nếu cài đặt `postgis` hoặc `vector` khó, có thể chia thành:

- Bản bắt buộc: `pgcrypto`.
- Bản nâng cao: `postgis`, `vector`.

---

# 9. Custom Type đơn giản

## 9.1. Tạo kiểu dữ liệu trạng thái chuyển tiền

```sql
CREATE TYPE transfer_status AS ENUM (
    'PENDING',
    'SUCCESS',
    'FAILED'
);
```

Ý nghĩa demo:

> PostgreSQL cho phép tạo custom type để dữ liệu chặt chẽ hơn, tránh nhập status tùy tiện như `success`, `succeed`, `done`, `ok`.

---

# 10. Thiết kế bảng tối giản

## 10.1. Bảng products — Demo JSONB, Array, UUID

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price > 0),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Ví dụ dữ liệu:

```sql
INSERT INTO products (name, category, price, tags, attributes)
VALUES
(
    'iPhone 15 Pro',
    'smartphone',
    28990000,
    ARRAY['premium', 'camera', 'travel'],
    '{
        "brand": "Apple",
        "color": "Black",
        "storage": "256GB",
        "camera": "48MP",
        "battery": "Good"
    }'
),
(
    'Dell XPS 13',
    'laptop',
    32990000,
    ARRAY['work', 'lightweight', 'premium'],
    '{
        "brand": "Dell",
        "cpu": "Intel Core i7",
        "ram": "16GB",
        "ssd": "512GB",
        "screen": "13 inch"
    }'
),
(
    'Nike Running Shoes',
    'shoes',
    2990000,
    ARRAY['sport', 'running', 'lightweight'],
    '{
        "brand": "Nike",
        "size": 42,
        "material": "Mesh",
        "use_case": "Running"
    }'
);
```

Điểm cần show:

- Mỗi loại sản phẩm có thuộc tính khác nhau.
- Smartphone có camera, storage.
- Laptop có CPU, RAM, SSD.
- Shoes có size, material.
- Không cần tạo quá nhiều cột cố định.

---

## 10.2. Bảng accounts — Demo ACID transaction

```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_name TEXT NOT NULL,
    balance NUMERIC(12, 2) NOT NULL CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);
```

Ví dụ dữ liệu:

```sql
INSERT INTO accounts (owner_name, balance)
VALUES
('Alice', 10000000),
('Bob', 2000000);
```

---

## 10.3. Bảng transfer_logs — Ghi lịch sử giao dịch

```sql
CREATE TABLE transfer_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account UUID REFERENCES accounts(id),
    to_account UUID REFERENCES accounts(id),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status transfer_status NOT NULL DEFAULT 'PENDING',
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Điểm cần show:

- Khi giao dịch thành công, tiền chuyển từ Alice sang Bob.
- Khi lỗi giữa chừng, PostgreSQL rollback toàn bộ.
- Không có chuyện Alice bị trừ tiền nhưng Bob chưa nhận được.

---

## 10.4. Bảng stores — Demo PostGIS

```sql
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL
);
```

Ví dụ dữ liệu:

```sql
INSERT INTO stores (name, address, location)
VALUES
(
    'Store Hoan Kiem',
    'Hoan Kiem, Hanoi',
    ST_MakePoint(105.8542, 21.0285)::geography
),
(
    'Store Cau Giay',
    'Cau Giay, Hanoi',
    ST_MakePoint(105.7906, 21.0362)::geography
),
(
    'Store Ha Dong',
    'Ha Dong, Hanoi',
    ST_MakePoint(105.7788, 20.9712)::geography
);
```

---

## 10.5. Bảng product_embeddings — Demo pgvector

```sql
CREATE TABLE product_embeddings (
    product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    embedding VECTOR(3)
);
```

Ở bản demo đơn giản, dùng `VECTOR(3)` để dễ seed dữ liệu giả.

Ví dụ:

```sql
INSERT INTO product_embeddings (product_id, description, embedding)
SELECT
    id,
    'Premium smartphone with excellent camera for travel',
    '[0.9, 0.8, 0.7]'
FROM products
WHERE name = 'iPhone 15 Pro';
```

Ghi chú:

- Bản đơn giản dùng vector giả.
- Khi trình bày, giải thích rằng trong hệ thống thật, vector này được tạo từ AI embedding model.
- Mục tiêu demo là cho thấy PostgreSQL có thể lưu và truy vấn vector.

---

## 10.6. Bảng sales — Demo optimizer và analytics

```sql
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    sale_date DATE NOT NULL,
    region TEXT NOT NULL
);
```

Dùng bảng này để seed nhiều dữ liệu, ví dụ 50.000 đến 200.000 dòng.

Mục tiêu:

- Chạy query chậm khi chưa có index.
- Tạo index.
- Chạy lại nhanh hơn.
- Show `EXPLAIN ANALYZE`.

---

## 10.7. Bảng audit_logs — Demo trigger

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    action TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Mục tiêu:

- Khi update product, PostgreSQL tự ghi log.
- Chứng minh database có thể tự bảo vệ và theo dõi thay đổi dữ liệu.

---

# 11. Index cần tạo

## 11.1. Index cho JSONB

```sql
CREATE INDEX idx_products_attributes_gin
ON products USING GIN (attributes);
```

## 11.2. Index cho Array

```sql
CREATE INDEX idx_products_tags_gin
ON products USING GIN (tags);
```

## 11.3. Index cho PostGIS

```sql
CREATE INDEX idx_stores_location_gist
ON stores USING GIST (location);
```

## 11.4. Index cho sales performance demo

Ban đầu chưa tạo index này.

Khi demo mới tạo:

```sql
CREATE INDEX idx_sales_region_date
ON sales(region, sale_date);
```

Mục tiêu:

- Chạy query trước khi có index.
- Tạo index.
- Chạy lại query.
- So sánh execution time.

## 11.5. Index cho pgvector

Nếu dùng vector nhiều dữ liệu:

```sql
CREATE INDEX idx_product_embeddings_vector
ON product_embeddings
USING ivfflat (embedding vector_l2_ops)
WITH (lists = 10);
```

Với demo nhỏ, index vector không bắt buộc.

---

# 12. Trigger đơn giản để demo audit log

## 12.1. Function ghi log thay đổi product

```sql
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs(table_name, action, old_data, new_data)
        VALUES ('products', 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## 12.2. Trigger

```sql
CREATE TRIGGER trg_products_audit
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION log_product_changes();
```

Demo:

```sql
UPDATE products
SET price = price + 1000000
WHERE name = 'iPhone 15 Pro';

SELECT * FROM audit_logs
ORDER BY created_at DESC;
```

Thông điệp:

> PostgreSQL không chỉ lưu dữ liệu, mà còn có thể tự động theo dõi thay đổi dữ liệu thông qua trigger.

---

# 13. Các màn hình cần làm

Chỉ cần 5 màn hình chính.

```text
1. Home Dashboard
2. JSONB & Flexible Data Demo
3. ACID Transaction Demo
4. Extension Demo: PostGIS + pgvector
5. Query Optimizer Demo
```

Nếu muốn đơn giản hơn nữa, gộp PostGIS và pgvector thành một màn hình “Extension Demo”.

---

# 14. Màn hình 1 — Home Dashboard

## 14.1. Mục tiêu

Cho người xem thấy ngay đây là công cụ demo PostgreSQL, không phải app nghiệp vụ.

## 14.2. Nội dung giao diện

Tiêu đề:

```text
PostgreSQL Feature Showcase
```

Phụ đề:

```text
A simple demo platform to show why PostgreSQL is powerful, flexible, and enterprise-ready.
```

Các card:

```text
[Flexible Data]
JSONB, Array, UUID, Custom Type

[ACID Transaction]
Commit, Rollback, Data Consistency

[Extensions]
PostGIS for maps, pgvector for AI search

[Query Optimizer]
Index, EXPLAIN ANALYZE, Performance

[Enterprise Features]
Constraint, Trigger, Audit Log
```

## 14.3. Bảng mapping tính năng

Nên có bảng:

| PostgreSQL Feature | Demo |
|---|---|
| JSONB | Product attributes |
| Array | Product tags |
| UUID | Primary key |
| Custom Type | Transfer status |
| Transaction | Money transfer |
| Rollback | Failed transfer |
| PostGIS | Nearest store |
| pgvector | Semantic search |
| GIN Index | JSONB/Array search |
| EXPLAIN ANALYZE | Query plan |
| Trigger | Audit log |

Thông điệp cần nói:

> Mỗi demo trong hệ thống tương ứng với một năng lực cụ thể của PostgreSQL.

---

# 15. Màn hình 2 — Flexible Data Demo

## 15.1. Mục tiêu

Demo PostgreSQL xử lý dữ liệu phức tạp tốt hơn mô hình SQL cứng truyền thống.

## 15.2. Tình huống

Một hệ thống bán nhiều loại sản phẩm:

- Điện thoại.
- Laptop.
- Giày.

Mỗi loại sản phẩm có thuộc tính khác nhau.

Nếu dùng thiết kế bảng truyền thống quá cứng, có thể phải tạo rất nhiều cột:

```text
brand, color, storage, camera, cpu, ram, ssd, screen, size, material, use_case, warranty, ...
```

Nhiều cột sẽ bị null vì không phải sản phẩm nào cũng dùng cùng thuộc tính.

PostgreSQL giải quyết bằng:

```text
Cột quan hệ cố định: id, name, category, price
Cột linh hoạt: attributes JSONB
Cột danh sách: tags TEXT[]
```

## 15.3. UI cần có

```text
Filter products

Category: [smartphone]
Brand: [Apple]
Color: [Black]
Tag: [travel]

[Run Query]
```

Kết quả:

```text
iPhone 15 Pro
Price: 28,990,000 VND
Attributes:
{
  "brand": "Apple",
  "color": "Black",
  "storage": "256GB",
  "camera": "48MP"
}
Tags: premium, camera, travel
```

## 15.4. SQL cần hiển thị

```sql
SELECT name, category, price, attributes, tags
FROM products
WHERE category = 'smartphone'
  AND attributes->>'brand' = 'Apple'
  AND attributes->>'color' = 'Black'
  AND tags @> ARRAY['travel'];
```

## 15.5. Giải thích trên UI

Hiển thị một box:

```text
PostgreSQL Feature: JSONB + Array

JSONB giúp lưu dữ liệu linh hoạt giống document database.
Array giúp lưu danh sách giá trị như tags.
PostgreSQL vẫn giữ được SQL, JOIN, constraint và index.
```

## 15.6. Điều cần nhấn mạnh khi thuyết trình

Nói:

> Đây là điểm làm PostgreSQL khác biệt. Nó không chỉ là SQL database truyền thống. Với JSONB, PostgreSQL có thể xử lý dữ liệu linh hoạt gần giống NoSQL, nhưng vẫn giữ được tính chặt chẽ của relational database.

---

# 16. Màn hình 3 — ACID Transaction Demo

## 16.1. Mục tiêu

Đây là demo quan trọng nhất.

Cần chứng minh:

> PostgreSQL đảm bảo dữ liệu không bị sai lệch khi một giao dịch bị lỗi giữa chừng.

## 16.2. Tình huống

Alice chuyển 3.000.000 VNĐ cho Bob.

Một transaction cần làm 3 việc:

1. Trừ tiền Alice.
2. Cộng tiền Bob.
3. Ghi log giao dịch.

Nếu lỗi xảy ra sau bước 1, PostgreSQL phải rollback để Alice không bị mất tiền.

## 16.3. UI cần có

```text
Money Transfer Demo

Before Transaction:
Alice balance: 10,000,000 VND
Bob balance: 2,000,000 VND
Transfer logs: 0

Amount: 3,000,000 VND

[Run Successful Transfer]
[Run Failed Transfer]
[Reset Demo Data]
```

## 16.4. Khi chạy thành công

Kết quả:

```text
Transaction committed successfully.

After Transaction:
Alice balance: 7,000,000 VND
Bob balance: 5,000,000 VND
Transfer logs: 1
```

## 16.5. Khi chạy thất bại

Kết quả:

```text
Simulated error occurred after deducting Alice's balance.
PostgreSQL rolled back the transaction.

After Failed Transaction:
Alice balance: 10,000,000 VND
Bob balance: 2,000,000 VND
Transfer logs: 0
```

## 16.6. SQL transaction thành công

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 3000000
WHERE owner_name = 'Alice';

UPDATE accounts
SET balance = balance + 3000000
WHERE owner_name = 'Bob';

INSERT INTO transfer_logs(from_account, to_account, amount, status, note)
VALUES ($1, $2, 3000000, 'SUCCESS', 'Transfer completed');

COMMIT;
```

## 16.7. SQL transaction thất bại

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 3000000
WHERE owner_name = 'Alice';

-- Giả lập lỗi hệ thống ở giữa giao dịch
SELECT 1 / 0;

UPDATE accounts
SET balance = balance + 3000000
WHERE owner_name = 'Bob';

COMMIT;
```

Backend khi bắt lỗi:

```sql
ROLLBACK;
```

## 16.8. Giải thích trên UI

```text
PostgreSQL Feature: ACID Transaction

Atomicity: Hoặc tất cả bước thành công, hoặc không bước nào được ghi nhận.
Consistency: Dữ liệu luôn hợp lệ.
Isolation: Giao dịch không bị lẫn với giao dịch khác.
Durability: Khi commit thành công, dữ liệu được lưu bền vững.
```

## 16.9. Điều cần nhấn mạnh khi thuyết trình

Nói:

> Trong hệ thống ngân hàng, tài chính, thương mại điện tử, lỗi kiểu “người gửi bị trừ tiền nhưng người nhận chưa nhận được” là không thể chấp nhận. PostgreSQL giải quyết vấn đề này bằng transaction chuẩn ACID.

Đây là phần nên trình bày kỹ nhất.

---

# 17. Màn hình 4 — Extension Demo

Màn hình này có thể chia thành 2 tab:

```text
Tab 1: PostGIS — Location Search
Tab 2: pgvector — AI Semantic Search
```

Nếu thời gian làm ít, có thể chỉ làm một trong hai. Nhưng nếu làm được cả hai thì bài demo sẽ rất nổi bật.

---

## 17.1. Tab PostGIS — Nearest Store

### Mục tiêu

Demo PostgreSQL xử lý dữ liệu bản đồ/GPS.

### Tình huống

Người dùng đang ở Hoàn Kiếm, Hà Nội. Hệ thống cần tìm cửa hàng gần nhất.

### UI cần có

```text
Your location:
Latitude: 21.0285
Longitude: 105.8542

[Find Nearest Stores]
```

Kết quả:

```text
1. Store Hoan Kiem — 0.0 km
2. Store Cau Giay — 6.8 km
3. Store Ha Dong — 10.5 km
```

### SQL cần hiển thị

```sql
SELECT
    name,
    address,
    ROUND(
        ST_Distance(
            location,
            ST_MakePoint(105.8542, 21.0285)::geography
        )::numeric / 1000,
        2
    ) AS distance_km
FROM stores
ORDER BY location <-> ST_MakePoint(105.8542, 21.0285)::geography
LIMIT 3;
```

### Giải thích trên UI

```text
PostgreSQL Feature: PostGIS

PostGIS biến PostgreSQL thành một database có khả năng xử lý dữ liệu địa lý:
- Lưu tọa độ
- Tính khoảng cách
- Tìm điểm gần nhất
- Truy vấn theo vùng địa lý
```

### Điều cần nhấn mạnh

Nói:

> Với PostGIS, PostgreSQL có thể được dùng trong logistics, giao hàng, bản đồ, bất động sản, giao thông và quản lý đô thị.

---

## 17.2. Tab pgvector — AI Semantic Search

### Mục tiêu

Demo PostgreSQL hỗ trợ tìm kiếm AI bằng vector.

### Tình huống

Người dùng không tìm bằng keyword, mà nhập nhu cầu tự nhiên:

```text
Tôi cần một sản phẩm phù hợp để đi du lịch và chụp ảnh đẹp.
```

Hệ thống trả về sản phẩm gần nghĩa nhất.

### UI cần có

```text
AI Search

Query: Tôi cần một sản phẩm phù hợp để đi du lịch và chụp ảnh đẹp.

[Search]
```

Kết quả:

```text
1. iPhone 15 Pro
Description: Premium smartphone with excellent camera for travel
Distance: 0.12

2. Travel Backpack
Description: Lightweight backpack for long trips
Distance: 0.30
```

### SQL cần hiển thị

```sql
SELECT
    p.name,
    pe.description,
    pe.embedding <-> '[0.9, 0.8, 0.7]' AS distance
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <-> '[0.9, 0.8, 0.7]'
LIMIT 3;
```

### Giải thích trên UI

```text
PostgreSQL Feature: pgvector

pgvector cho phép PostgreSQL lưu vector embedding và tìm kiếm theo độ tương đồng.
Nhờ đó PostgreSQL có thể hỗ trợ AI search, recommendation system và chatbot retrieval.
```

### Điều cần nhấn mạnh

Nói:

> Điểm đáng chú ý là PostgreSQL có thể mở rộng thành vector database thông qua extension, giúp một hệ thống truyền thống có thể tích hợp AI search mà không cần thay đổi toàn bộ hạ tầng dữ liệu.

---

# 18. Màn hình 5 — Query Optimizer Demo

## 18.1. Mục tiêu

Demo PostgreSQL tối ưu truy vấn với index và `EXPLAIN ANALYZE`.

## 18.2. Tình huống

Bảng `sales` có nhiều dữ liệu bán hàng. Admin muốn xem doanh thu khu vực Hanoi trong 30 ngày gần nhất.

Khi chưa có index, PostgreSQL phải quét nhiều dòng.

Sau khi tạo index, query nhanh hơn.

## 18.3. UI cần có

```text
Query Performance Demo

Dataset: 100,000 sales records
Query: Revenue in Hanoi during last 30 days

[Run Without Index]
[Create Index]
[Run With Index]
[Show EXPLAIN ANALYZE]
```

## 18.4. Kết quả cần hiển thị

```text
Before Index:
Execution Time: 450 ms
Plan: Sequential Scan

After Index:
Execution Time: 35 ms
Plan: Index Scan / Bitmap Index Scan

Improvement: 12.8x faster
```

## 18.5. SQL query

```sql
EXPLAIN ANALYZE
SELECT
    region,
    SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;
```

## 18.6. Index tạo khi demo

```sql
CREATE INDEX idx_sales_region_date
ON sales(region, sale_date);
```

## 18.7. Giải thích trên UI

```text
PostgreSQL Feature: Query Optimizer + Index

EXPLAIN ANALYZE cho biết PostgreSQL thực thi query như thế nào.
Index giúp PostgreSQL tìm dữ liệu nhanh hơn thay vì quét toàn bộ bảng.
```

## 18.8. Điều cần nhấn mạnh khi thuyết trình

Nói:

> Khi dữ liệu nhỏ, mọi database có thể chạy nhanh. Nhưng khi dữ liệu lớn, query optimizer và index strategy trở thành yếu tố rất quan trọng. PostgreSQL cung cấp công cụ mạnh để phân tích và tối ưu truy vấn.

---

# 19. Màn hình 6 — Enterprise Feature Demo

Màn này là phần phụ, không bắt buộc. Nếu có thời gian, làm để tăng độ chuyên nghiệp.

## 19.1. Mục tiêu

Demo PostgreSQL có các tính năng giúp bảo vệ dữ liệu ở tầng database.

## 19.2. Các phần nên demo

```text
1. Constraint
2. Trigger
3. Audit Log
4. View / Materialized View
```

---

## 19.3. Constraint Demo

Thử tạo sản phẩm giá âm:

```sql
INSERT INTO products(name, category, price)
VALUES ('Invalid Product', 'test', -1000);
```

PostgreSQL báo lỗi vì có constraint:

```sql
CHECK (price > 0)
```

Thông điệp:

> PostgreSQL giúp bảo vệ dữ liệu ngay tại database, không chỉ phụ thuộc vào code backend.

---

## 19.4. Trigger + Audit Log Demo

Update giá sản phẩm:

```sql
UPDATE products
SET price = price + 1000000
WHERE name = 'iPhone 15 Pro';
```

Sau đó xem audit log:

```sql
SELECT table_name, action, old_data, new_data, created_at
FROM audit_logs
ORDER BY created_at DESC;
```

Thông điệp:

> Trigger giúp PostgreSQL tự động ghi nhận thay đổi dữ liệu. Đây là tính năng hữu ích cho hệ thống cần audit, truy vết và kiểm soát dữ liệu.

---

## 19.5. View Demo

Tạo view tổng doanh thu theo khu vực:

```sql
CREATE VIEW revenue_by_region AS
SELECT
    region,
    SUM(amount) AS total_revenue,
    COUNT(*) AS total_sales
FROM sales
GROUP BY region;
```

Query:

```sql
SELECT * FROM revenue_by_region
ORDER BY total_revenue DESC;
```

Thông điệp:

> View giúp đóng gói query phức tạp thành một đối tượng dễ sử dụng.

---

# 20. Backend API tối giản

Không cần nhiều API. Chỉ cần các API phục vụ demo.

## 20.1. Health check

```text
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

---

## 20.2. JSONB Demo API

```text
GET /api/demo/jsonb?category=smartphone&brand=Apple&color=Black&tag=travel
```

Response:

```json
{
  "feature": "JSONB + Array",
  "sql": "SELECT name, category, price, attributes, tags FROM products ...",
  "data": []
}
```

---

## 20.3. Transaction Demo API

```text
POST /api/demo/transaction/success
POST /api/demo/transaction/failure
POST /api/demo/transaction/reset
GET /api/demo/transaction/state
```

Response cho state:

```json
{
  "aliceBalance": 10000000,
  "bobBalance": 2000000,
  "transferLogCount": 0
}
```

---

## 20.4. PostGIS Demo API

```text
GET /api/demo/postgis/nearest?lat=21.0285&lng=105.8542
```

Response:

```json
{
  "feature": "PostGIS",
  "sql": "SELECT name, address, ST_Distance(...) ...",
  "data": [
    {
      "name": "Store Hoan Kiem",
      "distanceKm": 0.0
    }
  ]
}
```

---

## 20.5. pgvector Demo API

```text
POST /api/demo/pgvector/search
```

Request:

```json
{
  "query": "travel camera product"
}
```

Response:

```json
{
  "feature": "pgvector",
  "sql": "SELECT p.name, pe.description, pe.embedding <-> ...",
  "data": []
}
```

---

## 20.6. Optimizer Demo API

```text
GET /api/demo/optimizer/run
POST /api/demo/optimizer/create-index
GET /api/demo/optimizer/explain
POST /api/demo/optimizer/drop-index
```

Response:

```json
{
  "feature": "Query Optimizer",
  "executionTimeMs": 45,
  "planSummary": "Index Scan",
  "explainAnalyze": []
}
```

---

# 21. Cấu trúc thư mục đơn giản

```text
postgresql-feature-showcase/
│
├── README.md
├── docker-compose.yml
├── .env.example
│
├── database/
│   ├── 01_extensions.sql
│   ├── 02_types.sql
│   ├── 03_tables.sql
│   ├── 04_indexes.sql
│   ├── 05_triggers.sql
│   ├── 06_seed.sql
│   └── 07_demo_queries.sql
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.ts
│       ├── db.ts
│       └── routes/
│           ├── jsonbDemo.ts
│           ├── transactionDemo.ts
│           ├── postgisDemo.ts
│           ├── pgvectorDemo.ts
│           └── optimizerDemo.ts
│
└── frontend/
    ├── package.json
    └── src/
        ├── App.tsx
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── JsonbDemoPage.tsx
        │   ├── TransactionDemoPage.tsx
        │   ├── ExtensionDemoPage.tsx
        │   └── OptimizerDemoPage.tsx
        └── components/
            ├── FeatureCard.tsx
            ├── SqlPanel.tsx
            ├── ResultTable.tsx
            └── ExplanationBox.tsx
```

So với bản cũ, cấu trúc này nhẹ hơn rất nhiều.

---

# 22. Flow demo hoàn chỉnh khi thuyết trình

## 22.1. Tổng flow

```text
Mở Home Dashboard
        ↓
Demo JSONB: dữ liệu sản phẩm linh hoạt
        ↓
Demo Transaction: chuyển tiền thành công và thất bại
        ↓
Demo Extension: PostGIS hoặc pgvector
        ↓
Demo Optimizer: query trước/sau khi có index
        ↓
Kết luận: PostgreSQL là open-source DBMS nhưng có năng lực enterprise
```

---

## 22.2. Demo 1 — JSONB

Thao tác:

1. Vào Flexible Data Demo.
2. Chọn category = smartphone.
3. Chọn brand = Apple.
4. Chọn tag = travel.
5. Bấm Run Query.

Nói:

> Ở đây, mỗi loại sản phẩm có cấu trúc thuộc tính khác nhau. PostgreSQL cho phép lưu phần linh hoạt trong JSONB, nhưng vẫn query được bằng SQL.

Kết luận nhỏ:

> PostgreSQL kết hợp được sức mạnh của SQL database và sự linh hoạt của document database.

---

## 22.3. Demo 2 — Transaction thành công

Thao tác:

1. Vào Transaction Demo.
2. Xem Alice có 10 triệu, Bob có 2 triệu.
3. Bấm Run Successful Transfer.
4. Xem Alice còn 7 triệu, Bob có 5 triệu, log tăng lên 1.

Nói:

> Đây là trường hợp transaction thành công. PostgreSQL commit toàn bộ thay đổi.

---

## 22.4. Demo 3 — Transaction thất bại

Thao tác:

1. Bấm Reset Demo Data.
2. Bấm Run Failed Transfer.
3. Xem Alice vẫn 10 triệu, Bob vẫn 2 triệu, log vẫn 0.

Nói:

> Hệ thống giả lập lỗi sau khi trừ tiền Alice. Nhưng vì PostgreSQL dùng transaction, toàn bộ thay đổi được rollback. Không có dữ liệu sai lệch.

Kết luận nhỏ:

> Đây là lý do PostgreSQL phù hợp với hệ thống cần độ tin cậy cao như tài chính, ngân hàng, thương mại điện tử.

---

## 22.5. Demo 4 — PostGIS

Thao tác:

1. Vào Extension Demo.
2. Chọn tab PostGIS.
3. Bấm Find Nearest Stores.
4. Xem cửa hàng được sắp xếp theo khoảng cách.

Nói:

> PostgreSQL có hệ sinh thái extension rất mạnh. Với PostGIS, PostgreSQL có thể xử lý dữ liệu bản đồ và khoảng cách địa lý.

---

## 22.6. Demo 5 — pgvector

Thao tác:

1. Chọn tab pgvector.
2. Nhập nhu cầu tìm kiếm.
3. Bấm Search.
4. Xem sản phẩm gần nghĩa.

Nói:

> Với pgvector, PostgreSQL có thể lưu vector embedding và tìm kiếm theo độ tương đồng. Đây là nền tảng cho AI search và recommendation system.

---

## 22.7. Demo 6 — Query Optimizer

Thao tác:

1. Vào Optimizer Demo.
2. Bấm Run Without Index.
3. Xem thời gian chạy và query plan.
4. Bấm Create Index.
5. Bấm Run With Index.
6. So sánh thời gian.

Nói:

> PostgreSQL có công cụ EXPLAIN ANALYZE để phân tích kế hoạch thực thi query. Khi có index phù hợp, query có thể nhanh hơn rất nhiều.

---

# 23. Thứ tự ưu tiên triển khai

## 23.1. Bản tối thiểu nhưng vẫn đủ mạnh

Nếu nhóm chỉ có ít thời gian, làm 3 demo này:

```text
1. JSONB Demo
2. ACID Transaction Demo
3. Query Optimizer Demo
```

Đây là bộ 3 rất chắc, vì nó thể hiện:

- Dữ liệu phức tạp.
- An toàn dữ liệu.
- Hiệu năng truy vấn.

## 23.2. Bản nổi bật hơn

Thêm:

```text
4. PostGIS Demo
5. pgvector Demo
```

Bản này sẽ ấn tượng hơn vì show được extension ecosystem của PostgreSQL.

## 23.3. Bản nâng cao nếu còn thời gian

Thêm:

```text
6. Trigger + Audit Log
7. Materialized View
8. Partitioning
```

Không bắt buộc.

---

# 24. Lộ trình triển khai đơn giản

## Giai đoạn 1 — Setup nền tảng

Việc cần làm:

- Tạo repo.
- Tạo PostgreSQL database.
- Tạo backend Express.
- Tạo frontend React.
- Kết nối backend với database.

Kết quả:

- Mở frontend được.
- Gọi `/api/health` thành công.
- Database chạy được.

---

## Giai đoạn 2 — Làm database demo

Việc cần làm:

- Tạo extensions.
- Tạo custom type.
- Tạo bảng.
- Seed dữ liệu.
- Tạo index cần thiết.

Kết quả:

- Có dữ liệu products.
- Có dữ liệu accounts.
- Có dữ liệu stores.
- Có dữ liệu sales lớn.

---

## Giai đoạn 3 — Làm JSONB Demo

Việc cần làm:

- API JSONB search.
- UI filter.
- Hiển thị kết quả.
- Hiển thị SQL.

Kết quả:

- Lọc được sản phẩm theo JSONB và Array.

---

## Giai đoạn 4 — Làm Transaction Demo

Việc cần làm:

- API state.
- API success transfer.
- API failed transfer.
- API reset.
- UI before/after.

Kết quả:

- Show được commit.
- Show được rollback.

---

## Giai đoạn 5 — Làm Optimizer Demo

Việc cần làm:

- Seed nhiều dữ liệu sales.
- API chạy query.
- API tạo index.
- API xóa index.
- API EXPLAIN ANALYZE.
- UI so sánh before/after.

Kết quả:

- Show được query chậm/nhanh.
- Show được query plan.

---

## Giai đoạn 6 — Làm Extension Demo

Việc cần làm:

- PostGIS nearest store.
- pgvector semantic search.
- UI hai tab.
- SQL panel.

Kết quả:

- Show được PostgreSQL mở rộng bằng extension.

---

## Giai đoạn 7 — Hoàn thiện demo

Việc cần làm:

- Thêm README.
- Thêm script thuyết trình.
- Thêm nút reset data.
- Test lại toàn bộ flow.
- Chuẩn bị ảnh/video dự phòng.

---

# 25. Checklist nghiệm thu

## 25.1. Bắt buộc

- [ ] Có Home Dashboard.
- [ ] Có JSONB Demo.
- [ ] Có Transaction Demo.
- [ ] Có Query Optimizer Demo.
- [ ] Có SQL query hiển thị trên UI.
- [ ] Có dữ liệu mẫu.
- [ ] Có nút reset demo data.
- [ ] Có README hướng dẫn chạy.

## 25.2. Nên có

- [ ] Có PostGIS Demo.
- [ ] Có pgvector Demo.
- [ ] Có Trigger Audit Log Demo.
- [ ] Có EXPLAIN ANALYZE hiển thị rõ.
- [ ] Có so sánh execution time trước/sau index.

## 25.3. Không cần làm

- [ ] Không cần login thật.
- [ ] Không cần phân quyền thật.
- [ ] Không cần CRUD đầy đủ.
- [ ] Không cần UI quá phức tạp.
- [ ] Không cần thanh toán thật.
- [ ] Không cần deploy cloud nếu không có thời gian.

---

# 26. Kịch bản thuyết trình ngắn gọn

## 26.1. Mở đầu

Nói:

> Nhóm em không xây dựng một phần mềm nghiệp vụ lớn, mà xây dựng một công cụ demo nhỏ để làm rõ các điểm mạnh nổi bật của PostgreSQL. Mỗi màn hình tương ứng với một năng lực quan trọng của PostgreSQL.

---

## 26.2. Giới thiệu tổng quan

Nói:

> PostgreSQL thường được xem là một DBMS open-source nhưng có năng lực enterprise. Lý do là nó không chỉ hỗ trợ SQL truyền thống, mà còn hỗ trợ dữ liệu JSONB, transaction ACID, extension như PostGIS và pgvector, query optimizer, trigger và nhiều tính năng nâng cao.

---

## 26.3. Chuyển sang demo JSONB

Nói:

> Đầu tiên là khả năng xử lý dữ liệu linh hoạt. Với hệ thống có nhiều loại sản phẩm, mỗi loại có thuộc tính khác nhau. PostgreSQL cho phép lưu các thuộc tính này bằng JSONB và vẫn query trực tiếp bằng SQL.

---

## 26.4. Chuyển sang demo Transaction

Nói:

> Tiếp theo là điểm rất quan trọng của DBMS: an toàn dữ liệu. Nhóm em mô phỏng một giao dịch chuyển tiền. Nếu lỗi xảy ra giữa chừng, PostgreSQL sẽ rollback toàn bộ thay đổi.

---

## 26.5. Chuyển sang demo Extension

Nói:

> Một điểm mạnh khác của PostgreSQL là hệ sinh thái extension. Với PostGIS, PostgreSQL xử lý được dữ liệu bản đồ. Với pgvector, PostgreSQL có thể hỗ trợ AI semantic search.

---

## 26.6. Chuyển sang demo Optimizer

Nói:

> Cuối cùng là query optimizer. Khi dữ liệu lớn, việc có index và biết phân tích query plan là rất quan trọng. PostgreSQL cung cấp EXPLAIN ANALYZE để xem cách database thực thi truy vấn.

---

## 26.7. Kết luận

Nói:

> Qua các demo này, có thể thấy PostgreSQL không chỉ là một database quan hệ thông thường. Nó là một nền tảng dữ liệu mạnh, linh hoạt, mở rộng tốt và phù hợp với nhiều bài toán hiện đại.

---

# 27. Đánh giá thiết kế mới

Thiết kế mới tốt hơn bản cũ ở các điểm:

| Bản cũ | Bản mới |
|---|---|
| Giống một sản phẩm thương mại điện tử | Là công cụ demo DBMS rõ ràng |
| Nhiều bảng, nhiều nghiệp vụ | Ít bảng, tập trung vào PostgreSQL |
| Có nguy cơ làm loãng mục tiêu | Mỗi màn hình gắn với một điểm mạnh |
| Tốn nhiều thời gian frontend/backend | Dễ xây dựng hơn |
| Phù hợp làm project lớn | Phù hợp demo thuyết trình |

Kết luận:

> Với mục tiêu trình bày điểm mạnh PostgreSQL, nên chọn thiết kế mới: PostgreSQL Feature Showcase. Nó đơn giản hơn, dễ làm hơn, nhưng lại làm nổi bật PostgreSQL rõ hơn.

---

# 28. Bản chốt nên làm

Nên làm bản sau:

```text
PostgreSQL Feature Showcase

Màn hình 1: Home Dashboard
Màn hình 2: JSONB & Flexible Data Demo
Màn hình 3: ACID Transaction Demo
Màn hình 4: Extension Demo: PostGIS + pgvector
Màn hình 5: Query Optimizer Demo
```

Database chỉ cần:

```text
products
accounts
transfer_logs
stores
product_embeddings
sales
audit_logs
```

Các điểm mạnh show được:

```text
UUID
JSONB
Array
Custom Type
Constraint
Transaction
Rollback
PostGIS
pgvector
GIN Index
GiST Index
EXPLAIN ANALYZE
Trigger
View
```

Thông điệp cuối cùng:

> PostgreSQL mạnh vì nó vừa chặt chẽ như một relational database, vừa linh hoạt như một document database, vừa có thể mở rộng thành geospatial database, vector database và analytics engine nhờ hệ sinh thái extension và optimizer mạnh.

