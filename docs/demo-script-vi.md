# Script Thuyết Trình — PostgreSQL Feature Showcase

Thời lượng: **10–12 phút**. Thứ tự: Home → Flexible Data → Transaction → Extensions → Optimizer → Enterprise.

> **Chuẩn bị trước:**
> 1. `docker compose up -d postgres` → đợi healthy
> 2. `cd backend && npm run dev`
> 3. `cd frontend && npm run dev`
> 4. Mở trình duyệt tại `http://localhost:5173`
> 5. Bấm **Reset All Demo Data** để bắt đầu sạch

---

## Mở đầu (~1 phút)

**Thao tác:** Mở trang Home `/`

**Câu nói:**
> "Đây là PostgreSQL Feature Showcase — một công cụ demo nhỏ giúp chúng ta thấy rõ những gì PostgreSQL làm được mà nhiều database khác không có hoặc cần thêm công cụ ngoài mới có.
>
> Trên bảng Feature Mapping, mỗi dòng là một tính năng PostgreSQL đang chạy thật trong backend demo này — từ JSONB, ACID Transaction, PostGIS, pgvector, cho đến Trigger và View.
>
> Chúng ta sẽ đi qua 5 màn hình demo, mỗi màn hình minh họa một nhóm tính năng."

---

## Demo 1 — Flexible Data (~2 phút)

**Thao tác:** Bấm **Flexible Data** trên nav, vào `/demo/jsonb`

**Câu nói:**
> "Bài toán thực tế: Một sản phẩm smartphone có `brand`, `color`, `storage` — trong khi một đôi giày lại có `size`, `material`. Schema cứng nhắc sẽ phải thêm hàng chục cột NULL.
>
> PostgreSQL giải quyết bằng JSONB: mỗi sản phẩm có cột `attributes` lưu JSON tự do."

**Thao tác:** Chọn Category = `smartphone`, gõ Brand = `Apple`, bấm **Run Query**

**Câu nói:**
> "SQL dùng `attributes->>'brand' = 'Apple'` để lọc trong JSON. Array tag dùng toán tử `@>` — tìm sản phẩm nào có tag 'travel'.
>
> GIN Index giúp truy vấn này nhanh dù bảng có hàng trăm nghìn dòng. Đây là lý do JSONB thực dụng hơn nhiều so với lưu JSON thuần túy ở application layer."

**Ý nghĩa PostgreSQL:**
- JSONB: lưu và query JSON ngay trong SQL
- Array: cột multi-value không cần bảng phụ
- GIN Index: index cho JSONB và Array

---

## Demo 2 — ACID Transaction (~2 phút)

**Thao tác:** Bấm **Transaction** trên nav, vào `/demo/transaction`

**Câu nói:**
> "Tình huống: Alice chuyển 3 triệu cho Bob. Điều gì xảy ra nếu hệ thống crash giữa chừng — sau khi trừ tiền Alice nhưng chưa cộng cho Bob?"

**Thao tác:** Bấm **Reset Demo Data**, sau đó bấm **Run Successful Transfer**

**Câu nói:**
> "Alice giảm từ 10M xuống 7M, Bob tăng từ 2M lên 5M. Transaction log ghi 1 bản ghi SUCCESS. Tất cả trong một lần `COMMIT`."

**Thao tác:** Bấm **Reset Demo Data**, sau đó bấm **Run Failed Transfer**

**Câu nói:**
> "Lần này: Alice bị trừ tiền, nhưng ngay sau đó hệ thống throw error. PostgreSQL tự động `ROLLBACK` — Alice vẫn 10M, Bob vẫn 2M, transfer_logs vẫn 0.
>
> `SELECT ... FOR UPDATE` đảm bảo row-level lock: không có transaction song song nào có thể chạm vào cùng account trong lúc này."

**Ý nghĩa PostgreSQL:**
- Atomicity: hoặc toàn bộ xảy ra, hoặc không gì xảy ra
- Isolation: FOR UPDATE ngăn race condition
- Durability: sau COMMIT, dữ liệu được ghi vĩnh viễn

---

## Demo 3 — PostgreSQL Extensions (~2 phút)

**Thao tác:** Bấm **Extensions** trên nav, vào `/demo/extensions`

### PostGIS

**Câu nói:**
> "PostgreSQL không chỉ là relational database — PostGIS biến nó thành spatial database. Tọa độ GPS được lưu kiểu `GEOGRAPHY`, và chúng ta có thể tìm cửa hàng gần nhất bằng SQL thuần."

**Thao tác:** Giữ tọa độ mặc định (Hoàn Kiếm, Hà Nội), bấm **Find Nearest Stores**

**Câu nói:**
> "Operator `<->` tính khoảng cách địa lý giữa điểm người dùng và tọa độ từng cửa hàng. Kết quả được sắp xếp theo `distance_km`. Không cần hệ thống GIS riêng."

### pgvector

**Câu nói:**
> "pgvector là extension cho phép lưu vector embedding và tìm kiếm theo độ tương đồng — phục vụ AI/recommendation. Demo này dùng vector 3 chiều giả lập."

**Thao tác:** Chọn "Travel + camera product", bấm **Search by Vector Similarity**

**Câu nói:**
> "Toán tử `<->` tính khoảng cách cosine giữa query vector và embedding của từng sản phẩm. Kết quả là sản phẩm 'gần nghĩa' nhất. Trong hệ thống thật, embedding được sinh từ LLM như OpenAI Embeddings."

**Ý nghĩa PostgreSQL:**
- PostGIS: spatial query trong SQL chuẩn
- pgvector: vector search không cần Pinecone hay Weaviate

---

## Demo 4 — Query Optimizer (~2 phút)

**Thao tác:** Bấm **Optimizer** trên nav, vào `/demo/optimizer`

**Câu nói:**
> "Bảng `sales` có khoảng 100,000 dòng. Câu hỏi: PostgreSQL thực thi query như thế nào? EXPLAIN ANALYZE cho ta thấy chính xác."

**Thao tác:** Bấm **Drop Index** → bấm **Run Query** → bấm **Show EXPLAIN ANALYZE**

**Câu nói:**
> "Không có index: PostgreSQL phải quét toàn bộ bảng — Seq Scan. Với 100k dòng điều này chậm và tốn tài nguyên."

**Thao tác:** Bấm **Create Index** → bấm **Run Query** → bấm **Show EXPLAIN ANALYZE**

**Câu nói:**
> "Sau khi tạo index trên `(region, sale_date)`: PostgreSQL chuyển sang Index Scan hoặc Bitmap Index Scan. Execution time giảm đáng kể.
>
> EXPLAIN ANALYZE không chỉ hiển thị plan — nó chạy query thật và báo cáo actual rows, actual time từng node."

**Ý nghĩa PostgreSQL:**
- EXPLAIN ANALYZE: planner cost model và actual execution
- B-tree Index: loại bỏ full table scan cho equality + range filter

---

## Demo 5 — Enterprise Features (~2 phút)

**Thao tác:** Bấm **Enterprise** trên nav, vào `/demo/enterprise`

### CHECK Constraint

**Câu nói:**
> "Thường người ta validate dữ liệu ở application layer — nhưng application có thể bị bypass. PostgreSQL cho phép đặt luật ngay tại database."

**Thao tác:** Bấm **Try Insert Invalid Product**

**Câu nói:**
> "Database từ chối `price = -1000` vì CHECK constraint `price > 0`. Lỗi xảy ra ở tầng database — bất kể application nào cũng không thể insert dữ liệu xấu."

### Trigger + Audit Log

**Câu nói:**
> "Khi giá sản phẩm thay đổi, ai đã thay đổi? Lúc nào? Giá cũ là bao nhiêu? Trigger tự động ghi lại."

**Thao tác:** Để tên sản phẩm mặc định, bấm **Update Product Price**

**Câu nói:**
> "Trigger `trg_products_audit` chạy sau mỗi UPDATE, tự ghi `old_data` và `new_data` vào `audit_logs`. Không cần code gọi API audit riêng — database tự làm."

### View

**Thao tác:** Bấm **Load Revenue By Region**

**Câu nói:**
> "View `revenue_by_region` là một câu query phức tạp được lưu thành object trong database. Mọi người dùng đều query qua tên view — không cần biết SQL nội bộ, và khi logic thay đổi chỉ cần sửa view."

---

## Kết luận (~1 phút)

**Câu nói:**
> "PostgreSQL không chỉ là database quan hệ thông thường. Chúng ta vừa thấy:
>
> - JSONB + Array thay thế document store trong nhiều tình huống
> - ACID Transaction với row-level lock bảo vệ dữ liệu tài chính
> - PostGIS và pgvector mở rộng sang spatial và AI mà không cần hệ thống riêng
> - EXPLAIN ANALYZE giúp tối ưu hiệu năng một cách có căn cứ
> - Constraint, Trigger, View tạo nên tầng bảo vệ dữ liệu ngay tại database
>
> Một database, nhiều mô hình, đủ để xây hầu hết hệ thống thực tế."
