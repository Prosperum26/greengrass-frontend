// App Routes Configuration
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";

// Page Components (to be created)
import { EventList } from "../features/events";

const HomePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Trang chủ GreenGrass</h1>
  </div>
);
const EventsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Sự kiện</h1>
  </div>
);
// const EventDetailPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Chi tiết sự kiện</h1></div>;
const MapPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Bản đồ điểm xanh</h1>
  </div>
);
const LeaderboardPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Bảng xếp hạng</h1>
  </div>
);
const ForumPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Forum</h1>
  </div>
);
const ProfilePage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Hồ sơ</h1>
  </div>
);
const LoginPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Đăng nhập</h1>
  </div>
);
const RegisterPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Đăng ký</h1>
  </div>
);
const NotFoundPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">404 - Không tìm thấy</h1>
  </div>
);

// TODO: Import actual components when pages are created
// import HomePage from '../pages/HomePage';
// import EventsPage from '../pages/EventsPage';
// ...

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - No Layout */}
        <Route path="/events" element={<EventList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - With MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="events-old" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetail />} />
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
