// // GreenGrass App - Entry point
// import { AppRoutes } from './routes';
// import { ErrorBoundary } from './components/common';
// import { ChatWidget } from './features/chatbot';
// import HelloWorld from './components/common/HelloWorld';

// function App() {
//   return (
//     <ErrorBoundary>
//       <AppRoutes />
//       <ChatWidget />
//       <HelloWorld />
//     </ErrorBoundary>
//   );
// }

// export default App

// // testing login
// import React from 'react';
// // Nhờ cô tiếp tân gọi LoginForm ra (Code siêu ngắn gọn)
// import { ForgotPasswordPage } from './features/auth';

// const App = () => {
//   return (
//     // Thẻ div bao ngoài cùng
//     <div className="w-full min-h-screen bg-gray-50">
//       <ForgotPasswordPage />

//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import 3 trang Auth của bạn vào (Nhớ kiểm tra lại đường dẫn cho chuẩn nhé)
import { LoginForm, RegisterPage, ForgotPasswordPage, LogInPage } from './features/auth';
import { HomePage } from './features/testing(Binh)';

const App = () => {
  return (
    // Bắt buộc phải có BrowserRouter bọc ngoài cùng
    <BrowserRouter>
      <div className="w-full min-h-screen bg-[#fafafa]">

        <Routes>
          {/* Trang chủ */}
          <Route path="/" element={<HomePage />} />

          {/* 3 Trang Authentication */}
          <Route path="/login" element={<LogInPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Thêm Route cho trang Quên mật khẩu vào đây */}
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Gõ sai link thì tự đẩy về Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
};

export default App;