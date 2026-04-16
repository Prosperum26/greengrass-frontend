import React from 'react';
import Header from './Header';
import Footer from './Footer';

export const AppShell = ({ children, contentClassName = '' }) => {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <main className={`flex-1 ${contentClassName}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default AppShell;
