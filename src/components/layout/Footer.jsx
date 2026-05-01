import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-brown-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">G</span>
            </div>
            <span className="text-xs sm:text-sm text-white/70 text-center sm:text-left">
              GreenGrass - Nền tảng cộng đồng xanh
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/60">
            <Link to="/" className="hover:text-[#859448] transition-colors">Trang chủ</Link>
            <Link to="/events" className="hover:text-[#859448] transition-colors">Sự kiện</Link>
            <Link to="/leaderboard" className="hover:text-[#859448] transition-colors">Xếp hạng</Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-white/40 text-center sm:text-right">
            2026 GreenGrass. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
