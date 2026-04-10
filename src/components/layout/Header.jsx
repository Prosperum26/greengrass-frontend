// Header Component
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-green-700">GreenGrass</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/events" className="text-gray-600 hover:text-green-600 font-medium">Sự kiện</a>
            <a href="/map" className="text-gray-600 hover:text-green-600 font-medium">Bản đồ</a>
            <a href="/leaderboard" className="text-gray-600 hover:text-green-600 font-medium">Bảng xếp hạng</a>
            <a href="/forum" className="text-gray-600 hover:text-green-600 font-medium">Forum</a>
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-500 hover:text-green-600 relative">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-700 font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
