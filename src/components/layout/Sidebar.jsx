import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Sidebar Component with mobile drawer support
export const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen, onClose]);

  const sidebarContent = (
    <nav className="p-3 sm:p-4 space-y-1">
      <SidebarItem href="/dashboard" icon="home" label="Trang chủ" onClick={onClose} />
      <SidebarItem href="/events" icon="calendar" label="Sự kiện của tôi" onClick={onClose} />
      <SidebarItem href="/points" icon="star" label="Điểm & Huy hiệu" onClick={onClose} />
      <SidebarItem href="/history" icon="clock" label="Lịch sử" onClick={onClose} />
      <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200">
        <SidebarItem href="/profile" icon="user" label="Hồ sơ" onClick={onClose} />
        <SidebarItem href="/settings" icon="cog" label="Cài đặt" onClick={onClose} />
      </div>
    </nav>
  );

  // Mobile drawer overlay
  if (isMobile) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-40 lg:hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Sidebar drawer */}
        <aside
          ref={sidebarRef}
          className="absolute top-0 left-0 bottom-0 w-72 sm:w-80 bg-white border-r border-gray-200 shadow-xl overflow-y-auto animate-slide-in-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <span className="font-bold text-lg text-primary">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Đóng menu"
              type="button"
            >
              <span className="material-symbols-outlined text-gray-600 text-2xl">close</span>
            </button>
          </div>

          {sidebarContent}
        </aside>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="hidden lg:block w-56 xl:w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] flex-shrink-0">
      {sidebarContent}
    </aside>
  );
};

const SidebarItem = ({ href, icon, label, active = false, onClick }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    cog: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  };

  return (
    <Link
      to={href}
      onClick={onClick}
      className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-primary/10 text-primary shadow-sm'
          : 'text-ink/60 hover:bg-surface-highest hover:text-primary hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <svg className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110 group-hover:rotate-6'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icons[icon]}
      </svg>
      <span className="group-hover:translate-x-1 transition-transform duration-300 truncate">{label}</span>
    </Link>
  );
};

export default Sidebar;
