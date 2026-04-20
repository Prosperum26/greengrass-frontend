import React, { useMemo, memo, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

export const Header = memo(() => {
  const { user, isAuthenticated, logout, getRole } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  // Get initial search value from URL if on events page
  const getInitialSearch = () => {
    if (location.pathname === '/events') {
      const params = new URLSearchParams(location.search);
      return params.get('keyword') || '';
    }
    return '';
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearch);

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/events?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchQuery, navigate]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav bg-[#251E18] text-white flex justify-between items-center w-full px-6 h-16 shadow-none font-display antialiased">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">GreenGrass</Link>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-1.5 w-64 group focus-within:bg-white/20 transition-all">
          <span className="material-symbols-outlined text-white/60 text-sm">search</span>
          <input 
            className="bg-transparent border-none focus:ring-0 text-sm placeholder-white/40 w-full ml-2 outline-none" 
            placeholder="Tìm kiếm sự kiện..." 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-6">
          <Link to="/events" className="text-accent font-bold text-sm tracking-wide">Khám phá</Link>
          <Link to="/profile" className="text-white/80 hover:bg-white/10 transition-colors text-sm px-3 py-1 rounded-full">Đóng góp của tôi</Link>
          <Link to="/leafia" className="text-white/80 hover:bg-white/10 transition-colors text-sm px-3 py-1 rounded-full">Leafia</Link>
          <Link to="/leaderboard" className="text-white/80 hover:bg-white/10 transition-colors text-sm px-3 py-1 rounded-full">Bảng xếp hạng</Link>
        </div>
        
        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          <button className="material-symbols-outlined text-white/80 hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center">
            notifications
          </button>
          
          {!isAuthenticated ? (
             <div className="flex items-center gap-3 text-sm font-bold">
                <Link to="/login" className="text-white/80 hover:text-white transition-colors">Đăng nhập</Link>
                <Link to="/register" className="bg-accent py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-all text-white">Đăng ký</Link>
             </div>
          ) : (
            <div className="relative group">
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-primary text-white font-bold text-sm">
                {avatarText}
              </Link>
              
              <div className="absolute right-0 pt-3 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-[#2a241c] border border-white/10 rounded-xl shadow-lg py-1 overflow-hidden">
                  {role === 'ADMIN' && (
                    <Link to="/admin/organizer-requests" className="block px-4 py-2 text-sm text-accent font-bold hover:bg-white/5 transition-colors">
                      Yêu cầu chờ duyệt
                    </Link>
                  )}
                  {role === 'ORGANIZER' && (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-white/80 font-bold hover:bg-white/5 transition-colors">
                        Hồ sơ của tôi
                      </Link>
                      <Link to="/org-profile" className="block px-4 py-2 text-sm text-accent font-bold hover:bg-white/5 transition-colors border-t border-white/5">
                        Trang ban tổ chức
                      </Link>
                    </>
                  )}
                  {role !== 'ADMIN' && role !== 'ORGANIZER' && (
                    <Link to="/profile" className="block px-4 py-2 text-sm text-white/80 font-bold hover:bg-white/5 transition-colors">
                      Hồ sơ của tôi
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors font-bold border-t border-white/5">
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

Header.displayName = 'Header';
export default Header;
