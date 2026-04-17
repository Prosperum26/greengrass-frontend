import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const avatarText = useMemo(() => {
    const name = user?.fullName || user?.name || user?.email || '';
    const first = String(name).trim()[0];
    return (first || 'U').toUpperCase();
  }, [user]);
  
  return (
    <header className="sticky top-0 z-40 bg-brown-900/90 shadow-[0_12px_48px_rgba(33,26,20,0.08)] backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-white font-display tracking-tight">GreenGrass</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/events" className="font-medium text-white/75 hover:text-primary-light">Events</Link>
            <Link to="/map" className="font-medium text-white/75 hover:text-primary-light">Map</Link>
            <Link to="/leaderboard" className="font-medium text-white/75 hover:text-primary-light">Leaderboard</Link>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/60 hover:text-[#859448]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {!isAuthenticated ? (
              <div className="flex items-center gap-2 text-sm font-medium">
                <Link to="/login" className="text-white/75 hover:text-[#859448]">
                  Đăng nhập
                </Link>
                <span className="text-white/30">/</span>
                <Link to="/register" className="text-white/75 hover:text-[#859448]">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div className="relative group">
                <Link
                  to="/profile"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3D362B] hover:ring-2 hover:ring-[#859448]/40"
                  aria-label="Profile"
                  title="Profile"
                >
                  <span className="text-sm font-medium text-white">{avatarText}</span>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-[#2a241c] border border-[#859448]/20 rounded-xl shadow-lg py-1">
                    {user?.role === 'ADMIN' ? (
                      <Link
                        to="/admin/organizer-requests"
                        className="block px-4 py-2 text-sm text-red-500 font-bold hover:bg-[#3D362B] transition-colors"
                      >
                        Duyệt đơn đăng kí
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white/75 hover:bg-[#3D362B] hover:text-[#859448] transition-colors"
                      >
                        Hồ sơ của tôi
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#3D362B] transition-colors"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
