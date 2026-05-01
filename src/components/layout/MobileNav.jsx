import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/events', icon: 'explore', label: 'Khám phá', filled: true },
  { to: '/map', icon: 'map', label: 'Bản đồ' },
  { to: '/leaderboard', icon: 'emoji_events', label: 'Xếp hạng' },
  { to: '/profile', icon: 'person', label: 'Hồ sơ' },
];

export const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-white/10 z-50 safe-bottom">
      <div className="flex items-center justify-around px-2 sm:px-4 h-14 sm:h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/events' && location.pathname.startsWith(item.to));

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-accent'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl sm:text-2xl"
                style={item.filled || isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
