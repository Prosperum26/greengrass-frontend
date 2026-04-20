import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppShell } from '../components/layout';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';
import { useAuthContext } from '../hooks/useAuthContext';

// Default components (always loaded)
import { HomePage } from '../features/home';

// Lazy load heavy features
const EventList = lazy(() => import('../features/events/components/EventList'));
const EventDetail = lazy(() => import('../features/events/components/EventDetail'));
const CreateEventPage = lazy(() => import('../features/events/components/CreateEventPage'));
const MapExplorerPage = lazy(() => import('../features/map/components/MapExplorerPage'));
const Leaderboard = lazy(() => import('../features/gamification/components/Leaderboard'));
const LeafiaPage = lazy(() => import('../features/chatbot/components/EcomaPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/components/ForgotPasswordPage'));
const LogInPage = lazy(() => import('../features/auth/components/LogInPage'));
const RegisterPage = lazy(() => import('../features/auth/components/RegisterPage'));
const OrgProfilePage = lazy(() => import('../features/profile/components/OrgProfilePage'));
const UserProfilePage = lazy(() => import('../features/profile/components/UserProfilePage'));
const PublicProfilePage = lazy(() => import('../features/profile/components/PublicProfilePage'));
const CheckInPage = lazy(() => import('../features/checkin/pages/CheckInPage'));
const OrganizerRequestsPage = lazy(() => import('../pages/Admin/OrganizerRequestsPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-accent rounded-full animate-spin"></div>
      <p className="text-ink/60">Đang tải...</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { getRole } = useAuthContext();
  const role = getRole();
  if (role === 'ORGANIZER') {
    return <Navigate to="/organizer/profile" replace />;
  }
  return <UserProfilePage />;
};

const MapPage = () => (
  <div className="px-6 py-10">
    <div className="mx-auto max-w-7xl">
      <Suspense fallback={<LoadingFallback />}>
        <MapExplorerPage />
      </Suspense>
    </div>
  </div>
);

const LeaderboardPage = () => (
  <div className="px-6 py-10">
    <Suspense fallback={<LoadingFallback />}>
      <Leaderboard />
    </Suspense>
  </div>
);

const LeafiaRoutePage = () => (
  <div className="px-6 py-8">
    <Suspense fallback={<LoadingFallback />}>
      <LeafiaPage />
    </Suspense>
  </div>
);

const NotFoundPage = () => <div className="p-8 text-ink">404 - Not found</div>;

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<AppShell contentClassName="overflow-x-hidden"><HomePage /></AppShell>} />
        <Route path="/events" element={<AppShell><Suspense fallback={<LoadingFallback />}><EventList /></Suspense></AppShell>} />
        <Route path="/events/:id" element={<AppShell><Suspense fallback={<LoadingFallback />}><EventDetail /></Suspense></AppShell>} />
        
        {/* Auth routes */}
        <Route path="/login" element={<AppShell><Suspense fallback={<LoadingFallback />}><LogInPage /></Suspense></AppShell>} />
        <Route path="/register" element={<AppShell><Suspense fallback={<LoadingFallback />}><RegisterPage /></Suspense></AppShell>} />
        <Route path="/forgot-password" element={<AppShell><Suspense fallback={<LoadingFallback />}><ForgotPasswordPage /></Suspense></AppShell>} />
        
        {/* Profile routes */}
        <Route path="/profile" element={<AppShell><PrivateRoute><Suspense fallback={<LoadingFallback />}><ProfilePage /></Suspense></PrivateRoute></AppShell>} />
        <Route path="/profile/:id" element={<AppShell><Suspense fallback={<LoadingFallback />}><PublicProfilePage /></Suspense></AppShell>} />
        
        {/* Organizer routes */}
        <Route
          path="/organizer/profile"
          element={
            <AppShell>
              <PrivateRoute>
                <RoleRoute allowedRoles={['ORGANIZER']} redirectTo="/profile">
                  <Suspense fallback={<LoadingFallback />}>
                    <OrgProfilePage />
                  </Suspense>
                </RoleRoute>
              </PrivateRoute>
            </AppShell>
          }
        />
        <Route
          path="/organizer/events/create"
          element={
            <AppShell>
              <PrivateRoute>
                <RoleRoute allowedRoles={['ORGANIZER']} redirectTo="/profile">
                  <Suspense fallback={<LoadingFallback />}>
                    <CreateEventPage />
                  </Suspense>
                </RoleRoute>
              </PrivateRoute>
            </AppShell>
          }
        />
        
        {/* Feature routes */}
        <Route path="/map" element={<AppShell contentClassName="overflow-hidden"><MapPage /></AppShell>} />
        <Route path="/leaderboard" element={<AppShell><LeaderboardPage /></AppShell>} />
        <Route path="/leafia" element={<AppShell><LeafiaRoutePage /></AppShell>} />
        <Route path="/checkin/:eventId" element={<AppShell><PrivateRoute><Suspense fallback={<LoadingFallback />}><CheckInPage /></Suspense></PrivateRoute></AppShell>} />
        
        {/* Admin routes */}
        <Route
          path="/admin/organizer-requests"
          element={
            <AppShell>
              <PrivateRoute>
                <RoleRoute allowedRoles={['ADMIN']} redirectTo="/">
                  <Suspense fallback={<LoadingFallback />}>
                    <OrganizerRequestsPage />
                  </Suspense>
                </RoleRoute>
              </PrivateRoute>
            </AppShell>
          }
        />
        
        {/* 404 fallback */}
        <Route path="*" element={<AppShell><NotFoundPage /></AppShell>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
