import React, { useMemo, memo, useState, useCallback, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import { QRScanner } from '../../features/checkin/components/QRScanner';

export const Header = memo(() => {
  const { user, isAuthenticated, logout, getRole } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);

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

  // QR Scanner state
  const [showQrScanner, setShowQrScanner] = useState(false);

  // Get initial search value from URL if on events page
  const getInitialSearch = () => {
    if (location.pathname === '/events') {
      const params = new URLSearchParams(location.search);
      return params.get('keyword') || '';
    }
    return '';
  };

  const [searchQuery, setSearchQuery] = useState(getInitialSearch);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
    };

    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);

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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav bg-[#251E18] text-white flex justify-between items-center w-full px-3 sm:px-4 lg:px-6 h-14 sm:h-16 shadow-none font-display antialiased safe-top">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 flex-1 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
          >
            <span className="material-symbols-outlined text-white text-xl sm:text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link to="/" className="text-lg sm:text-xl font-bold text-white tracking-tight whitespace-nowrap">GreenGrass</Link>

          {/* Desktop Search Bar - Only on 900px+ to prevent overlap */}
          <div className="hidden min-[900px]:flex items-center bg-white/10 rounded-full px-4 py-1.5 w-64 group focus-within:bg-white/20 transition-all">
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

          {/* Tablet/Mobile Search Button - Shows below 900px */}
          <button
            onClick={toggleMobileSearch}
            className="min-[900px]:hidden ml-auto p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tìm kiếm"
          >
            <span className="material-symbols-outlined text-white text-xl">search</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-2">
            <Link to="/events" className="text-accent font-bold text-xs lg:text-sm tracking-wide px-3 lg:px-4 py-2 rounded-full hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Khám phá</Link>
            <Link to="/profile" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-2 rounded-full">Đóng góp</Link>
            <Link to="/leafia" className="hidden lg:block text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs lg:text-sm px-2 lg:px-4 py-2 rounded-full">Leafia</Link>
            <Link to="/leaderboard" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-2 rounded-full">Xếp hạng</Link>
            {isAuthenticated && (
              <button
                onClick={() => setShowQrScanner(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs lg:text-sm px-3 lg:px-4 py-2 rounded-full flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                Quét QR
              </button>
            )}
          </div>

          {/* Tablet Navigation - Medium screens */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            <Link to="/events" className="text-accent font-bold text-xs tracking-wide px-3 py-2 rounded-full hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">Khám phá</Link>
            <Link to="/profile" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs px-3 py-2 rounded-full">Đóng góp</Link>
            <Link to="/leaderboard" className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs px-3 py-2 rounded-full">Xếp hạng</Link>
            {isAuthenticated && (
              <button
                onClick={() => setShowQrScanner(true)}
                className="text-white/80 hover:text-white hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs px-3 py-2 rounded-full flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                Quét QR
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 border-l border-white/10 pl-2 sm:pl-4 lg:pl-6">
            {/* Notification Button */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="material-symbols-outlined text-white/80 hover:text-white hover:bg-white/15 p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 flex items-center justify-center relative active:scale-95"
                aria-label="Thông báo"
              >
                notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-tertiary text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel - Responsive */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-[#2a241c] border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <h3 className="text-white font-semibold text-sm">Thông báo</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-accent hover:text-accent/80 transition-colors"
                      >
                        Đánh dấu đã đọc
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
              <div className="hidden sm:flex items-center gap-2 lg:gap-3 text-xs lg:text-sm font-bold">
                <Link to="/login" className="text-white/80 hover:text-white transition-colors whitespace-nowrap">Đăng nhập</Link>
                <Link to="/register" className="bg-accent py-1.5 px-3 lg:px-4 rounded-full hover:bg-opacity-90 transition-all text-white whitespace-nowrap">Đăng ký</Link>
              </div>
            ) : (
              <div className="relative group">
                <Link to="/profile" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-primary text-white font-bold text-xs sm:text-sm">
                  {avatarText}
                </Link>

                <div className="absolute right-0 pt-3 w-44 sm:w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="bg-[#2a241c] border border-white/10 rounded-xl shadow-lg py-1 overflow-hidden">
                    {role === 'ADMIN' && (
                      <Link to="/admin/organizer-requests" className="block px-4 py-2 text-sm text-accent font-bold hover:bg-white/5 transition-colors">
                        Yêu cầu chờ duyệt
                      </Link>
                    )}
                    {role === 'ORGANIZER' && (
                      <Link to="/organizer/profile" className="block px-4 py-2 text-sm text-white/80 font-bold hover:bg-white/5 transition-colors">
                        Hồ sơ của tôi
                      </Link>
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

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileSearchOpen(false)}>
          <div
            ref={mobileSearchRef}
            className="absolute top-14 left-0 right-0 bg-[#251E18] p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center bg-white/10 rounded-full px-4 py-2.5">
              <span className="material-symbols-outlined text-white/60 text-lg">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 text-base placeholder-white/40 w-full ml-3 outline-none text-white"
                placeholder="Tìm kiếm sự kiện..."
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearch}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="material-symbols-outlined text-white/60 hover:text-white"
                >
                  close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div
            ref={mobileMenuRef}
            className="absolute top-14 left-0 bottom-0 w-72 bg-[#251E18] shadow-xl overflow-y-auto"
          >
            <div className="p-4 space-y-1">
              <MobileNavItem to="/events" icon="explore" label="Khám phá" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavItem to="/profile" icon="person" label="Đóng góp của tôi" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavItem to="/leafia" icon="psychiatry" label="Leafia" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavItem to="/leaderboard" icon="emoji_events" label="Bảng xếp hạng" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileNavItem to="/map" icon="map" label="Bản đồ" onClick={() => setIsMobileMenuOpen(false)} />
              
              {isAuthenticated && (
                <button
                  onClick={() => { setShowQrScanner(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors w-full text-left"
                >
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                  <span className="font-medium">Quét QR Check-in</span>
                </button>
              )}

              {!isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-xl text-white/80 font-bold hover:bg-white/10 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-400 font-bold hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* QR Scanner Modal */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-800">Quét mã QR Check-in</h3>
              <button
                onClick={() => setShowQrScanner(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-600">close</span>
              </button>
            </div>
            <div className="p-4">
              <QRScanner
                onScan={(token) => {
                  // Parse URL from token and navigate
                  try {
                    const url = new URL(token);
                    const path = url.pathname;
                    const searchParams = url.search;
                    navigate(`${path}${searchParams}`);
                    setShowQrScanner(false);
                  } catch {
                    // If not a URL, try to extract eventId from token format
                    alert('Mã QR không hợp lệ. Vui lòng quét mã QR check-in của sự kiện.');
                  }
                }}
                onError={(err) => {
                  console.error('QR Scan error:', err);
                }}
              />
              <p className="mt-4 text-sm text-gray-500 text-center">
                Quét mã QR tại sự kiện để check-in
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// Mobile Navigation Item Component
const MobileNavItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
  >
    <span className="material-symbols-outlined text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

Header.displayName = 'Header';
export default Header;
