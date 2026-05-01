import React from 'react';
import Header from './Header';
import Footer from './Footer';

export const AppShell = ({ children, contentClassName = '' }) => {
  return (
    <div className="flex min-h-screen flex-col bg-surface overflow-x-hidden">
      <Header />
      <main className={`flex-1 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 ${contentClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppShell;
