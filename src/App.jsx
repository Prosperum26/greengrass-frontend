// // code này chạy với file cũ của t mới được

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// // Import các trang Auth
// import { LoginForm, RegisterPage, ForgotPasswordPage } from './features/auth'; 
// import HomePage from './features/testing(Binh)/HomePage';

// // Import trang Profile bạn vừa làm (nhớ trỏ đúng đường dẫn nha)
// import UserProfilePage from './features/profile/components/UserProfilePage'; 

// const App = () => {
//   return (
//     <BrowserRouter>
//       <div className="w-full min-h-screen bg-[#fafafa]">
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginForm />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/forgot-password" element={<ForgotPasswordPage />} />

//           {/* ĐÂY RỒI! Khai báo đường dẫn cho Profile */}
//           {/* 1. Link để xem profile người khác (có cái mã uid ở đuôi) */}
//           <Route path="/profile/:uid" element={<UserProfilePage />} />

//           {/* 2. Link để xem profile của chính mình */}
//           <Route path="/profile/me" element={<UserProfilePage />} />

//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// };

// export default App;

import React from 'react';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return <AppRoutes />;
};

export default App;