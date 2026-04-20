# Greengrass Frontend

## 🔗 Project Links
| Component | Repository Link |
| :--- | :--- |
| **Frontend** | [GitHub Repo](https://github.com/Prosperum26/frontendly-frontend) |
| **Backend** | [![Backend Repo](https://img.shields.io/badge/Repository-Backend-blue?style=for-the-badge&logo=github)](https://github.com/Prosperum26/frontendly-backend) |

<p align="center">
  <strong>Nền tảng Sự kiện Môi trường - Frontend</strong>
</p>

<p align="center">
  <a href="#tech-stack">Công nghệ</a> •
  <a href="#features">Tính năng</a> •
  <a href="#getting-started">Bắt đầu</a> •
  <a href="#deployment">Triển khai</a> •
  <a href="#contributing">Đóng góp</a>
</p>

---

## Tổng quan

Greengrass Frontend là ứng dụng React hiện đại cho nền tảng sự kiện môi trường. Ứng dụng mang đến trải nghiệm người dùng mượt mà để khám phá, đăng ký và tham gia các sự kiện thân thiện với môi trường cùng các tính năng gamification.

### Các tính năng chính

- **Khám phá sự kiện**: Duyệt và tìm kiếm sự kiện môi trường với tích hợp bản đồ
- **Quản lý sự kiện**: Tạo, đăng ký và quản lý việc tham gia sự kiện
- **Check-in QR**: Quét mã QR để xác nhận tham dự sự kiện
- **Gamification**: Tích điểm, nhận huy hiệu và theo dõi bảng xếp hạng
- **Tính năng real-time**: Thông báo và cập nhật trực tiếp
- **Thiết kế responsive**: Tối ưu cho mọi kích thước thiết bị

---

## Công nghệ sử dụng

| Danh mục        | Công nghệ               | Phiên bản |
| --------------- | ----------------------- | --------- |
| **Framework**   | React                   | ^19.2.4   |
| **Build Tool**  | Vite                    | ^8.0.4    |
| **Styling**     | Tailwind CSS            | ^3.4.19   |
| **Routing**     | React Router DOM        | ^7.14.0   |
| **HTTP Client** | Axios                   | ^1.15.0   |
| **Forms**       | React Hook Form         | ^7.72.1   |
| **Validation**  | Zod                     | ^4.3.6    |
| **Maps**        | Leaflet + React Leaflet | ^5.0.0    |
| **QR Scanner**  | @zxing/browser          | ^0.1.5    |
| **Linting**     | ESLint                  | ^9.39.4   |

---

## Cấu trúc dự án

```
greengrass-frontend/
├── public/                 # Tài nguyên tĩnh
├── src/
│   ├── api/               # API clients & interceptors
│   │   ├── client.js      # Cấu hình Axios
│   │   ├── auth.js        # API xác thực
│   │   ├── events.js      # API quản lý sự kiện
│   │   └── ...
│   ├── components/        # Component UI chia sẻ
│   │   ├── ui/           # Button, Card, Input, Modal...
│   │   ├── layout/       # Header, Sidebar, Footer
│   │   └── common/       # Toast, Loading, ErrorBoundary
│   ├── features/          # Module theo tính năng
│   │   ├── auth/         # Đăng nhập, Đăng ký, OAuth
│   │   ├── events/       # Danh sách, chi tiết, đăng ký sự kiện
│   │   ├── checkin/      # Quét QR, xác thực GPS
│   │   ├── gamification/ # Điểm, huy hiệu, bảng xếp hạng
│   │   ├── map/          # Bản đồ tương tác với marker
│   │   └── profile/      # Hồ sơ người dùng, lịch sử
│   ├── contexts/          # React contexts (Auth, Error)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Component cấp page
│   ├── routes/            # Định nghĩa route
│   ├── utils/             # Tiện ích & hằng số
│   └── styles/            # Style toàn cục
├── .github/workflows/      # CI/CD pipelines
├── docs/                   # Tài liệu
└── ui-prototype/           # Prototype thiết kế
```

### Nguyên tắc kiến trúc

- **Cấu trúc theo Feature**: Mỗi tính năng tự chứa với component, hook và API call riêng
- **Component Composition**: Component UI tái sử dụng với interface prop rõ ràng
- **Context API**: Quản lý state toàn cục cho auth và xử lý lỗi
- **Custom Hooks**: Logic đóng gói cho data fetching và form handling

---

## Bắt đầu

### Yêu cầu

- **Node.js** >= 18.0.0
- **Yarn** 1.x (khuyến nghị) hoặc npm

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd greengrass-frontend

# Cài đặt dependencies
yarn install

# Copy file môi trường
cp .env.example .env
```

### Phát triển

```bash
# Chạy dev server
yarn dev

# Chạy linter
yarn lint

# Build production
yarn build

# Xem trước build production
yarn preview
```

### Biến môi trường

Tạo file `.env` dựa trên `.env.example`:

```env
# Bắt buộc
VITE_API_URL=http://localhost:3000        # URL API backend
VITE_APP_NAME=GreenGrass                    # Tên ứng dụng

# Tùy chọn
VITE_API_TIMEOUT=10000                      # Timeout API (ms)
VITE_DEBUG=false                           # Chế độ debug
VITE_ANALYTICS_ENABLED=false               # Analytics
```

Xem `.env.example` để biết đầy đủ tùy chọn cấu hình.

---

## Triển khai

### Vercel (Khuyến nghị)

Dự án được tối ưu cho triển khai Vercel với cấu hình:

```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Các bước triển khai

1. **Kết nối Repository**: Import GitHub repo vào Vercel
2. **Cấu hình môi trường**: Thêm biến môi trường trong Vercel dashboard
3. **Triển khai**: Tự động deploy khi push lên `main`

#### Biến môi trường trên Vercel

Cấu hình trong Vercel Project Settings:

- `VITE_API_URL` - URL API production
- `VITE_APP_ENV` - Đặt thành `production`
- `VITE_ANALYTICS_ENABLED` - Bật analytics cho production

### Các nền tảng khác

Thư mục `dist/` chứa build tĩnh và có thể triển khai lên:

- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Bất kỳ static hosting nào

---

## CI/CD

### GitHub Actions Workflow

Dự án bao gồm pipeline CI/CD tự động (`.github/workflows/deploy.yml`):

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    steps:
      - Checkout code
      - Setup Node.js
      - Cài đặt dependencies
      - Chạy linter
      - Build ứng dụng
      - Triển khai lên Vercel
```

### Secrets cần thiết

Cấu hình trong GitHub Settings > Secrets:

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID

---

## Hướng dẫn phát triển

### Code Style

- **Linting**: ESLint với React Hooks và React Refresh plugins
- **Formatting**: Tuân theo style code hiện có (2 spaces, single quotes)
- **Imports**: Sử dụng barrel exports từ file `index.js` của feature

### Quy ước đặt tên

- **Components**: PascalCase (`EventCard.jsx`)
- **Hooks**: camelCase với tiền tố `use` (`useEvents.js`)
- **Utils**: camelCase (`formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE

### Git Workflow

Xem [CONTRIBUTING.md](./CONTRIBUTING.md) để biết hướng dẫn đóng góp chi tiết.

---

## Các lệnh có sẵn

| Lệnh           | Mô tả                            |
| -------------- | -------------------------------- |
| `yarn dev`     | Khởi động dev server (port 5173) |
| `yarn build`   | Build cho production             |
| `yarn preview` | Xem trước build production local |
| `yarn lint`    | Chạy ESLint                      |

---

## Xử lý sự cố

### Các vấn đề thường gặp

**'vite' không được nhận diện**

```bash
yarn install
yarn dev
```

**Port 5173 đang được sử dụng**

```bash
yarn dev -- --port 3000
```

**Vấn đề về dependencies**

```bash
# Windows
Remove-Item -Recurse -Force node_modules
Remove-Item yarn.lock
yarn install

# macOS/Linux
rm -rf node_modules yarn.lock
yarn install
```

---

## Giấy phép

MIT License - xem file [LICENSE](./LICENSE) để biết chi tiết.

---

<p align="center">
  Xây dựng với 💚 cho một hành tinh xanh
</p>
