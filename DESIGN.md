# Tài liệu Design System: Hệ sinh thái Editorial

## 1. Typography

Chúng tôi sử dụng bộ font hiện đại cho sự uy quyền và khả năng đọc dễ dàng.

- **Tiêu đề & Headlines:** Plus Jakarta Sans
  - **Cách dùng:** Dùng cho các câu lớn, tiêu đề section. Không căn giữa; dùng layout "ragged" căn trái để giữ cảm giác editorial.
- **Nội dung & Labels:** Manrope
  - **Cách dùng:** Font chính cho các báo cáo môi trường dài. Labels dùng cho metadata (ngày tháng, tags), luôn viết hoa với +0.05em tracking cho aesthetic "tagged".

## 2. Bảng màu

Bảng màu lấy cảm hứng từ chuyển đổi tự nhiên của Trái Đất, sử dụng màu xanh rừng sâu và cam phai để thúc đẩy hành động. Tránh đen tuyền (`#0000`); dùng màu `On-Surface` thay thế.

- **Primary (Hành động):** `#234612`
- **Primary Container:** `#3A5E27`
  - _Cách dùng:_ Các trạng thái quan trọng và khoảnh khắc thương hiệu chính.
- **Secondary (Tăng trưởng):** `#57641E`
  - _Cách dùng:_ Chỉ báo tiến độ và tương tác tinh tế.
- **Tertiary (Khẩn cấp):** `#F75A0D`
  - _Cách dùng:_ Dành riêng cho "Tham gia sự kiện" hoặc các CTA quan trọng.
- **Surface/Nền:** `#FFF8F5`
  - _Cách dùng:_ Màu off-white ấm như giấy, giúp giảm mỏi mắt.
- **On-Surface (Chữ):** `#211A14`
  - _Cách dùng:_ Dùng thay đen tuyền cho cảm giác mềm mại, tự nhiên.

## 3. Kiến trúc Surface & Elevation

### Quy tắc "Không viền"

Không dùng borders 1px solid để phân chia nội dung. Ranh giới phải được xác định bằng chuyển đổi màu nền thay vì "nhiễu" của đường nét.

### Hệ thống cấp bậc Surface & Nesting

Xem UI như các lớp giấy tái chế mỏng:

- **Lớp Base:** Surface (`#FFF8F5` - Cái bàn)
- **Section nội dung:** Surface Container Low (Trang nhật ký)
- **Card tương tác:** Surface Container Highest (Post-it notes hoặc bài cắt báo được highlight)

### Bóng đổ Ambient

Khi cần hiệu ứng nổi (ví dụ: nút Action chính), dùng bóng đổ ambient mềm thay vì drop shadow cứng:

- **Blur:** 32px đến 48px
- **Opacity:** 4% - 8%
- **Màu:** `#211A14` (On-surface tint)
