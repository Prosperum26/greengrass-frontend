# Đóng góp cho Greengrass Frontend

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Greengrass! Tài liệu này cung cấp hướng dẫn và best practices để đóng góp cho dự án.

## Mục lục

- [Bắt đầu](#bắt-đầu)
- [Quy trình phát triển](#quy-trình-phát-triển)
- [Đặt tên branch](#đặt-tên-branch)
- [Commit messages](#commit-messages)
- [Code style](#code-style)
- [Quy trình Pull Request](#quy-trình-pull-request)
- [Kiểm thử](#kiểm-thử)
- [Câu hỏi?](#câu-hỏi)

---

## Bắt đầu

### Fork & Clone

1. Fork repository trên GitHub
2. Clone fork của bạn về local:

```bash
git clone https://github.com/YOUR_USERNAME/greengrass-frontend.git
cd greengrass-frontend
```

3. Thêm remote upstream:

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/greengrass-frontend.git
```

4. Cài đặt dependencies:

```bash
yarn install
```

5. Copy file môi trường:

```bash
cp .env.example .env
```

6. Khởi động dev server:

```bash
yarn dev
```

---

## Quy trình phát triển

### 1. Đồng bộ với Upstream

Trước khi bắt đầu, đảm bảo fork của bạn đã cập nhật:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Tạo Branch

Tạo branch mới cho tính năng hoặc fix của bạn:

```bash
git checkout -b feature/your-feature-name
```

### 3. Thực hiện thay đổi

- Viết code sạch, dễ bảo trì
- Tuân theo code style của dự án
- Thêm comment khi cần thiết
- Cập nhật tài liệu nếu cần

### 4. Commit thay đổi

Commit với message rõ ràng, mô tả (xem [Commit Messages](#commit-messages)):

```bash
git add .
git commit -m "feat: add user profile page"
```

### 5. Push & tạo PR

```bash
git push origin feature/your-feature-name
```

Sau đó tạo Pull Request trên GitHub.

---

## Đặt tên Branch

Sử dụng các tiền tố sau cho tên branch:

| Tiền tố     | Mục đích           | Ví dụ                |
| ----------- | ------------------ | -------------------- |
| `feature/`  | Tính năng mới      | `feature/qr-scanner` |
| `fix/`      | Sửa lỗi            | `fix/login-redirect` |
| `chore/`    | Công việc bảo trì  | `chore/update-deps`  |
| `docs/`     | Tài liệu           | `docs/api-guide`     |
| `refactor/` | Tái cấu trúc code  | `refactor/auth-hook` |
| `test/`     | Thêm/cập nhật test | `test/event-form`    |

---

## Commit Messages

Chúng tôi tuân theo chuẩn [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Các loại

| Loại       | Mô tả                                    |
| ---------- | ---------------------------------------- |
| `feat`     | Tính năng mới                            |
| `fix`      | Sửa lỗi                                  |
| `docs`     | Thay đổi tài liệu                        |
| `style`    | Style code (formatting, không đổi logic) |
| `refactor` | Tái cấu trúc code                        |
| `test`     | Thêm/cập nhật test                       |
| `chore`    | Build process, dependencies, v.v.        |

### Ví dụ

```bash
feat(events): add event registration form

fix(auth): resolve token refresh loop
docs(readme): update deployment instructions
style(components): format with prettier
refactor(api): consolidate error handling
chore(deps): update axios to v1.6
test(auth): add login form tests
```

---

## Code Style

### Quy tắc chung

- Dùng **2 spaces** cho indentation
- Dùng **single quotes** cho chuỗi
- Thêm **trailing commas** trong objects/arrays nhiều dòng
- Độ dài dòng tối đa: **100 ký tự**

### React Components

```jsx
// Đặt tên component: PascalCase
function EventCard({ event, onRegister }) {
  // Hooks đặt ở đầu
  const [loading, setLoading] = useState(false);

  // Handlers
  const handleClick = () => {
    onRegister(event.id);
  };

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <Button onClick={handleClick} disabled={loading}>
        Register
      </Button>
    </div>
  );
}

export default EventCard;
```

### Custom Hooks

```jsx
// Đặt tên hook: camelCase với tiền tố 'use'
function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    // ...
    setLoading(false);
  };

  return { events, loading, refetch: fetchEvents };
}
```

### Thứ tự Imports

```jsx
// 1. React & thư viện
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 2. Absolute imports (features)
import { useAuth } from "../features/auth";
import { EventCard } from "../features/events";

// 3. Relative imports (cùng thư mục)
import { formatDate } from "./utils";
import styles from "./styles.module.css";
```

### Tailwind CSS

- Ưu tiên Tailwind classes hơn custom CSS
- Nhóm các classes liên quan logic
- Dùng màu custom từ `tailwind.config.js`

```jsx
// Tốt
<div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">

// Tránh
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
```

---

## Quy trình Pull Request

### Trước khi gửi

- [ ] Branch đã đồng bộ với `main`
- [ ] Tất cả test pass (`yarn test`)
- [ ] Linting pass (`yarn lint`)
- [ ] Build thành công (`yarn build`)
- [ ] Code đã được format đúng
- [ ] Không có lỗi hoặc cảnh báo console
- [ ] Thay đổi đã được ghi tài liệu

### Template mô tả PR

```markdown
## Mô tả

Mô tả ngắn gọn về thay đổi

## Loại thay đổi

- [ ] Sửa lỗi
- [ ] Tính năng mới
- [ ] Breaking change
- [ ] Cập nhật tài liệu

## Checklist

- [ ] Code tuân theo hướng dẫn style
- [ ] Đã tự review code
- [ ] Đã thêm comment cho logic phức tạp
- [ ] Tài liệu đã cập nhật
- [ ] Không có cảnh báo mới

## Screenshots (nếu có)

Thêm ảnh chụp màn hình cho thay đổi UI

## Vấn đề liên quan

Fixes #123
```

### Quy trình review

1. Các kiểm tra tự động phải pass (CI/CD)
2. Cần ít nhất một approval từ code review
3. Xử lý tất cả các comment review
4. Maintainers sẽ merge khi sẵn sàng

---

## Kiểm thử

### Chạy test

```bash
# Chạy tất cả test
yarn test

# Chạy với coverage
yarn test:coverage

# Watch mode
yarn test:watch
```

### Hướng dẫn viết test

- Viết test cho tính năng mới
- Cập nhật test khi sửa code hiện có
- Hướng đến test coverage có ý nghĩa

---

## Câu hỏi?

- **Câu hỏi chung**: Mở [Discussion](https://github.com/ORIGINAL_OWNER/greengrass-frontend/discussions)
- **Báo cáo lỗi**: Tạo [Issue](https://github.com/ORIGINAL_OWNER/greengrass-frontend/issues)
- **Vấn đề bảo mật**: Email security@greengrass.vn

---

## Giấy phép

Bằng việc đóng góp, bạn đồng ý rằng các đóng góp của mình sẽ được cấp phép theo MIT License.

---

Cảm ơn bạn đã đóng góp cho Greengrass! 🌱
