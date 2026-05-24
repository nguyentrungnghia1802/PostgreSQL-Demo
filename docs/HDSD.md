# PostgreSQL Feature Showcase — Hướng dẫn sử dụng

## 1. Yêu cầu hệ thống
- **Node.js** >= 18
- **npm** >= 9
- **Docker** & **docker-compose**
- **Windows** (nếu dùng đường dẫn có ký tự đặc biệt)

## 2. Khởi động database
```bash
cd database
# Chạy lần đầu hoặc khi cần reset database
# (Tạo container PostgreSQL 16 + PostGIS + pgvector)
docker-compose up -d
```
- Database sẽ chạy ở: `localhost:5433`
- Thông tin kết nối:
  - DB: `pg_feature_showcase`
  - User: `postgres`
  - Pass: `postgres`

## 3. Chạy ứng dụng demo
```bash
cd "d:_Study__This Season\DB System\#Project"
npm install
npm run dev
```
- Truy cập: [http://localhost:4000](http://localhost:4000)
- **Chỉ cần chạy 1 lệnh duy nhất:** `npm run dev` (tự động build frontend, backend serve cả API và giao diện)

## 4. Các lệnh hữu ích khác
| Lệnh | Mục đích |
|------|----------|
| `npm run dev` | Build frontend, start backend (chạy toàn bộ demo) |
| `npm run start` | Start backend (nếu đã build frontend) |
| `npm run dev:backend` | Chạy riêng backend (API) |
| `npm run dev:frontend` | Chạy riêng frontend (Vite dev, port 5173) |
| `npm run build:frontend` | Build frontend vào dist/ |
| `npm run build:backend` | Build backend (TypeScript) |
| `npm run check` | Build cả hai để kiểm tra lỗi |

## 5. Kiểm tra hoạt động
- **API health:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **DB health:** [http://localhost:4000/api/health/db](http://localhost:4000/api/health/db)
- **Giao diện:** [http://localhost:4000](http://localhost:4000)

## 6. Demo tính năng
- **Trang chủ:** Tổng quan, kiểm tra kết nối
- **Flexible Data:** JSONB, Array, GIN Index
- **Transaction:** ACID, rollback, chuyển khoản
- **Extensions:** PostGIS (tìm cửa hàng gần nhất), pgvector (semantic search)
- **Optimizer:** EXPLAIN ANALYZE, Index Scan/Seq Scan
- **Enterprise:** CHECK, Trigger, Audit Log, VIEW

## 7. Lưu ý
- Nếu đường dẫn chứa ký tự đặc biệt (`#`), chỉ dùng lệnh `npm run dev` ở thư mục gốc, không chạy trực tiếp Vite dev server.
- Nếu port 4000 bị chiếm, hãy tắt tiến trình cũ rồi chạy lại.
- Database cần chạy trước khi start backend.

---
**Mọi thắc mắc, xem README.md hoặc liên hệ tác giả.**
