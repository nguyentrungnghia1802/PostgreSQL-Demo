# Thuyết trình: Sức mạnh PostgreSQL — Minh họa qua PostgreSQL Feature Showcase

> **Tổng thời lượng:** ~35 phút (thuyết trình lý thuyết + demo trực tiếp)
>
> **Chuẩn bị trước khi trình bày:**
> 1. Chạy `docker compose up -d` trong thư mục gốc — đợi container healthy
> 2. Chạy `npm run dev` trong thư mục gốc
> 3. Mở trình duyệt tại `http://localhost:4000`
> 4. Bấm **Reset All Demo Data** để bắt đầu với dữ liệu sạch

---

## PHẦN 1 — Tổng quan PostgreSQL (~8 phút, không demo)

### 1.1. Mở đầu

> "Kính thưa thầy/cô, hôm nay nhóm em xin trình bày về **PostgreSQL** — và để tránh chỉ nói lý thuyết, chúng em đã xây một công cụ demo nhỏ gọi là **PostgreSQL Feature Showcase** nhằm minh họa trực tiếp từng điểm mạnh ngay trong trình duyệt."

Bài trình bày đi theo cấu trúc:

1. **PostgreSQL là gì** và vị trí của nó trong thế giới DBMS.
2. **Tổng quan các điểm mạnh** quan trọng nhất của PostgreSQL.
3. **Demo trực tiếp** 5 nhóm tính năng chạy thật trong phần mềm.

---

### 1.2. PostgreSQL là gì?

**PostgreSQL** (đọc là *post-gres-Q-L*, thường gọi tắt là *Postgres*) là một **hệ quản trị cơ sở dữ liệu quan hệ hướng đối tượng** — **Object-Relational DBMS (ORDBMS)** — mã nguồn mở, miễn phí, phát triển liên tục từ năm 1986 bởi cộng đồng toàn cầu.

Khác với nhiều database khác, PostgreSQL có triết lý phát triển nhất quán:

> Ưu tiên **độ đúng đắn, tính toàn vẹn dữ liệu, tuân thủ chuẩn SQL** — trước khi nghĩ đến tốc độ hay tính năng ngắn hạn.

**Một số con số thực tế:**
- Stack Overflow Developer Survey 2023: PostgreSQL là database **được dùng nhiều nhất** trong nhóm developer chuyên nghiệp (49.1%).
- Được dùng bởi Apple, Instagram, Reddit, Spotify, Twitch, GitLab.
- Nền tảng của nhiều dịch vụ cloud: Amazon Aurora PostgreSQL, Azure Database for PostgreSQL, Google Cloud SQL.

---

### 1.3. PostgreSQL nằm ở đâu trong hệ sinh thái DBMS?

| Loại DBMS | Ví dụ | Đặc điểm |
|---|---|---|
| **Relational (SQL)** | MySQL, SQL Server, Oracle | Bảng, quan hệ, SQL chuẩn |
| **Document** | MongoDB | JSON tự do, schema linh hoạt |
| **Key-Value** | Redis | Cực nhanh, đơn giản |
| **Graph** | Neo4j | Quan hệ phức tạp |
| **Vector** | Pinecone, Weaviate | AI semantic search |
| **Spatial** | PostGIS (riêng biệt) | Dữ liệu địa lý |

**PostgreSQL có vị trí đặc biệt:**

> PostgreSQL là **relational database** theo chuẩn, nhưng thông qua hệ thống extension, nó **tích hợp được khả năng của hầu hết các loại database trên** — trong một hệ thống duy nhất.

| Nhu cầu | Giải pháp trong PostgreSQL |
|---|---|
| JSON linh hoạt như MongoDB | JSONB + GIN Index |
| Tìm kiếm gần đúng như Elasticsearch | `tsvector`, `tsquery` |
| Dữ liệu bản đồ như PostGIS riêng | Extension PostGIS |
| AI vector search như Pinecone | Extension pgvector |
| Cache nhanh như Redis | Unlogged table / Materialized view |

---

### 1.4. Tổng quan 5 điểm mạnh sẽ được demo

Dưới đây là 5 nhóm tính năng sẽ được minh họa trực tiếp:

| # | Tính năng | Ý nghĩa thực tế |
|---|---|---|
| 1 | **JSONB & Flexible Data** | Xử lý dữ liệu bán cấu trúc, đa dạng schema |
| 2 | **ACID Transaction** | An toàn dữ liệu tài chính, không mất dữ liệu khi lỗi |
| 3 | **Extensions (PostGIS + pgvector)** | Không gian địa lý + AI semantic search ngay trong SQL |
| 4 | **Query Optimizer & Index** | Tự động tối ưu, minh bạch qua EXPLAIN ANALYZE |
| 5 | **Enterprise Features** | Constraint, Trigger, Audit Log, View — bảo vệ tại tầng database |

---

## PHẦN 2 — Demo trực tiếp (~27 phút)

> **Lưu ý khi demo:** Mỗi màn hình hiển thị SQL query thật đang chạy trong backend. Đây không phải mock data — tất cả đều kết nối PostgreSQL 16 thật trong Docker container.

---

### Demo 1 — Flexible Data: JSONB & Array (~5 phút)

**Thao tác:** Bấm **Flexible Data** trên nav → vào `/demo/jsonb`

---

#### Vấn đề thực tế

Hãy tưởng tượng một hệ thống bán hàng với nhiều loại sản phẩm:

- **Smartphone**: `brand`, `color`, `storage`, `ram`
- **Giày**: `size`, `material`, `sole_type`
- **Máy ảnh**: `megapixel`, `lens_mount`, `sensor_type`

Nếu dùng **schema cứng**: phải thêm hàng chục cột, phần lớn là NULL cho mỗi dòng. Nếu tách bảng riêng cho từng loại: query phức tạp, khó mở rộng.

**PostgreSQL giải quyết:** Cột `attributes` kiểu **JSONB** — mỗi sản phẩm tự định nghĩa thuộc tính riêng, không cần thay đổi schema.

---

#### SQL đang chạy trong demo

```sql
-- Lọc sản phẩm theo thuộc tính trong JSONB và tag trong Array
SELECT name, category, price, attributes, tags
FROM products
WHERE category = 'smartphone'
  AND attributes->>'brand' = 'Apple'
  AND tags @> ARRAY['travel'];
```

Giải thích:
- `attributes->>'brand'` — trích giá trị từ JSONB bằng text key.
- `tags @> ARRAY['travel']` — toán tử "contains": tìm sản phẩm có tag `travel` trong cột mảng.

**Index giúp truy vấn này nhanh:**

```sql
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
CREATE INDEX idx_products_tags       ON products USING GIN (tags);
```

**GIN (Generalized Inverted Index)** — loại index đặc biệt của PostgreSQL, được thiết kế cho dữ liệu composite như JSONB và mảng. Với 100.000 dòng, GIN Index vẫn duy trì thời gian truy vấn ổn định.

---

#### Thao tác demo

1. Chọn Category = `smartphone`, gõ Brand = `Apple`, bấm **Run Query**
2. Quan sát kết quả và SQL query hiển thị bên dưới
3. Thay đổi filter → kết quả thay đổi tức thì

---

#### Điểm mạnh PostgreSQL ở đây

| Tính năng | Ý nghĩa |
|---|---|
| **JSONB** | Lưu và query JSON trực tiếp trong SQL — không cần giải JSON ở application |
| **Array type** | Cột đa giá trị không cần bảng phụ, query bằng toán tử `@>` |
| **GIN Index** | Index hiệu quả cho JSONB và Array, giữ tốc độ ở bảng lớn |
| **Schema linh hoạt** | Thêm loại sản phẩm mới không cần ALTER TABLE |

> **Tóm tắt:** PostgreSQL làm được những gì MongoDB làm, ngay trong SQL — và vẫn giữ được tính nhất quán của relational database.

---

### Demo 2 — ACID Transaction & Concurrency Control (~5 phút)

**Thao tác:** Bấm **Transaction** trên nav → vào `/demo/transaction`

---

#### Vấn đề thực tế

Hệ thống chuyển tiền giữa hai tài khoản:

1. **Trừ tiền** Alice: `balance = balance - 3,000,000`
2. **Cộng tiền** Bob: `balance = balance + 3,000,000`

Điều gì xảy ra nếu hệ thống crash **sau bước 1, trước bước 2**? Alice bị mất 3 triệu mà Bob không nhận được. Đây là thảm họa với bất kỳ hệ thống tài chính nào.

---

#### Phần A: Giao dịch thành công

**Thao tác:** Bấm **Reset Demo Data** → Bấm **Run Successful Transfer**

```sql
BEGIN;

SELECT id, balance FROM accounts WHERE owner_name = 'Alice' FOR UPDATE;
SELECT id, balance FROM accounts WHERE owner_name = 'Bob'   FOR UPDATE;

UPDATE accounts SET balance = balance - 3000000 WHERE owner_name = 'Alice';
UPDATE accounts SET balance = balance + 3000000 WHERE owner_name = 'Bob';

INSERT INTO transfer_logs (from_account, to_account, amount, status)
VALUES ('<alice_id>', '<bob_id>', 3000000, 'SUCCESS');

COMMIT;
```

**Kết quả:** Alice giảm từ 10M → 7M. Bob tăng từ 2M → 5M. Transfer log ghi 1 bản ghi SUCCESS.

---

#### Phần B: Giao dịch thất bại — tự động Rollback

**Thao tác:** Bấm **Reset Demo Data** → Bấm **Run Failed Transfer**

```sql
BEGIN;

SELECT id, balance FROM accounts WHERE owner_name = 'Alice' FOR UPDATE;
SELECT id, balance FROM accounts WHERE owner_name = 'Bob'   FOR UPDATE;

UPDATE accounts SET balance = balance - 3000000 WHERE owner_name = 'Alice';

SELECT 1 / 0;  -- Lỗi mô phỏng hệ thống crash

-- Không bao giờ đến đây — client gửi ROLLBACK
ROLLBACK;
```

**Kết quả:** Alice **vẫn 10M**, Bob **vẫn 2M**, transfer_logs **vẫn 0 dòng**.

PostgreSQL **tự động hủy toàn bộ transaction** — không để lại trạng thái nửa vời.

---

#### Điểm mạnh PostgreSQL ở đây

**ACID — 4 nguyên tắc PostgreSQL đảm bảo:**

| Nguyên tắc | Ý nghĩa | Demo minh họa |
|---|---|---|
| **Atomicity** — Tính nguyên tử | Toàn bộ hoặc không gì cả | Rollback hủy cả 2 lệnh UPDATE |
| **Consistency** — Tính nhất quán | Dữ liệu luôn thỏa ràng buộc | Tổng tiền trước/sau transfer bằng nhau |
| **Isolation** — Tính cô lập | Transaction song song không gây dữ liệu sai | `FOR UPDATE` khóa row, ngăn race condition |
| **Durability** — Tính bền vững | Sau COMMIT, dữ liệu tồn tại vĩnh viễn | WAL đảm bảo phục hồi sau crash |

**MVCC — Multi-Version Concurrency Control:**

Thay vì khóa toàn bộ bảng, PostgreSQL dùng MVCC: mỗi transaction thấy một "snapshot" nhất quán của dữ liệu tại thời điểm nó bắt đầu. Điều này cho phép:
- Đọc và ghi đồng thời mà không chặn nhau.
- Hệ thống xử lý được nhiều user cùng lúc mà không mất tính nhất quán.

> **Tóm tắt:** PostgreSQL đảm bảo tiền không biến mất, không nhân đôi, không bị mất khi hệ thống gặp sự cố — nhờ ACID Transaction và row-level locking.

---

### Demo 3 — Extensions: PostGIS & pgvector (~5 phút)

**Thao tác:** Bấm **Extensions** trên nav → vào `/demo/extensions`

---

#### Giới thiệu: Extension system của PostgreSQL

Một trong những thiết kế đặc biệt của PostgreSQL là **hệ thống extension**: bất kỳ ai cũng có thể viết extension để thêm kiểu dữ liệu, toán tử, hàm, index mới vào PostgreSQL — và chúng hoạt động như tính năng native, không phải wrapper bên ngoài.

Demo này dùng 2 extension quan trọng nhất hiện nay:

```sql
CREATE EXTENSION IF NOT EXISTS postgis;  -- Dữ liệu địa lý
CREATE EXTENSION IF NOT EXISTS vector;   -- AI vector search
```

---

#### Phần A: PostGIS — Tìm cửa hàng gần nhất

**Bài toán:** Người dùng đứng tại Hoàn Kiếm, Hà Nội (tọa độ GPS: 21.0285°N, 105.8542°E). Tìm 5 cửa hàng gần nhất theo khoảng cách thực.

**Thao tác:** Giữ tọa độ mặc định → Bấm **Find Nearest Stores**

```sql
SELECT
  name,
  address,
  ROUND(
    (ST_Distance(
      location,
      ST_MakePoint(105.8542, 21.0285)::geography
    ) / 1000)::numeric, 2
  ) AS distance_km
FROM stores
ORDER BY location <-> ST_MakePoint(105.8542, 21.0285)::geography
LIMIT 5;
```

Giải thích:
- `GEOGRAPHY` — kiểu dữ liệu của PostGIS, lưu tọa độ GPS với tính toán trên mặt cầu (không phải mặt phẳng).
- `ST_Distance` — tính khoảng cách địa lý thực tế tính bằng mét.
- Toán tử `<->` — tính khoảng cách KNN (K-Nearest Neighbor) tối ưu, có thể kết hợp GiST index.

**Không cần Google Maps API, không cần hệ thống GIS riêng** — chỉ cần SQL thuần.

---

#### Phần B: pgvector — AI Semantic Search

**Bài toán:** Người dùng muốn tìm sản phẩm "phù hợp cho chuyến đi và có camera tốt" — không phải tìm từ khóa, mà tìm theo **ý nghĩa**.

**Thao tác:** Chọn "Travel + camera product" → Bấm **Search by Vector Similarity**

```sql
SELECT
  p.name, p.category, p.price,
  pe.embedding <-> '[0.9, 0.8, 0.7]'::vector AS distance
FROM product_embeddings pe
JOIN products p ON p.id = pe.product_id
ORDER BY pe.embedding <-> '[0.9, 0.8, 0.7]'::vector
LIMIT 5;
```

Giải thích:
- Mỗi sản phẩm được chuyển thành một **vector embedding** — mảng số thực biểu diễn "ý nghĩa" của sản phẩm.
- Toán tử `<->` tính **khoảng cách cosine** giữa query vector và embedding của từng sản phẩm.
- Sản phẩm nào có vector gần với query nhất → kết quả trả về đầu tiên.
- Trong hệ thống thực tế, embedding được sinh bởi LLM (OpenAI, Gemini, v.v.).

> **pgvector thay thế** Pinecone, Weaviate hay Qdrant trong nhiều trường hợp — giữ toàn bộ dữ liệu trong một hệ thống PostgreSQL duy nhất.

---

#### Điểm mạnh PostgreSQL ở đây

| Extension | Thay thế hệ thống riêng | Lợi ích |
|---|---|---|
| **PostGIS** | Hệ thống GIS, ArcGIS | SQL spatial query, không cần API ngoài |
| **pgvector** | Pinecone, Weaviate, Qdrant | AI search ngay trong DB, đơn giản hóa kiến trúc |

> **Tóm tắt:** PostgreSQL mở rộng được thành spatial database và AI database mà không cần thêm hệ thống mới — giảm complexity và chi phí hạ tầng.

---

### Demo 4 — Query Optimizer & Index (~4 phút)

**Thao tác:** Bấm **Optimizer** trên nav → vào `/demo/optimizer`

---

#### Vấn đề thực tế

Bảng `sales` có **100.000 dòng** dữ liệu bán hàng. Query cần tổng doanh thu theo region trong 30 ngày gần nhất:

```sql
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;
```

Không có index: PostgreSQL phải đọc **tất cả 100.000 dòng** để tìm dòng thỏa điều kiện — gọi là **Sequential Scan (Seq Scan)**. Với bảng lớn hơn (hàng triệu dòng), điều này gây chậm nghiêm trọng.

---

#### Phần A: Không có Index — Seq Scan

**Thao tác:** Bấm **Drop Index** → Bấm **Run Query** → Bấm **Show EXPLAIN ANALYZE**

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT region, SUM(amount) AS total_revenue
FROM sales
WHERE region = 'Hanoi'
  AND sale_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY region;
```

**EXPLAIN ANALYZE** không chỉ hiển thị kế hoạch — nó **thực thi query thật** và báo cáo:
- `Seq Scan on sales` — đọc tuần tự toàn bộ bảng
- `actual rows` — số dòng thực tế sau filter
- `actual time` — thời gian thực thi từng node

---

#### Phần B: Có Index — Index Scan

**Thao tác:** Bấm **Create Index** → Bấm **Run Query** → Bấm **Show EXPLAIN ANALYZE**

```sql
CREATE INDEX IF NOT EXISTS idx_sales_region_date ON sales(region, sale_date);
```

**Composite Index** — index trên nhiều cột — phù hợp với query lọc theo cả `region` và `sale_date`.

**Kết quả:** PostgreSQL chuyển từ **Seq Scan → Bitmap Index Scan** hoặc **Index Scan**. Execution time giảm rõ rệt.

---

#### Điểm mạnh PostgreSQL ở đây

PostgreSQL có nhiều loại index chuyên dụng:

| Loại Index | Dùng khi nào |
|---|---|
| **B-tree** (mặc định) | So sánh `=`, `<`, `>`, `BETWEEN`, `ORDER BY` |
| **GIN** | JSONB, Array, Full-text search |
| **GiST** | Dữ liệu hình học, PostGIS, Range type |
| **BRIN** | Bảng rất lớn, dữ liệu tuần tự theo thời gian |
| **Partial index** | Chỉ index một phần dữ liệu (VD: chỉ đơn hàng `status = 'pending'`) |
| **Expression index** | Index trên kết quả hàm (VD: `LOWER(email)`) |

**Query Planner của PostgreSQL** sử dụng **cost-based model**: nó ước tính chi phí của nhiều kế hoạch thực thi khác nhau, chọn kế hoạch rẻ nhất dựa trên thống kê bảng (`ANALYZE`).

> **Tóm tắt:** PostgreSQL không chỉ chạy query — nó **giải thích** mình đang làm gì qua EXPLAIN ANALYZE. Đây là công cụ không thể thiếu khi tối ưu hiệu năng hệ thống thực tế.

---

### Demo 5 — Enterprise Features: Constraint, Trigger, View (~4 phút)

**Thao tác:** Bấm **Enterprise** trên nav → vào `/demo/enterprise`

---

#### Triết lý: Bảo vệ dữ liệu tại tầng database

Nhiều hệ thống chỉ validate dữ liệu ở **application layer** (code Node.js, Java, v.v.). Vấn đề: application có thể bị bypass — bởi developer khác, bởi script chạy trực tiếp, bởi lỗi code.

**PostgreSQL cho phép đặt luật bảo vệ ngay tại database** — bất kỳ client nào cũng không thể vi phạm.

---

#### Phần A: CHECK Constraint — Ngăn dữ liệu sai từ gốc

**Thao tác:** Bấm **Try Insert Invalid Product**

```sql
INSERT INTO products (name, category, price)
VALUES ('Invalid Product', 'test', -1000);
-- ERROR: new row for relation "products" violates check constraint "products_price_check"
```

Constraint được định nghĩa khi tạo bảng:

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC CHECK (price > 0),   -- Giá phải dương
    ...
);
```

**Kết quả:** Database tự từ chối insert — lỗi xảy ra ở tầng PostgreSQL, không thể bypass qua bất kỳ application nào.

---

#### Phần B: Trigger + Audit Log — Tự động theo dõi thay đổi

**Bài toán:** Khi giá sản phẩm thay đổi, hệ thống cần ghi lại: ai thay đổi, lúc nào, giá cũ là bao nhiêu, giá mới là bao nhiêu.

**Thao tác:** Bấm **Update Product Price** → Quan sát Audit Log

```sql
UPDATE products
SET price = price + 1000000
WHERE name = 'iPhone 15 Pro'
RETURNING *;
```

Trigger **tự động chạy** sau mỗi UPDATE:

```sql
CREATE OR REPLACE FUNCTION log_product_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (table_name, action, old_data, new_data)
  VALUES ('products', 'UPDATE', row_to_json(OLD), row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_audit
AFTER UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION log_product_changes();
```

**Kết quả:** `audit_logs` tự động có bản ghi với `old_data` và `new_data` dạng JSON. **Không cần code gọi API audit riêng** — database tự làm.

---

#### Phần C: View — Trừu tượng hóa logic phức tạp

**Thao tác:** Bấm **Load Revenue By Region**

```sql
-- Định nghĩa view một lần
CREATE OR REPLACE VIEW revenue_by_region AS
SELECT region, SUM(amount) AS total_revenue, COUNT(*) AS total_sales
FROM sales
GROUP BY region;

-- Query đơn giản từ bất kỳ client nào
SELECT * FROM revenue_by_region ORDER BY total_revenue DESC;
```

**Lợi ích:**
- Logic nghiệp vụ tập trung tại database, không bị lặp ở nhiều nơi.
- Khi logic thay đổi, chỉ cần sửa view — không cần sửa tất cả nơi query.
- Kiểm soát quyền truy cập: cấp quyền SELECT trên view, không cấp trực tiếp vào bảng gốc.

---

#### Điểm mạnh PostgreSQL ở đây

| Tính năng | Ý nghĩa thực tế |
|---|---|
| **CHECK Constraint** | Dữ liệu luôn hợp lệ dù application có lỗi hay bị bypass |
| **Trigger** | Tự động hóa logic (audit, notification, cascade) không cần code ở application |
| **Stored Function (PL/pgSQL)** | Logic phức tạp chạy gần dữ liệu, giảm round-trip |
| **View** | Trừu tượng hóa query, kiểm soát truy cập, tái sử dụng logic |

> **Tóm tắt:** PostgreSQL không chỉ là nơi lưu dữ liệu — nó là một **tầng bảo vệ dữ liệu độc lập**, đảm bảo tính đúng đắn dù application có vấn đề.

---

## PHẦN 3 — Kết luận (~3 phút)

### 3.1. Tổng kết những gì đã demo

| Demo | Điểm mạnh | Thay thế hệ thống nào |
|---|---|---|
| JSONB & Array | Dữ liệu bán cấu trúc linh hoạt | MongoDB trong nhiều tình huống |
| ACID Transaction | An toàn dữ liệu tài chính | Không thể thiếu với bất kỳ hệ thống nghiêm túc |
| PostGIS | Spatial query trong SQL | Google Maps API, hệ thống GIS riêng |
| pgvector | AI semantic search | Pinecone, Weaviate |
| EXPLAIN ANALYZE | Tối ưu hiệu năng có căn cứ | Đây là lợi thế của PostgreSQL so với nhiều DB khác |
| Constraint + Trigger | Bảo vệ dữ liệu tại tầng DB | Validation chỉ ở application layer |

---

### 3.2. Khi nào nên chọn PostgreSQL?

**Nên chọn PostgreSQL khi:**
- Dữ liệu cần tính nhất quán cao (tài chính, y tế, logistics).
- Truy vấn phức tạp, nhiều bảng, nhiều điều kiện lọc.
- Cần xử lý nhiều loại dữ liệu: JSON, địa lý, văn bản, vector trong một hệ thống.
- Cần audit trail, compliance, bảo mật dữ liệu chặt.
- Hệ thống dự kiến scale lên trong tương lai.

**Không nhất thiết phải dùng PostgreSQL khi:**
- Ứng dụng đơn giản, ít truy vấn phức tạp (SQLite đủ dùng).
- Cần tốc độ đọc cực cao, dữ liệu không cần persistent (Redis phù hợp hơn).
- Bài toán graph thuần túy (Neo4j phù hợp hơn).

---

### 3.3. Câu kết

> "Qua 5 demo vừa rồi, chúng ta thấy PostgreSQL không chỉ là một database quan hệ thông thường. Nó là một **nền tảng dữ liệu đa năng**: vừa chặt chẽ như SQL truyền thống, vừa linh hoạt như NoSQL, vừa mở rộng được sang spatial và AI.
>
> Điều đáng chú ý là tất cả những gì vừa demo — từ JSONB, transaction, PostGIS, pgvector, đến trigger và view — **đều chạy trong một hệ thống PostgreSQL duy nhất**, không cần thêm công cụ nào khác.
>
> Đây là lý do PostgreSQL được lựa chọn ở các hệ thống thực tế đòi hỏi độ tin cậy cao và kiến trúc đơn giản."

---

## Phụ lục — Câu hỏi thường gặp

### PostgreSQL vs MySQL — Khác nhau ở đâu?

| Tiêu chí | PostgreSQL | MySQL |
|---|---|---|
| Tuân thủ chuẩn SQL | Cao hơn | Trung bình |
| JSONB | Hỗ trợ tốt, có GIN index | JSON cơ bản, index hạn chế |
| Transaction isolation | Đầy đủ 4 mức, SERIALIZABLE thật | Một số mức là gần đúng |
| Extension system | Rất mạnh | Hạn chế |
| Kiểu dữ liệu | Phong phú hơn | Cơ bản hơn |
| Dùng cho | Hệ thống phức tạp, enterprise | Web truyền thống, CMS |

### MVCC là gì?

**Multi-Version Concurrency Control** — thay vì khóa dòng khi đọc, PostgreSQL lưu nhiều phiên bản của dòng dữ liệu. Mỗi transaction thấy snapshot nhất quán tại thời điểm nó bắt đầu. Kết quả:
- **Đọc không chặn ghi**, **ghi không chặn đọc** (trừ khi có xung đột thực sự).
- Hệ thống xử lý concurrent users tốt hơn nhiều.
- Cần `VACUUM` để dọn dẹp phiên bản cũ không còn dùng.

### WAL là gì?

**Write-Ahead Logging** — trước khi ghi dữ liệu vào disk, PostgreSQL ghi log vào WAL. Khi hệ thống crash và khởi động lại, PostgreSQL đọc WAL để phục hồi đến trạng thái cuối cùng đã commit. Đây là cơ chế đảm bảo **Durability** trong ACID.

### pgvector có thể dùng trong production không?

Có. pgvector được dùng production bởi nhiều công ty. Với vector dimension ≤ 2000 và vài triệu records, pgvector với IVFFlat hoặc HNSW index đạt hiệu năng tốt. Khi scale lên hàng chục triệu vector với low-latency yêu cầu cao, mới cần cân nhắc Pinecone/Weaviate.

---

*Phần mềm demo: PostgreSQL Feature Showcase — Node.js + React + PostgreSQL 16 (Docker)*
