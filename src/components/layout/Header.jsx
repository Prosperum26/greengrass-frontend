import React, { useMemo, memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNotifications } from '../../hooks/useNotifications';

export const Header = memo(() => {
  const { user, isAuthenticated, logout, getRole } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  // Notifications state
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

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

  // Fetch notifications when panel opens
  useEffect(() => {
    if (showNotifications) {
      fetchNotifications();
    }
  }, [showNotifications, fetchNotifications]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    if (notification.event) {
      navigate(`/events/${notification.event.id}`);
      setShowNotifications(false);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

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
        <div className="hidden md:flex items-center gap-2">
          <Link to="/events" className="text-accent font-bold text-sm tracking-wide px-4 py-2 rounded-full hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Khám phá</Link>
          <Link to="/profile" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm px-4 py-2 rounded-full">Đóng góp của tôi</Link>
          <Link to="/leafia" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm px-4 py-2 rounded-full">Leafia</Link>
          <Link to="/leaderboard" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm px-4 py-2 rounded-full">Bảng xếp hạng</Link>
        </div>

        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
          {/* Notification Button with Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={toggleNotifications}
              className="material-symbols-outlined text-white/80 hover:text-white hover:bg-white/15 p-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 hover:rotate-12 flex items-center justify-center relative active:scale-95"
            >
              notifications
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-tertiary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#2a241c] border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-white font-semibold text-sm">Thông báo</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-8 text-center text-white/60 text-sm">
                      <span className="material-symbols-outlined animate-spin text-2xl mb-2 block">refresh</span>
                      Đang tải...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-white/60 text-sm">
                      <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">notifications_off</span>
                      Không có thông báo
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors relative group ${
                          !notification.isRead ? 'bg-white/5' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Unread indicator */}
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-tertiary rounded-full mt-1.5 flex-shrink-0"></span>
                          )}
                          {notification.isRead && <span className="w-2 h-2 flex-shrink-0"></span>}

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${!notification.isRead ? 'text-white font-medium' : 'text-white/80'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-white/60 mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-white/40 mt-1">
                              {formatNotificationTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Delete button */}
                          <button
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all p-1"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/10 bg-white/5">
                    <Link
                      to="/profile"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-accent hover:text-accent/80 transition-colors block text-center"
                    >
                      Xem tất cả trong hồ sơ
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
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
                      <Link to="/organizer/profile" className="block px-4 py-2 text-sm text-white/80 font-bold hover:bg-white/5 transition-colors">
                        Hồ sơ của tôi
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
