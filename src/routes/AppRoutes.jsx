import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/layout';
import { EventList } from '../features/events';
import EventDetail from '../features/events/components/EventDetail';
import { HomePage } from '../features/home';
import MapExplorerPage from '../features/map/components/MapExplorerPage';
import Leaderboard from '../features/gamification/components/Leaderboard';
import { ForgotPasswordPage, LogInPage, RegisterPage } from '../features/auth';
import { OrgProfilePage, UserProfilePage } from '../features/profile';
import { CheckInPage } from '../features/checkin';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import OrganizerRequestsPage from '../pages/Admin/OrganizerRequestsPage';

const ProfilePage = () => {
  const role = localStorage.getItem('role');
  if (role === 'ORGANIZER') {
    return <Navigate to="/organizer/profile" replace />;
  }
  return <UserProfilePage />;
};

const MapPage = () => (
  <div className="px-6 py-10">
    <div className="mx-auto max-w-7xl">
      <MapExplorerPage />
    </div>
  </div>
);

const LeaderboardPage = () => (
  <div className="px-6 py-10">
    <Leaderboard />
  </div>
);

const NotFoundPage = () => <div className="p-8 text-ink">404 - Not found</div>;

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell contentClassName="overflow-x-hidden"><HomePage /></AppShell>} />
        <Route path="/events" element={<AppShell><EventList /></AppShell>} />
        <Route path="/events/:id" element={<AppShell><EventDetail /></AppShell>} />
        <Route path="/login" element={<AppShell><LogInPage /></AppShell>} />
        <Route path="/register" element={<AppShell><RegisterPage /></AppShell>} />
        <Route path="/forgot-password" element={<AppShell><ForgotPasswordPage /></AppShell>} />
        <Route path="/profile" element={<AppShell><PrivateRoute><ProfilePage /></PrivateRoute></AppShell>} />
        <Route
          path="/organizer/profile"
          element={
            <AppShell>
              <PrivateRoute>
                <RoleRoute allowedRoles={['ORGANIZER']} redirectTo="/profile">
                  <OrgProfilePage />
                </RoleRoute>
              </PrivateRoute>
            </AppShell>
          }
        />
        <Route path="/map" element={<AppShell contentClassName="overflow-hidden"><MapPage /></AppShell>} />
        <Route path="/leaderboard" element={<AppShell><LeaderboardPage /></AppShell>} />
        <Route path="/checkin/:eventId" element={<AppShell><PrivateRoute><CheckInPage /></PrivateRoute></AppShell>} />
        <Route
          path="/admin/organizer-requests"
          element={
            <AppShell>
              <PrivateRoute>
                <RoleRoute allowedRoles={['ADMIN']} redirectTo="/">
                  <OrganizerRequestsPage />
                </RoleRoute>
              </PrivateRoute>
            </AppShell>
          }
        />
        <Route path="*" element={<AppShell><NotFoundPage /></AppShell>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
