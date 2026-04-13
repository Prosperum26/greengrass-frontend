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

// testing login
import React from 'react';
// Nhờ cô tiếp tân gọi LoginForm ra (Code siêu ngắn gọn)
import { LogInPage } from './features/auth';

const App = () => {
  return (
    // Thẻ div bao ngoài cùng
    <div className="w-full min-h-screen bg-gray-50">
      <LogInPage />

    </div>
  );
};

export default App;

// // test chuyển hướng trang log in
// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { LogInPage } from './features/auth';
// import { HomePage } from './features/testing(Binh)'; // Sửa lại đường dẫn nơi bạn vừa lưu HomePage

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="w-full min-h-screen bg-white">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LogInPage />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;