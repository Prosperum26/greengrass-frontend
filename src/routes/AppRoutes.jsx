// App Routes Configuration
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout, Header, Footer } from '../components/layout';

// Page Components (to be created)
const EventsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Sự kiện</h1></div>;
const EventDetailPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Chi tiết sự kiện</h1></div>;
const MapPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Bản đồ điểm xanh</h1></div>;
const LeaderboardPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Bảng xếp hạng</h1></div>;
const ForumPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Forum</h1></div>;
const ProfilePage = () => <div className="p-6"><h1 className="text-2xl font-bold">Hồ sơ</h1></div>;
const LoginPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Đăng nhập</h1></div>;
const RegisterPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Đăng ký</h1></div>;
const NotFoundPage = () => <div className="p-6"><h1 className="text-2xl font-bold">404 - Không tìm thấy</h1></div>;

// Import feature components (Replace placeholders later)
import { HomePage } from '../features/home';
// import EventsPage from '../pages/EventsPage';
// ...

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={
          <div className="min-h-screen bg-white flex flex-col">
            <Header />
            <main className="flex-1 overflow-x-hidden">
              <HomePage />
            </main>
            <Footer />
          </div>
        } />

        {/* Protected Routes - With MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
