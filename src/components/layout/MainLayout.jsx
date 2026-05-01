import React from 'react';
import Header from './Header';
import MobileNav from './MobileNav';

export const MainLayout = ({ children, hidePadding = false, maxWidth = '7xl' }) => {
  return (
    <div className="min-h-screen flex flex-col font-body bg-background text-on-surface overflow-x-hidden">
      <Header />
      <main className={`flex-1 ${hidePadding ? '' : `pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-24 lg:pb-8 px-3 sm:px-4 lg:px-6 xl:px-8 max-w-${maxWidth} mx-auto w-full`}`}>
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default MainLayout;
