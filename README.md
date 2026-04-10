# Greengrass Frontend

Dự án frontend của Greengrass - Ứng dụng web xây dựng bằng React và Vite.

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Bắt đầu](#bắt-đầu)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tailwind CSS](#tailwind-css)
- [VS Code Extensions](#vs-code-extensions)
- [Lưu ý khi phát triển](#lưu-ý-khi-phát-triển)
- [Xử lý lỗi](#xử-lý-lỗi)

---

## 🌟 Giới thiệu

Dự án Greengrass Frontend là giao diện người dùng của ứng dụng Greengrass, được xây dựng với mục tiêu:

- Giao diện hiện đại, responsive
- Hiệu suất cao với Vite
- Dễ dàng bảo trì và mở rộng

---

## 🛠 Công nghệ sử dụng

| Công nghệ    | Phiên bản | Mô tả                   |
| ------------ | --------- | ----------------------- |
| React        | ^19.2.4   | Thư viện UI             |
| Vite         | ^8.0.4    | Build tool & dev server |
| Tailwind CSS | ^3.4.19   | CSS framework           |
| Yarn         | 1.x       | Package manager         |
| ESLint       | ^9.39.4   | Linting                 |

---

## ⚙️ Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy của bạn đã cài đặt:

- **Node.js** >= 18.0.0
- **Yarn** v1.x

Kiểm tra phiên bản đã cài đặt:

```bash
node -v
yarn -v
```

---

## 🚀 Bắt đầu

### 1. Clone repository

```bash
git clone <repository-url>
cd greengrass-frontend
```

### 2. Cài đặt dependencies

```bash
yarn install
```

> **Lưu ý:** Luôn sử dụng `yarn` thay vì `npm` hoặc `pnpm` để tránh xung đột dependencies.

### 3. Kiểm tra Node.js version

```bash
node -v  # Yêu cầu >= 18.0.0
```

### 4. Chạy dev server

```bash
yarn dev
```

### 5. Tạo file môi trường (.env)

```bash
cp .env.example .env
```

Chỉnh sửa `.env` với API URL của backend:

```env
VITE_API_URL=http://localhost:3000/api
```

### 6. Mở trình duyệt

Truy cập: http://localhost:5173

---

## 📦 Dependencies chính

Dự án sử dụng các thư viện sau:

| Package          | Version | Mục đích     |
| ---------------- | ------- | ------------ |
| react            | ^19.2.4 | Core library |
| react-router-dom | ^7.x    | Routing      |
| axios            | ^1.x    | HTTP client  |
| tailwindcss      | ^3.4.19 | Styling      |
| vite             | ^8.0.4  | Build tool   |

Cài thêm dependencies nếu thiếu:

```bash
yarn add react-router-dom axios
```

---

## 🔧 Troubleshooting

### Lỗi `'vite' is not recognized`

Chạy lại `yarn install`:

```bash
yarn install
yarn dev
```

### Lỗi `Failed to resolve import "react-router-dom"`

Cài thiếu dependency, chạy:

```bash
yarn add react-router-dom axios
```

### Lỗi `Cannot find module 'axios'`

```bash
yarn add axios
```

### Xóa cache và cài lại (nuclear option)

**Windows:**

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item yarn.lock
yarn install
yarn dev
```

**macOS/Linux:**

```bash
rm -rf node_modules yarn.lock
yarn install
yarn dev
```

---

## 📁 Cấu trúc dự án

Dự án sử dụng **Feature-Based Architecture** - code được tổ chức theo tính năng thay vì theo loại file:

```
greengrass-frontend/
├── public/                 # Static assets (favicon, icons, images)
├── src/
│   ├── api/               # API clients & interceptors
│   │   ├── client.js      # Axios instance
│   │   ├── auth.js        # Auth APIs
│   │   ├── events.js      # Event APIs
│   │   ├── users.js       # User APIs
│   │   ├── checkin.js     # Check-in APIs
│   │   └── index.js       # Barrel export
│   │
│   ├── components/        # Shared UI components
│   │   ├── ui/           # Button, Card, Input, Modal, Badge...
│   │   ├── layout/       # Header, Sidebar, Footer, MainLayout
│   │   ├── common/       # Loading, ErrorBoundary, EmptyState
│   │   └── index.js      # Barrel export
│   │
│   ├── features/          # Feature modules (mỗi feature độc lập)
│   │   ├── auth/         # Đăng nhập, đăng ký, Google Auth
│   │   ├── events/       # Quản lý sự kiện, đăng ký
│   │   ├── map/          # Bản đồ điểm xanh, GPS
│   │   ├── checkin/      # QR scanner, GPS validation
│   │   ├── gamification/ # Điểm, huy hiệu, bảng xếp hạng
│   │   ├── profile/      # Hồ sơ cá nhân, lịch sử
│   │   ├── forum/        # Forum cho ban tổ chức
│   │   ├── chatbot/      # Trợ lý ảo
│   │   └── index.js      # Barrel export
│   │
│   ├── hooks/            # Shared custom hooks
│   ├── stores/           # State management (Zustand/Redux)
│   ├── utils/            # Constants, helpers, validators
│   ├── routes/           # Route definitions
│   ├── styles/           # Global styles extension
│   ├── assets/           # Images, fonts
│   ├── App.jsx           # Root component
│   ├── App.css           # Root styles
│   ├── index.css         # Tailwind + global CSS
│   └── main.jsx          # Entry point
│
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind config
├── vite.config.js        # Vite config
├── eslint.config.js      # ESLint config
├── package.json          # Dependencies
└── yarn.lock             # Lockfile
```

### Nguyên tắc tổ chức Feature

Mỗi feature trong `src/features/` tự quản lý:

- `components/` - Components riêng của feature
- `hooks/` - Custom hooks riêng của feature
- `stores/` - State management riêng (nếu cần)
- `index.js` - Public API của feature (chỉ export những gì cần thiết)

Ví dụ import:

```javascript
// Import từ feature
import { EventCard, useEvents } from "../features/events";
import { QRScanner, CheckInButton } from "../features/checkin";

// Import shared components
import { Button, Card, Modal } from "../components";
import { useLocalStorage } from "../hooks";
```

---

## 🚀 Các tính năng chính (Features)

### ✅ Đã có placeholder files

| Feature          | Mô tả                                   | Files chính                                                                                   |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Auth**         | Đăng nhập, đăng ký, Google OAuth        | `features/auth/components/LoginForm.jsx`, `RegisterForm.jsx`, `hooks/useAuth.js`              |
| **Events**       | Danh sách sự kiện, đăng ký, chi tiết    | `features/events/components/EventCard.jsx`, `EventList.jsx`, `hooks/useEvents.js`             |
| **Map**          | Bản đồ điểm xanh, định vị GPS           | `features/map/components/GreenMap.jsx`, `hooks/useGeolocation.js`                             |
| **Check-in**     | QR scanner, GPS validation, upload ảnh  | `features/checkin/components/QRScanner.jsx`, `CheckInButton.jsx`, `hooks/useCheckIn.js`       |
| **Gamification** | Điểm rèn luyện, huy hiệu, bảng xếp hạng | `features/gamification/components/PointsDisplay.jsx`, `Leaderboard.jsx`, `hooks/usePoints.js` |
| **Profile**      | Hồ sơ cá nhân, lịch sử tham gia         | `features/profile/components/ProfileHeader.jsx`                                               |
| **Forum**        | Forum cho ban tổ chức                   | `features/forum/components/ForumList.jsx`                                                     |
| **Chatbot**      | Trợ lý ảo gợi ý sự kiện                 | `features/chatbot/components/ChatWidget.jsx`                                                  |

### 🔧 Công nghệ tích hợp

- **QR Code**: `jsQR` hoặc `@zxing/library` (cần cài đặt thêm)
- **Maps**: Leaflet.js với OpenStreetMap (cần cài đặt: `leaflet`, `react-leaflet`)
- **Real-time**: Socket.IO cho check-in live (cần cài đặt: `socket.io-client`)
- **Camera**: MediaDevices API cho QR scanner và upload ảnh minh chứng

---

## 🎨 Tailwind CSS

Tailwind CSS v3 đã được cấu hình sẵn trong dự án.

### Các file cấu hình:

- `tailwind.config.js` - Định nghĩa theme, colors, fonts
- `postcss.config.js` - Tích hợp Tailwind với PostCSS
- `src/index.css` - Import Tailwind directives

### Sử dụng trong CSS:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> **Lưu ý:** IDE có thể báo warning "Unknown at rule @tailwind" nhưng đây là bình thường - Tailwind sẽ xử lý các directive này khi build.

---

## 🧩 VS Code Extensions khuyến nghị

Cài đặt các extension sau để có trải nghiệm phát triển tốt nhất:

| Extension                                  | Mục đích                      |
| ------------------------------------------ | ----------------------------- |
| **ES7+ React/Redux/React-Native snippets** | Snippets React                |
| **Tailwind CSS IntelliSense**              | Autocomplete Tailwind classes |
| **Prettier - Code: formatter**             | Format code tự động           |
| **ESLint**                                 | Linting và fix lỗi            |
| **Auto Rename Tag**                        | Tự động đổi tên tag đóng/mở   |
| **Path Intellisense**                      | Autocomplete đường dẫn file   |

---

## 📝 Lưu ý khi phát triển

### Quy tắc chung

- **Luôn dùng Yarn**: Không mix `npm` với `yarn` trong cùng dự án
- **Naming convention**: PascalCase cho components, camelCase cho functions/hooks
- **CSS**: Ưu tiên dùng Tailwind classes thay vì viết CSS thuần

### Kiến trúc Feature-Based

1. **Mỗi feature là một module độc lập** trong `src/features/{feature-name}/`
   - Chứa components, hooks, stores riêng của feature đó
   - Export qua `index.js` để giấu implementation details

2. **Shared components** trong `src/components/`
   - Chỉ chứa UI components chung, không chứa business logic
   - Phải reusable giữa các features

3. **API Layer** trong `src/api/`
   - Mỗi domain có file riêng (auth.js, events.js, users.js...)
   - Dùng `client.js` để cấu hình axios interceptors (token, error handling)

4. **Import pattern**:

   ```javascript
   // Import từ feature → dùng barrel export
   import { EventCard, useEvents } from "../features/events";

   // Import shared → từ components, hooks, utils
   import { Button, Card } from "../components";
   import { formatDate } from "../utils";
   ```

### Thêm feature mới

```bash
# Tạo cấu trúc cho feature mới
mkdir -p src/features/{feature-name}/components
mkdir -p src/features/{feature-name}/hooks

# Tạo files
# - components/FeatureComponent.jsx
# - hooks/useFeature.js
# - index.js (barrel export)
```

### Ví dụ tạo Feature mới

```javascript
// src/features/myfeature/index.js
export { default as MyComponent } from "./components/MyComponent";
export { default as useMyFeature } from "./hooks/useMyFeature";

// Import ở file khác
import { MyComponent, useMyFeature } from "../features/myfeature";
```

---

## 🔧 Xử lý lỗi

### Dependencies bị lỗi hoặc cần reset

**macOS/Linux:**

```bash
rm -rf node_modules yarn.lock
yarn install
```

**Windows PowerShell:**

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item yarn.lock
yarn install
```

### Port 5173 đang được sử dụng

```bash
yarn dev -- --port 3000
```

### Lỗi khi cài đặt packages

Đảm bảo Node.js >= 18:

```bash
node -v
```

Nếu cần đổi version Node.js, dùng **nvm** (Windows/Mac/Linux):

```bash
nvm install 18
nvm use 18
```

---

## 📜 Scripts có sẵn

| Script  | Lệnh           | Mô tả                    |
| ------- | -------------- | ------------------------ |
| Dev     | `yarn dev`     | Chạy dev server          |
| Build   | `yarn build`   | Build production         |
| Preview | `yarn preview` | Preview production build |
| Lint    | `yarn lint`    | Kiểm tra code với ESLint |

---

## 📄 License

Private - Greengrass Project
