# 12 PROMPT XÂY DỰNG HOÀN CHỈNH POSTGRESQL FEATURE SHOWCASE

Tài liệu này dùng để copy từng prompt vào AI coding tool như Cursor, Windsurf, GitHub Copilot Chat hoặc ChatGPT có khả năng sửa code.

Mục tiêu: xây dựng một web app nhỏ tên **PostgreSQL Feature Showcase** để demo rõ các điểm mạnh của PostgreSQL:

- JSONB
- Array
- UUID
- Custom Type
- Constraint
- ACID Transaction
- Rollback
- PostGIS
- pgvector
- GIN Index
- GiST Index
- EXPLAIN ANALYZE
- Trigger
- View
- Audit Log

Không xây app nghiệp vụ lớn. Chỉ xây công cụ demo DBMS rõ ràng, dễ trình bày.

---

# Quy tắc chung cho toàn bộ 12 prompt

Trước khi chạy từng prompt, cần hiểu các quy tắc sau:

1. Không phá code đã chạy tốt ở prompt trước.
2. Mỗi prompt phải hoàn thành một phần rõ ràng.
3. Sau mỗi prompt phải chạy kiểm tra tối thiểu.
4. Chỉ commit nếu phần đó chạy được.
5. Sau mỗi commit phải push lên remote.
6. Nếu gặp lỗi, sửa lỗi trước khi commit.
7. Luôn ưu tiên code đơn giản, dễ đọc, dễ demo.
8. Giao diện không cần quá đẹp, nhưng phải rõ ràng và chuyên nghiệp.
9. Mỗi demo page phải có:
   - Tình huống demo.
   - Nút chạy demo.
   - Kết quả demo.
   - SQL query đang chạy.
   - Box giải thích PostgreSQL feature.
10. Dùng raw SQL cho các demo chính để thể hiện PostgreSQL rõ hơn.

Branch đề xuất:

```bash
git checkout -b feat/postgresql-feature-showcase
```

Nếu branch đã tồn tại:

```bash
git checkout feat/postgresql-feature-showcase
```

Sau mỗi prompt, dùng mẫu commit/push:

```bash
git status
git add .
git commit -m "<commit-message>"
git push -u origin HEAD
```

Nếu repository chưa có remote, dừng lại và cấu hình remote trước khi push:

```bash
git remote -v
```

---

# PROMPT 1 — Khởi tạo project fullstack tối giản

Copy prompt dưới đây vào AI coding tool:

```text
Bạn là senior fullstack engineer. Hãy khởi tạo một project demo tên "PostgreSQL Feature Showcase" theo hướng đơn giản, dễ chạy, dễ demo, không phải sản phẩm thương mại điện tử hoàn chỉnh.

Mục tiêu prompt này:
- Tạo cấu trúc monorepo gồm frontend, backend, database.
- Frontend dùng React + Vite + TypeScript.
- Backend dùng Node.js + Express + TypeScript.
- Database dùng PostgreSQL chạy qua Docker Compose.
- Có health check frontend/backend/database cơ bản.
- Có README ban đầu hướng dẫn chạy.

Yêu cầu cấu trúc thư mục:

postgresql-feature-showcase/
├── README.md
├── docker-compose.yml
├── .env.example
├── .gitignore
├── database/
│   ├── Dockerfile
│   └── init/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       ├── db.ts
│       └── routes/
│           └── health.routes.ts
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles.css
        └── services/
            └── api.ts

Yêu cầu backend:
- Express server chạy port 4000.
- Có route GET /api/health trả về:
  {
    "status": "ok",
    "service": "backend"
  }
- Có route GET /api/health/db để kiểm tra kết nối PostgreSQL bằng SELECT 1.
- Dùng package pg để kết nối PostgreSQL.
- Dùng dotenv, cors.
- Có error handler đơn giản.

Yêu cầu frontend:
- React app chạy port 3000 hoặc 5173 tùy Vite.
- Trang chính hiển thị tiêu đề "PostgreSQL Feature Showcase".
- Có nút "Check Backend Health" gọi /api/health.
- Có nút "Check Database Health" gọi /api/health/db.
- Hiển thị kết quả health check trên màn hình.

Yêu cầu Docker Compose:
- Service postgres dùng custom database/Dockerfile.
- Database name: pg_feature_showcase.
- User: postgres.
- Password: postgres.
- Expose port 5432.
- Volume lưu data.
- Backend và frontend có thể chạy local bằng npm ở ngoài Docker, chưa cần dockerize backend/frontend ở prompt này.

Yêu cầu database/Dockerfile:
- Base image postgres:16.
- Cố gắng cài thêm PostGIS và pgvector bằng apt:
  postgresql-16-postgis-3
  postgresql-16-postgis-3-scripts
  postgresql-16-pgvector
- Nếu cần, viết comment trong Dockerfile giải thích các package này phục vụ PostGIS và pgvector.

Yêu cầu script npm:
Backend:
- npm run dev
- npm run build
- npm run start

Frontend:
- npm run dev
- npm run build
- npm run preview

Yêu cầu kiểm tra sau khi làm xong:
1. docker compose up -d postgres
2. cd backend && npm install && npm run build
3. cd frontend && npm install && npm run build
4. Chạy backend dev và frontend dev để kiểm tra health check.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "chore: initialize postgresql feature showcase"
git push -u origin HEAD
```

---

# PROMPT 2 — Tạo schema PostgreSQL, extensions, seed data cơ bản

```text
Bạn là PostgreSQL database engineer. Hãy bổ sung phần database cho project PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Tạo toàn bộ schema tối giản để demo PostgreSQL.
- Tạo extensions: pgcrypto, postgis, vector.
- Tạo custom type transfer_status.
- Tạo các bảng demo chính.
- Seed dữ liệu ban đầu.
- Tạo các index cần thiết cho JSONB, Array, PostGIS.

Các file cần tạo trong database/init:

01_extensions.sql
02_types.sql
03_tables.sql
04_indexes.sql
05_triggers.sql
06_seed.sql
07_views.sql

Yêu cầu 01_extensions.sql:

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;

Nếu extension vector hoặc postgis không tạo được do image thiếu package, hãy để lỗi rõ ràng trong log và cập nhật README phần troubleshooting.

Yêu cầu 02_types.sql:
- Tạo ENUM transfer_status gồm:
  PENDING, SUCCESS, FAILED.

Yêu cầu 03_tables.sql:
Tạo các bảng sau:

1. products
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- name TEXT NOT NULL
- category TEXT NOT NULL
- price NUMERIC(12,2) NOT NULL CHECK(price > 0)
- tags TEXT[] DEFAULT ARRAY[]::TEXT[]
- attributes JSONB DEFAULT '{}'::jsonb
- created_at TIMESTAMP DEFAULT NOW()

2. accounts
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- owner_name TEXT NOT NULL UNIQUE
- balance NUMERIC(12,2) NOT NULL CHECK(balance >= 0)
- created_at TIMESTAMP DEFAULT NOW()

3. transfer_logs
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- from_account UUID REFERENCES accounts(id)
- to_account UUID REFERENCES accounts(id)
- amount NUMERIC(12,2) NOT NULL CHECK(amount > 0)
- status transfer_status NOT NULL DEFAULT 'PENDING'
- note TEXT
- created_at TIMESTAMP DEFAULT NOW()

4. stores
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- name TEXT NOT NULL
- address TEXT NOT NULL
- location GEOGRAPHY(POINT,4326) NOT NULL

5. product_embeddings
- product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE
- description TEXT NOT NULL
- embedding VECTOR(3)

6. sales
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- product_name TEXT NOT NULL
- category TEXT NOT NULL
- amount NUMERIC(12,2) NOT NULL CHECK(amount > 0)
- sale_date DATE NOT NULL
- region TEXT NOT NULL

7. audit_logs
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- table_name TEXT NOT NULL
- action TEXT NOT NULL
- old_data JSONB
- new_data JSONB
- created_at TIMESTAMP DEFAULT NOW()

Yêu cầu 04_indexes.sql:
- GIN index cho products.attributes.
- GIN index cho products.tags.
- GiST index cho stores.location.
- Không tạo idx_sales_region_date ngay từ đầu, vì index này dùng để demo optimizer sau.

Yêu cầu 05_triggers.sql:
- Tạo function log_product_changes().
- Tạo trigger trg_products_audit AFTER UPDATE ON products.
- Khi update products, tự ghi old_data và new_data vào audit_logs.

Yêu cầu 06_seed.sql:
Seed dữ liệu:
- Ít nhất 8 products thuộc các category khác nhau: smartphone, laptop, shoes, backpack, camera, headphone.
- Products phải có attributes JSONB khác nhau rõ ràng.
- Products phải có tags array.
- Accounts: Alice 10,000,000 VND và Bob 2,000,000 VND.
- Stores: ít nhất 5 cửa hàng ở Hà Nội với tọa độ thật gần đúng:
  Hoan Kiem, Cau Giay, Ha Dong, Ba Dinh, Tay Ho.
- product_embeddings: dùng VECTOR(3) giả lập cho ít nhất 5 sản phẩm.
- sales: tạo dữ liệu bằng generate_series, khoảng 100,000 dòng, nhiều region: Hanoi, HCM, Da Nang, Can Tho.

Yêu cầu 07_views.sql:
- Tạo view revenue_by_region:
  region, total_revenue, total_sales.

Yêu cầu README:
- Bổ sung hướng dẫn reset database:
  docker compose down -v
  docker compose up -d postgres
- Bổ sung mô tả ngắn từng bảng dùng để demo feature nào.

Yêu cầu kiểm tra:
1. docker compose down -v
2. docker compose up -d postgres
3. Kiểm tra logs không lỗi.
4. Kết nối database và chạy:
   SELECT COUNT(*) FROM products;
   SELECT COUNT(*) FROM sales;
   SELECT * FROM revenue_by_region;

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: add postgresql demo schema and seed data"
git push -u origin HEAD
```

---

# PROMPT 3 — Xây backend demo API nền tảng

```text
Bạn là senior backend engineer. Hãy xây dựng nền tảng API cho PostgreSQL Feature Showcase dựa trên schema đã có.

Mục tiêu prompt này:
- Chuẩn hóa kết nối PostgreSQL.
- Tạo cấu trúc route/service rõ ràng.
- Tạo helper trả response thống nhất.
- Tạo API lấy metadata demo.
- Tạo API reset dữ liệu demo cho transaction.

Không làm frontend ở prompt này, chỉ backend.

Yêu cầu cấu trúc backend:

backend/src/
├── app.ts
├── server.ts
├── db.ts
├── routes/
│   ├── health.routes.ts
│   ├── demo.routes.ts
│   ├── jsonb.routes.ts
│   ├── transaction.routes.ts
│   ├── extension.routes.ts
│   └── optimizer.routes.ts
├── services/
│   ├── demo.service.ts
│   ├── jsonb.service.ts
│   ├── transaction.service.ts
│   ├── extension.service.ts
│   └── optimizer.service.ts
└── utils/
    ├── asyncHandler.ts
    └── apiResponse.ts

Yêu cầu chung:
- Mọi route phải bắt đầu bằng /api.
- Dùng asyncHandler để tránh try/catch lặp lại ở route.
- apiResponse trả format thống nhất:
  {
    "success": true,
    "feature": "...",
    "sql": "...",
    "data": ...,
    "explanation": "..."
  }
- Error response:
  {
    "success": false,
    "message": "..."
  }

API cần có trong prompt này:

1. GET /api/demo/features
Trả về danh sách feature demo:
- JSONB + Array
- ACID Transaction
- PostGIS
- pgvector
- Query Optimizer
- Trigger + Audit Log

2. POST /api/demo/transaction/reset
Reset dữ liệu Alice/Bob:
- Xóa transfer_logs.
- Set Alice balance = 10000000.
- Set Bob balance = 2000000.
- Nếu Alice/Bob chưa có thì tạo lại.

3. GET /api/demo/transaction/state
Trả về:
{
  "aliceBalance": 10000000,
  "bobBalance": 2000000,
  "transferLogCount": 0
}

4. GET /api/demo/products/sample
Trả về vài products để kiểm tra database có data.

Yêu cầu kỹ thuật:
- Tất cả SQL viết trong service layer.
- Không dùng ORM.
- Dùng parameterized query.
- Không hardcode UUID của Alice/Bob, tìm theo owner_name.

Yêu cầu kiểm tra:
1. cd backend
2. npm run build
3. npm run dev
4. Test bằng curl hoặc Postman:
   GET /api/demo/features
   POST /api/demo/transaction/reset
   GET /api/demo/transaction/state
   GET /api/demo/products/sample

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: add backend demo api foundation"
git push -u origin HEAD
```

---

# PROMPT 4 — Xây JSONB & Flexible Data Demo đầy đủ

```text
Bạn là fullstack engineer. Hãy xây dựng hoàn chỉnh demo JSONB & Flexible Data cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Backend có API query products theo JSONB, Array.
- Frontend có page demo rõ ràng.
- UI hiển thị tình huống, filter, kết quả, SQL query, giải thích feature.

Phần backend:
Tạo route:
GET /api/demo/jsonb

Query params:
- category optional
- brand optional
- color optional
- tag optional

Ví dụ:
/api/demo/jsonb?category=smartphone&brand=Apple&color=Black&tag=travel

SQL phải dùng parameterized query, nhưng response cần hiển thị SQL demo dễ đọc dạng:

SELECT name, category, price, attributes, tags
FROM products
WHERE category = 'smartphone'
  AND attributes->>'brand' = 'Apple'
  AND attributes->>'color' = 'Black'
  AND tags @> ARRAY['travel'];

Logic:
- Nếu query param nào không có thì bỏ điều kiện đó.
- Trả về products phù hợp.
- Trả thêm explanation:
  "JSONB allows PostgreSQL to store flexible product attributes while still using SQL queries. Array is used for product tags. GIN indexes help speed up JSONB and Array search."

Phần frontend:
Tạo page:
/frontend/src/pages/JsonbDemoPage.tsx

Page cần có:
1. Tiêu đề: JSONB & Flexible Data Demo.
2. Box tình huống:
   "Different product categories have different attributes. PostgreSQL can store flexible attributes using JSONB while still supporting SQL queries."
3. Form filter:
   - Category select: all, smartphone, laptop, shoes, backpack, camera, headphone.
   - Brand input.
   - Color input.
   - Tag input.
   - Button Run Query.
4. Result table:
   - name
   - category
   - price
   - attributes hiển thị dạng formatted JSON
   - tags
5. SqlPanel component nếu chưa có thì tạo:
   - Nhận prop sql.
   - Hiển thị code block.
   - Có nút Copy SQL.
6. ExplanationBox component nếu chưa có thì tạo:
   - Hiển thị PostgreSQL Feature.
   - Nội dung giải thích.

Cập nhật App.tsx:
- Có navigation đơn giản tới JSONB Demo.
- Có route hoặc state-based navigation đều được. Nếu chưa dùng react-router, hãy cài react-router-dom và setup routes.

Yêu cầu UI:
- Đơn giản, rõ ràng.
- Không cần design phức tạp.
- Dùng CSS thường hoặc Tailwind nếu project đã setup.
- Màu sắc nên gợi PostgreSQL: xanh navy / xanh dương / trắng.

Yêu cầu kiểm tra:
1. Backend build thành công.
2. Frontend build thành công.
3. Chạy app và test filter:
   category=smartphone, brand=Apple.
4. Kết quả hiển thị đúng.
5. SQL panel hiển thị rõ.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: implement jsonb flexible data demo"
git push -u origin HEAD
```

---

# PROMPT 5 — Xây ACID Transaction Demo đầy đủ

```text
Bạn là senior backend/fullstack engineer chuyên về database transaction. Hãy xây dựng hoàn chỉnh ACID Transaction Demo cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Demo rõ commit và rollback trong PostgreSQL.
- Tình huống: Alice chuyển 3,000,000 VND cho Bob.
- Có successful transfer và failed transfer.
- UI hiển thị trạng thái before/after.
- SQL transaction được hiển thị rõ.

Phần backend:
Tạo các API:

1. GET /api/demo/transaction/state
Nếu đã có từ prompt trước thì giữ lại và đảm bảo chạy tốt.
Trả về:
{
  "aliceBalance": 10000000,
  "bobBalance": 2000000,
  "transferLogCount": 0,
  "logs": []
}

2. POST /api/demo/transaction/reset
Reset Alice/Bob và transfer_logs.

3. POST /api/demo/transaction/success
Thực hiện transaction:
- BEGIN
- SELECT Alice FOR UPDATE
- SELECT Bob FOR UPDATE
- Kiểm tra Alice đủ tiền.
- UPDATE Alice trừ 3,000,000.
- UPDATE Bob cộng 3,000,000.
- INSERT transfer_logs status SUCCESS.
- COMMIT.
- Trả về beforeState và afterState.

4. POST /api/demo/transaction/failure
Thực hiện transaction lỗi giả lập:
- BEGIN
- SELECT Alice FOR UPDATE
- SELECT Bob FOR UPDATE
- UPDATE Alice trừ 3,000,000.
- Sau đó throw error giả lập hoặc chạy SELECT 1 / 0.
- ROLLBACK.
- Trả về beforeState và afterState.
- afterState phải chứng minh Alice/Bob không đổi, transfer_logs không tăng.

Yêu cầu rất quan trọng:
- Phải dùng cùng một client connection từ pool cho toàn bộ transaction.
- Phải dùng client.query('BEGIN'), client.query('COMMIT'), client.query('ROLLBACK').
- Phải release client trong finally.
- Không được dùng nhiều connection khác nhau trong cùng transaction.
- Dùng SELECT ... FOR UPDATE để thể hiện row-level lock.

Response format:
{
  "success": true,
  "feature": "ACID Transaction",
  "sql": "...",
  "data": {
    "beforeState": {...},
    "afterState": {...},
    "transactionStatus": "COMMITTED" hoặc "ROLLED_BACK"
  },
  "explanation": "..."
}

Phần frontend:
Tạo page:
/frontend/src/pages/TransactionDemoPage.tsx

Page cần có:
1. Tiêu đề: ACID Transaction Demo.
2. Box tình huống:
   "Alice transfers 3,000,000 VND to Bob. If an error occurs in the middle, PostgreSQL rolls back all changes."
3. Hiển thị current state:
   - Alice balance.
   - Bob balance.
   - Transfer log count.
4. Nút:
   - Reset Demo Data.
   - Run Successful Transfer.
   - Run Failed Transfer.
5. Sau khi chạy, hiển thị bảng before/after:
   Metric | Before | After
   Alice balance
   Bob balance
   Transfer logs
6. Hiển thị transaction status:
   - COMMITTED màu tích cực.
   - ROLLED_BACK màu cảnh báo.
7. Hiển thị SqlPanel.
8. Hiển thị ExplanationBox về ACID:
   - Atomicity
   - Consistency
   - Isolation
   - Durability

Cập nhật navigation/App routes để vào được Transaction Demo.

Yêu cầu kiểm tra:
1. Reset data.
2. Run Successful Transfer:
   Alice 10M -> 7M, Bob 2M -> 5M, logs +1.
3. Reset data.
4. Run Failed Transfer:
   Alice vẫn 10M, Bob vẫn 2M, logs vẫn 0.
5. Backend build pass.
6. Frontend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: implement acid transaction rollback demo"
git push -u origin HEAD
```

---

# PROMPT 6 — Xây Query Optimizer Demo với EXPLAIN ANALYZE

```text
Bạn là PostgreSQL performance engineer. Hãy xây dựng Query Optimizer Demo cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Demo sự khác biệt trước/sau khi tạo index.
- Dùng bảng sales khoảng 100,000 dòng đã seed.
- Hiển thị EXPLAIN ANALYZE.
- Hiển thị execution time và plan summary.

Phần backend:
Tạo các API:

1. POST /api/demo/optimizer/drop-index
Xóa index nếu tồn tại:
DROP INDEX IF EXISTS idx_sales_region_date;

2. POST /api/demo/optimizer/create-index
Tạo index:
CREATE INDEX IF NOT EXISTS idx_sales_region_date ON sales(region, sale_date);

3. GET /api/demo/optimizer/run
Query params:
- region default Hanoi

Chạy query:
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = $1
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;

Đo execution time ở backend bằng performance.now() hoặc process.hrtime.bigint().
Trả về result và executionTimeMs.

4. GET /api/demo/optimizer/explain
Query params:
- region default Hanoi

Chạy:
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = $1
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;

Trả về:
- raw explain JSON.
- planSummary: Seq Scan / Index Scan / Bitmap Index Scan nếu parse được.
- executionTimeMs lấy từ explain nếu parse được.
- sql hiển thị.

Yêu cầu:
- Không tạo index mặc định ở prompt này nếu chưa bấm Create Index.
- Drop index giúp demo lại nhiều lần.
- API phải hoạt động ổn dù index đã tồn tại hoặc chưa tồn tại.

Phần frontend:
Tạo page:
/frontend/src/pages/OptimizerDemoPage.tsx

Page cần có:
1. Tiêu đề: Query Optimizer Demo.
2. Box tình huống:
   "The sales table contains a large number of rows. We compare query performance before and after creating an index."
3. Hiển thị dataset note: "sales table: around 100,000 records".
4. Select/Input region: Hanoi, HCM, Da Nang, Can Tho.
5. Buttons:
   - Drop Index.
   - Run Query.
   - Create Index.
   - Show EXPLAIN ANALYZE.
6. Khu vực kết quả:
   - executionTimeMs.
   - totalRevenue.
   - planSummary.
7. SqlPanel hiển thị SQL.
8. Code block hiển thị EXPLAIN JSON hoặc text tóm tắt dễ đọc.
9. ExplanationBox:
   - EXPLAIN ANALYZE cho biết PostgreSQL thực thi query thế nào.
   - Index giúp tránh quét toàn bộ bảng khi điều kiện lọc phù hợp.

Cập nhật navigation/App routes.

Yêu cầu kiểm tra demo:
1. Drop Index.
2. Run Query và Show Explain.
3. Kiểm tra plan có khả năng là Seq Scan.
4. Create Index.
5. Run Query và Show Explain lại.
6. Kiểm tra plan có khả năng dùng Index Scan hoặc Bitmap Index Scan.
7. Nếu dataset nhỏ khiến khác biệt chưa rõ, tăng seed sales lên 200,000 dòng hoặc cập nhật README giải thích môi trường local có thể khác nhau.
8. Backend build pass.
9. Frontend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: implement query optimizer explain analyze demo"
git push -u origin HEAD
```

---

# PROMPT 7 — Xây Extension Demo: PostGIS và pgvector

```text
Bạn là PostgreSQL extension specialist. Hãy xây dựng Extension Demo cho PostgreSQL Feature Showcase, gồm 2 tab: PostGIS và pgvector.

Mục tiêu prompt này:
- Demo hệ sinh thái extension của PostgreSQL.
- PostGIS: tìm cửa hàng gần nhất từ tọa độ người dùng.
- pgvector: tìm sản phẩm gần nghĩa bằng vector similarity.

Phần backend:
Tạo route group /api/demo/extensions.

API 1: GET /api/demo/extensions/postgis/nearest
Query params:
- lat default 21.0285
- lng default 105.8542
- limit default 5

SQL:
SELECT
  name,
  address,
  ROUND(
    (ST_Distance(
      location,
      ST_MakePoint($1, $2)::geography
    ) / 1000)::numeric,
    2
  ) AS distance_km
FROM stores
ORDER BY location <-> ST_MakePoint($1, $2)::geography
LIMIT $3;

Lưu ý quan trọng:
- ST_MakePoint nhận tham số theo thứ tự longitude, latitude.
- API nhận lat/lng, nhưng SQL phải truyền lng trước, lat sau.

Response gồm:
- feature: PostGIS
- sql hiển thị dễ đọc.
- data list stores.
- explanation.

API 2: POST /api/demo/extensions/pgvector/search
Request body:
{
  "queryType": "travel_camera"
}

Do demo dùng vector giả VECTOR(3), map queryType thành vector:
- travel_camera -> [0.9, 0.8, 0.7]
- work_laptop -> [0.2, 0.9, 0.6]
- sport_lightweight -> [0.7, 0.2, 0.9]

SQL:
SELECT
  p.name,
  p.category,
  p.price,
  pe.description,
  pe.embedding <-> $1::vector AS distance
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <-> $1::vector
LIMIT 5;

Response gồm:
- feature: pgvector
- sql hiển thị dễ đọc.
- data list products.
- explanation.

Yêu cầu graceful error:
- Nếu PostGIS extension chưa cài được, API trả message rõ:
  "PostGIS extension is not available. Please check database Docker image."
- Nếu vector extension chưa cài được, API trả message rõ.
- Không để backend crash.

Phần frontend:
Tạo page:
/frontend/src/pages/ExtensionDemoPage.tsx

Page cần có:
1. Tiêu đề: PostgreSQL Extension Demo.
2. Hai tab hoặc hai section:
   - PostGIS: Nearest Store.
   - pgvector: AI Semantic Search.

PostGIS section:
- Input latitude, longitude.
- Default: 21.0285, 105.8542.
- Button Find Nearest Stores.
- Result table:
  name, address, distance_km.
- SqlPanel.
- ExplanationBox:
  PostGIS giúp PostgreSQL xử lý dữ liệu bản đồ/GPS, tính khoảng cách, tìm điểm gần nhất.

pgvector section:
- Select query type:
  1. Travel + camera product.
  2. Work laptop product.
  3. Sport lightweight product.
- Button Search by Vector Similarity.
- Result table:
  name, category, price, description, distance.
- SqlPanel.
- ExplanationBox:
  pgvector giúp PostgreSQL lưu vector embedding và tìm kiếm theo độ tương đồng, phục vụ AI search/recommendation.

Cập nhật navigation/App routes.

Yêu cầu kiểm tra:
1. Gọi PostGIS API trả stores theo distance.
2. Gọi pgvector API trả products theo distance.
3. Frontend hiển thị cả 2 demo.
4. Backend build pass.
5. Frontend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: implement postgis and pgvector extension demos"
git push -u origin HEAD
```

---

# PROMPT 8 — Xây Enterprise Features Demo: Constraint, Trigger, Audit Log, View

```text
Bạn là database engineer chuyên thiết kế tính toàn vẹn dữ liệu. Hãy xây Enterprise Features Demo cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Demo PostgreSQL bảo vệ dữ liệu ở tầng database.
- Show Constraint.
- Show Trigger + Audit Log.
- Show View revenue_by_region.

Phần backend:
Tạo route group /api/demo/enterprise.

API 1: POST /api/demo/enterprise/constraint/invalid-product
Thử chạy insert product giá âm:
INSERT INTO products(name, category, price)
VALUES ('Invalid Product', 'test', -1000);

Bắt lỗi PostgreSQL và trả response thành công theo nghĩa demo:
{
  "success": true,
  "feature": "CHECK Constraint",
  "data": {
    "constraintWorked": true,
    "databaseError": "..."
  },
  "explanation": "PostgreSQL rejected invalid data because price must be greater than 0."
}

Không để API trả HTTP 500 cho case này. Đây là lỗi mong đợi để demo.

API 2: POST /api/demo/enterprise/audit/update-product-price
Request body:
{
  "productName": "iPhone 15 Pro",
  "increaseAmount": 1000000
}

Thực hiện:
UPDATE products
SET price = price + $1
WHERE name = $2
RETURNING *;

Sau đó query audit_logs mới nhất liên quan products.
Trả về:
- updatedProduct.
- latestAuditLog.
- sql.
- explanation.

API 3: GET /api/demo/enterprise/audit/logs
Trả về 10 audit logs mới nhất.

API 4: GET /api/demo/enterprise/views/revenue-by-region
Query:
SELECT * FROM revenue_by_region ORDER BY total_revenue DESC;

Trả về data và explanation.

Phần frontend:
Tạo page:
/frontend/src/pages/EnterpriseDemoPage.tsx

Page gồm 3 section:

1. Constraint Demo
- Button: Try Insert Invalid Product.
- Hiển thị database rejected invalid data.
- Hiển thị error message.
- SqlPanel.
- ExplanationBox.

2. Trigger + Audit Log Demo
- Input product name default iPhone 15 Pro.
- Input increase amount default 1000000.
- Button Update Product Price.
- Hiển thị product sau update.
- Hiển thị audit log old_data/new_data.
- Button Load Audit Logs.
- SqlPanel.
- ExplanationBox.

3. View Demo
- Button Load Revenue By Region.
- Hiển thị table region, total_revenue, total_sales.
- SqlPanel.
- ExplanationBox.

Cập nhật navigation/App routes.

Yêu cầu kiểm tra:
1. Constraint demo phải bắt được lỗi CHECK.
2. Audit demo update product và audit_logs có record mới.
3. View demo trả revenue_by_region.
4. Backend build pass.
5. Frontend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: implement enterprise database features demo"
git push -u origin HEAD
```

---

# PROMPT 9 — Hoàn thiện Home Dashboard, navigation và UI consistency

```text
Bạn là frontend engineer có tư duy trình bày kỹ thuật. Hãy hoàn thiện Home Dashboard và UI tổng thể cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Làm app nhìn giống một công cụ demo DBMS chuyên nghiệp.
- Home Dashboard phải giải thích rõ mỗi màn hình demo show PostgreSQL feature nào.
- Navigation rõ ràng.
- Các component dùng lại thống nhất.

Phần frontend cần làm:

1. Hoàn thiện HomePage:
- Tiêu đề lớn: PostgreSQL Feature Showcase.
- Subtitle:
  "A focused demo platform for showing PostgreSQL's strongest DBMS capabilities."
- Có 5 feature cards:
  a. Flexible Data
     JSONB, Array, UUID
  b. ACID Transaction
     Commit, Rollback, Data Consistency
  c. Extensions
     PostGIS and pgvector
  d. Query Optimizer
     Index and EXPLAIN ANALYZE
  e. Enterprise Features
     Constraint, Trigger, Audit Log, View
- Mỗi card có nút Open Demo.

2. Thêm bảng Feature Mapping:
Columns:
- PostgreSQL Feature
- Demo Screen
- Why It Matters

Rows:
- UUID -> Flexible Data -> Safer primary keys for distributed systems.
- JSONB -> Flexible Data -> Flexible document-like attributes.
- Array -> Flexible Data -> Store tags directly.
- Custom Type -> Transaction -> Strict status values.
- ACID Transaction -> Transaction -> Prevent partial updates.
- Rollback -> Transaction -> Recover from mid-process failure.
- PostGIS -> Extensions -> Geospatial search.
- pgvector -> Extensions -> AI semantic search.
- GIN Index -> Flexible Data -> Speed up JSONB/Array queries.
- EXPLAIN ANALYZE -> Optimizer -> Understand query execution.
- Trigger -> Enterprise -> Automatic audit log.
- View -> Enterprise -> Reusable analytics query.

3. Tạo hoặc chuẩn hóa các component:
- Layout.tsx
- Navbar.tsx
- FeatureCard.tsx
- SqlPanel.tsx
- ExplanationBox.tsx
- ResultTable.tsx nếu cần.

4. UI consistency:
- Dùng cùng font, spacing, card style.
- Có màu chính xanh navy hoặc xanh PostgreSQL.
- Code block dễ đọc.
- Buttons đồng nhất.
- Responsive ở mức cơ bản.

5. Cập nhật App routes:
- /
- /jsonb
- /transaction
- /extensions
- /optimizer
- /enterprise

6. Thêm trạng thái loading/error cho các page chính nếu thiếu.

Không thay đổi logic backend trừ khi cần sửa lỗi nhỏ.

Yêu cầu kiểm tra:
1. Frontend build pass.
2. Tất cả routes mở được.
3. Navigation hoạt động.
4. SQL panel copy được.
5. UI không bị trắng trang khi API lỗi.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "feat: polish dashboard navigation and shared ui"
git push -u origin HEAD
```

---

# PROMPT 10 — Thêm scripts kiểm tra, seed/reset tiện dụng và test cơ bản

```text
Bạn là fullstack engineer phụ trách chất lượng dự án. Hãy bổ sung scripts kiểm tra, reset demo data và test cơ bản cho PostgreSQL Feature Showcase.

Mục tiêu prompt này:
- Dự án dễ chạy lại trước khi thuyết trình.
- Có script kiểm tra backend/frontend.
- Có API reset demo data rõ ràng.
- Có test hoặc sanity check cơ bản để tránh demo lỗi.

Backend yêu cầu:
1. Thêm route:
POST /api/demo/reset-all

Route này reset các phần demo quan trọng:
- Reset transaction data Alice/Bob/transfer_logs.
- Drop optimizer index idx_sales_region_date để có thể demo lại từ đầu.
- Clear audit_logs hoặc giữ lại tùy chọn; mặc định clear audit_logs.
- Không xóa products, stores, sales.

Response:
{
  "success": true,
  "message": "Demo data reset successfully"
}

2. Thêm npm script backend:
- "typecheck": "tsc --noEmit"
- "build": giữ nguyên.

3. Nếu chưa có, thêm endpoint list counts:
GET /api/demo/counts
Trả về số lượng records:
- products
- accounts
- transfer_logs
- stores
- product_embeddings
- sales
- audit_logs

Frontend yêu cầu:
1. Thêm nút "Reset All Demo Data" ở HomePage hoặc Navbar.
2. Khi bấm gọi POST /api/demo/reset-all.
3. Hiển thị toast/alert đơn giản reset thành công.
4. Thêm npm script nếu chưa có:
- build.
- typecheck nếu phù hợp.

Root project yêu cầu:
1. Thêm package.json ở root nếu chưa có để chạy lệnh tiện:
- "dev:backend"
- "dev:frontend"
- "build:backend"
- "build:frontend"
- "check"

Nếu không muốn dùng npm workspaces, có thể dùng script dạng:
"build:backend": "cd backend && npm run build"
"build:frontend": "cd frontend && npm run build"
"check": "npm run build:backend && npm run build:frontend"

2. Thêm file scripts/smoke-test.md hoặc scripts/smoke-test.sh.
Nếu là .sh, script nên kiểm tra:
- /api/health
- /api/health/db
- /api/demo/features
- /api/demo/transaction/state
- /api/demo/counts

Nếu môi trường Windows, thêm hướng dẫn PowerShell trong README thay vì bắt buộc .sh.

Yêu cầu kiểm tra:
1. npm run check ở root pass.
2. Reset all demo data chạy được.
3. Counts endpoint trả đúng.
4. Frontend build pass.
5. Backend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "chore: add demo reset scripts and basic checks"
git push -u origin HEAD
```

---

# PROMPT 11 — Viết README, demo script và tài liệu thuyết trình kỹ thuật

```text
Bạn là technical writer kiêm software engineer. Hãy hoàn thiện tài liệu cho PostgreSQL Feature Showcase để nhóm có thể chạy, demo và trình bày tự tin.

Mục tiêu prompt này:
- README đầy đủ nhưng không lan man.
- Có hướng dẫn setup từ đầu.
- Có demo script 10-12 phút.
- Có troubleshooting.
- Có giải thích từng PostgreSQL feature được demo.

Cập nhật README.md với cấu trúc:

1. Project Title
# PostgreSQL Feature Showcase

2. Short Description
Giải thích đây là web app nhỏ để demo điểm mạnh PostgreSQL, không phải app nghiệp vụ lớn.

3. PostgreSQL Features Demonstrated
Bảng gồm:
- Feature
- Demo Screen
- SQL/Object Used
- Why It Matters

4. Tech Stack
- React + Vite + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL 16
- pgcrypto
- PostGIS
- pgvector

5. Project Structure
Hiển thị tree ngắn gọn.

6. Prerequisites
- Node.js
- npm
- Docker
- Docker Compose

7. Setup Instructions
Chi tiết:
- Clone repo.
- Copy env.
- docker compose up -d postgres.
- cd backend && npm install && npm run dev.
- cd frontend && npm install && npm run dev.

8. Reset Database
- docker compose down -v
- docker compose up -d postgres

9. Run Checks
- npm run check ở root nếu có.

10. Demo Flow
Viết flow:
- Home Dashboard.
- JSONB Demo.
- Transaction Success.
- Transaction Failure.
- Extension Demo.
- Optimizer Demo.
- Enterprise Demo.

11. Demo Script 10-12 minutes
Viết lời nói gợi ý bằng tiếng Việt:
- Mở đầu.
- Chuyển từng demo.
- Kết luận.

12. Troubleshooting
Các lỗi thường gặp:
- PostGIS extension not available.
- vector extension not available.
- Docker volume cũ khiến init SQL không chạy lại.
- Backend cannot connect database.
- Port 5432/4000/5173 already used.

13. Team Notes
Gợi ý phân công:
- Database.
- Backend.
- Frontend.
- Presenter.

Ngoài README, tạo file:

docs/demo-script-vi.md

Nội dung:
- Script thuyết trình chi tiết bằng tiếng Việt.
- Mỗi demo có:
  - Thao tác.
  - Câu nói chính.
  - Ý nghĩa PostgreSQL.

Tạo file:

docs/sql-demo-queries.md

Nội dung:
- Liệt kê các SQL quan trọng:
  - JSONB query.
  - Transaction success.
  - Transaction failure.
  - PostGIS nearest.
  - pgvector search.
  - EXPLAIN ANALYZE.
  - Trigger audit.
  - View revenue_by_region.

Yêu cầu kiểm tra:
1. README đọc rõ, không mâu thuẫn với code.
2. Các command trong README đúng với project hiện tại.
3. Không ghi thông tin giả như screenshot chưa có.
4. Backend build pass.
5. Frontend build pass.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "docs: add setup guide and presentation script"
git push -u origin HEAD
```

---

# PROMPT 12 — Final integration, hardening và kiểm tra trước khi trình bày

```text
Bạn là tech lead chịu trách nhiệm bàn giao bản demo cuối cùng. Hãy rà soát, sửa lỗi và hoàn thiện PostgreSQL Feature Showcase để sẵn sàng trình bày.

Mục tiêu prompt này:
- Kiểm tra toàn bộ flow từ đầu đến cuối.
- Sửa lỗi build/runtime.
- Đảm bảo demo chạy ổn sau khi reset database.
- Đảm bảo mỗi màn hình đều show rõ PostgreSQL feature.
- Đảm bảo commit final sạch sẽ.

Việc cần làm:

1. Kiểm tra database init
- docker compose down -v
- docker compose up -d postgres
- Xem log postgres.
- Đảm bảo extensions tạo được hoặc README có troubleshooting rõ.
- Kiểm tra các bảng có dữ liệu:
  products, accounts, stores, product_embeddings, sales.

2. Kiểm tra backend
- npm install nếu cần.
- npm run build.
- Chạy backend dev.
- Test endpoints:
  GET /api/health
  GET /api/health/db
  GET /api/demo/features
  GET /api/demo/counts
  GET /api/demo/jsonb?category=smartphone&brand=Apple
  POST /api/demo/transaction/reset
  POST /api/demo/transaction/success
  POST /api/demo/transaction/failure
  GET /api/demo/extensions/postgis/nearest
  POST /api/demo/extensions/pgvector/search
  GET /api/demo/optimizer/run
  GET /api/demo/optimizer/explain
  POST /api/demo/enterprise/constraint/invalid-product
  GET /api/demo/enterprise/views/revenue-by-region

3. Kiểm tra frontend
- npm install nếu cần.
- npm run build.
- Chạy frontend dev.
- Mở từng route:
  /
  /jsonb
  /transaction
  /extensions
  /optimizer
  /enterprise

4. Kiểm tra UX demo
Mỗi page phải có đủ:
- Tình huống demo.
- Nút chạy demo.
- Kết quả.
- SQL panel.
- Explanation box.

5. Hardening nhỏ
- Thêm loading state nếu thiếu.
- Thêm error state nếu API fail.
- Format tiền VND dễ đọc.
- Format JSON attributes dễ đọc.
- Không để undefined/null hiện xấu trên UI.
- Không để console error không cần thiết.

6. Reset demo tiện lợi
- Nút Reset All Demo Data chạy được.
- Sau reset, Transaction Demo trở về Alice 10M, Bob 2M, logs 0.
- Optimizer index được drop để demo lại từ đầu.

7. Final documentation check
- README command đúng.
- docs/demo-script-vi.md khớp với UI.
- docs/sql-demo-queries.md khớp với SQL trong backend.

8. Không thêm tính năng lớn mới.
Chỉ sửa lỗi, polish, đảm bảo ổn định.

Yêu cầu cuối cùng:
- Root npm run check pass nếu có.
- Backend build pass.
- Frontend build pass.
- Database reset chạy được.
- Toàn bộ demo flow chạy được.

Sau khi hoàn thành và chạy được, thực hiện:

git status
git add .
git commit -m "chore: finalize postgresql feature showcase demo"
git push -u origin HEAD

Sau khi push xong, in ra trong terminal hoặc ghi vào README phần Final Demo Checklist:
- Database reset command.
- Backend run command.
- Frontend run command.
- Demo route order.
```

---

# Gợi ý thứ tự chạy sau khi hoàn thành 12 prompt

Sau khi làm xong toàn bộ, chạy lại từ đầu:

```bash
docker compose down -v
docker compose up -d postgres
cd backend
npm install
npm run build
npm run dev
```

Mở terminal khác:

```bash
cd frontend
npm install
npm run build
npm run dev
```

Nếu có root script:

```bash
npm run check
```

Thứ tự demo khi trình bày:

```text
1. Home Dashboard
2. JSONB & Flexible Data Demo
3. ACID Transaction Demo — Success
4. ACID Transaction Demo — Failure/Rollback
5. Extension Demo — PostGIS
6. Extension Demo — pgvector
7. Query Optimizer Demo — Before/After Index
8. Enterprise Demo — Constraint, Trigger, View
9. Conclusion
```

Thông điệp kết luận:

> PostgreSQL mạnh vì nó vừa chặt chẽ như một relational database, vừa linh hoạt như một document database, vừa có thể mở rộng thành geospatial database, vector database và analytics engine nhờ hệ sinh thái extension và optimizer mạnh.

