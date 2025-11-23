# Style Guide - Marketer Suite

## 1. Naming Convention & CSS Class Naming (BEM)

- Tuân thủ chuẩn **BEM (Block-Element-Modifier)** cho mọi lớp CSS:
  - `.block {}`  
  - `.block__element {}`  
  - `.block--modifier {}`
- Class name ngắn gọn, rõ ràng, dễ hiểu: ví dụ `.btn`, `.btn--primary`, `.header__nav`
- Tránh sử dụng nested selectors sâu hoặc !important trong CSS
- Sử dụng SCSS/PostCSS hoặc CSS Modules cho modularity và maintainability

## 2. Comment Code

- Comment rõ ràng tại:
  - Các hàm/phương thức phức tạp hoặc có thuật toán không đơn giản  
  - API endpoint, xử lý business logic quan trọng  
  - Workarounds hoặc đoạn code đặc biệt cần chú ý
- Comment theo chuẩn **JSDoc** cho JS/TS, ví dụ:
/**

Tính tỷ lệ chuyển đổi

@param {number} conversions

@param {number} visitors

@returns {number}
*/
function getConversionRate(conversions, visitors) {
return conversions / visitors;
}

- Comment HTML chỉ dùng để đánh dấu các vùng lớn, cấu trúc
- Tránh comment thừa gây rối code

## 3. Thiết Kế Giao Diện

- Ưu tiên thiết kế **desktop-first** cho marketer (độ phân giải > 1280px)
- Hỗ trợ responsive tối thiểu cho tablet breakpoint (~768px)
- Sử dụng bảng màu & font chữ chuẩn theo brand guideline (Google Fonts hoặc tương tự)
- **Icon SVG:**  
  - Toàn bộ icon dưới dạng SVG chất lượng cao  
  - Áp dụng hệ thống **Flaticons** đồng bộ toàn trang
- Không dùng inline style trừ trường hợp bất khả kháng

## 4. Cấu Trúc & Phong Cách Code Frontend

- Component theo chức năng, tái sử dụng cao
- Logic tách riêng presentation, truyền data qua props
- Code rõ ràng, dễ đọc

## 5. Coding Practices Backend

- Strict TypeScript với kiểu rõ ràng
- Kiểm tra lỗi & validate dữ liệu đầy đủ
- Sử dụng async/await để quản lý bất đồng bộ
- Quản lý config & secrets qua biến môi trường, không hardcode

## 6. Accessibility

- Tuân thủ WCAG cơ bản: sử dụng tooltip, aria-label cho inputs, button
- Hỗ trợ người dùng có hạn chế tương tác

## 7. Performance & Testing

- Tối ưu SVG và resource, tránh ảnh raster lớn  
- Kiểm tra thủ công trước merge code, ưu tiên coverage các hàm backend  
- Dùng test checklist frontend đề phòng lỗi UI  

## 8. Quy Tắc Giao Tiếp Với Codebase

- Luôn review code nghiêm ngặt về readability, maintainability  
- Dùng git flow chuẩn, commit message theo conventional commits: feat, fix, docs, chore...

---

# Mục lục tài liệu liên quan  
- [README.md](./README.md)  
- [ARCHITECTURE.md](./ARCHITECTURE.md)  
- [AUTHENTICATION.md](./AUTHENTICATION.md)  
- [TURNSTILE_SETUP.md](./TURNSTILE_SETUP.md)  
- [PAYMENT_INTEGRATION.md](./PAYMENT_INTEGRATION.md)  
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)  
- [TOOLS_SPECIFICATION.md](./TOOLS_SPECIFICATION.md)  
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
- [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Mọi dev đều phải tuân thủ style guide này để đảm bảo chất lượng, hiệu quả phát triển và trải nghiệm người dùng tối ưu nhất.
