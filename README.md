# Marketer Suite

**Marketer Suite** là bộ công cụ marketing serverless, privacy-first dành cho full-stack marketers, với trọng tâm SEO và Content.

---

## 🚀 Tính năng chính

### SEO Tools
- **Keyword Research**: phân tích từ khóa nâng cao với mật độ, keywords liên quan, điểm đối thủ cạnh tranh  
- **On-Page SEO Analyzer**: kiểm tra thẻ meta, cấu trúc header, đánh giá schema markup  
- **Backlink Profile Analyzer**: import dữ liệu backlink, phát hiện link độc hại  

### Content Tools
- **Content Brief Generator**: đề xuất outline dựa trên SERP và NLP  
- **Content Optimizer Dashboard**: phản hồi realtime về chất lượng bài viết và từ khóa  
- **Content Audit Tracker**: theo dõi hiệu suất bài và gợi ý cập nhật lại nội dung  

---

## 🏗️ Kiến trúc hệ thống

- **Frontend**: Vanilla JS/HTML/CSS trên Cloudflare Pages, tối ưu cho marketers  
- **Backend**: Cloudflare Workers làm API, xử lý xác thực, business logic  
- **Database**: D1 (SQLite) lưu trữ user, OTP, usage, payment  
- **Cache**: KV Storage cho JWT, session  
- **Bot Protection**: Cloudflare Turnstile  
- **Thanh toán**: CASSO API - webhook nhận thanh toán tự động  

---

## ⚙️ Hướng dẫn phát triển

### Thiết lập môi trường

1. Cài đặt Node.js (>=18), Wranger CLI  
2. Clone repo và cài dependencies Workers + Frontend  
3. Thiết lập biến môi trường theo file [.env.example]  
4. Khởi tạo và áp dụng migration trên D1 local  
5. Chạy `wrangler dev` cho workers và `wrangler pages dev ./public` cho frontend

### Bypass Turnstile local dev  
Xem chi tiết [docs/TURNSTILE_SETUP.md](docs/TURNSTILE_SETUP.md)

### Chạy migration DB  
Xem [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)

# Marketer Suite

---

## 🎨 Thiết kế & Style Guide

- **Icon sử dụng toàn bộ ở định dạng SVG**, đảm bảo hiển thị sắc nét và tối ưu tải trang.  
- Áp dụng hệ thống **Flaticons** thống nhất trên toàn bộ trang web để giữ đồng bộ phong cách và hiệu quả thiết kế.  
- Thiết kế giao diện theo phong cách **tối giản (minimalistic design)**, tập trung trải nghiệm người dùng, đặc biệt tối ưu trên **desktop web** (do người dùng chính là marketers).  

---

### Quy chuẩn viết code & cấu trúc frontend/backend

- Áp dụng chuẩn **BEM (Block-Element-Modifier)** cho class CSS để tăng tính modular, dễ đọc, dễ bảo trì.  
- Frontend viết bằng vanilla JS với CSS được tổ chức rõ ràng, component tái sử dụng cao, tách biệt logic với giao diện.  
- Backend code phải dùng Strict TypeScript, handling lỗi, validate input/output đầy đủ.  
- Comment code rõ ràng, dùng chuẩn JSDoc cho các hàm, API, đoạn code phức tạp.  
- Quy tắc phát triển bắt buộc **đọc kỹ toàn bộ tài liệu trong thư mục docs trước khi bắt đầu code** để hiểu rõ cấu trúc và quy trình phát triển.  

---

### Hướng đến chất lượng và đồng bộ

- Ưu tiên thiết kế responsive desktop-first (độ phân giải phổ biến của marketer >1280px).  
- Thực thi tất cả icon dưới dạng SVG inline hoặc sprite sheet từ Flaticons.  
- Luôn tuân thủ style guide để đảm bảo sản phẩm cuối cùng có hiệu suất, dễ quản lý, và đáp ứng tốt nhu cầu người dùng chính.  

---

## 🔐 Authentication

- Email OTP + Turnstile  
- JWT bảo mật phiên làm việc  
- Xác thực API requests  
- Chi tiết trong [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)

---

## 💳 Tích hợp thanh toán

- Tự động xác nhận chuyển khoản qua CASSO  
- Quản lý tier Free / Pro với giới hạn sử dụng  
- Hướng dẫn và mã mẫu trong [docs/PAYMENT_INTEGRATION.md](docs/PAYMENT_INTEGRATION.md)

---

## 📚 Tài liệu tham khảo chính

- [Kiến trúc tổng quan](docs/ARCHITECTURE.md)  
- [Quy trình xác thực người dùng](docs/AUTHENTICATION.md)  
- [Hướng dẫn Turnstile và bypass local](docs/TURNSTILE_SETUP.md)  
- [Chi tiết database schema & migrations](docs/DATABASE_SCHEMA.md)  
- [Specification các tools SEO & Content](docs/TOOLS_SPECIFICATION.md)  
- [API documentation](docs/API_DOCUMENTATION.md)  
- [Hướng dẫn deploy toàn hệ thống](docs/DEPLOYMENT.md)

---

## 📦 Triển khai

- Đẩy backend workers: \`wrangler publish\`  
- Đẩy frontend site: \`wrangler pages publish ./public\`  
- Quản lý biến môi trường (secrets) qua \`wrangler secret put\`

---

## 🤝 Chia sẻ & Đóng góp

- Tuân thủ [CONTRIBUTING.md](.github/CONTRIBUTING.md)  
- Mọi issue, pull request vui lòng theo chuẩn mẫu  
- Liên hệ qua channel Slack hoặc email support@marketer-suite.com

---

## 📄 License

MIT License

---

Cảm ơn bạn đã sử dụng Marketer Suite!
