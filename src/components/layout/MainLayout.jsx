import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';

export const MainLayout = ({ children, hidePadding = false }) => {
  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-on-surface">
      <Header />
      <div className={`flex-grow ${hidePadding ? '' : 'pt-24 pb-20 px-6 max-w-7xl mx-auto flex gap-8 w-full'}`}>
        {children}
      </div>
      <MobileNav />
    </div>
  );
};

export default MainLayout;
