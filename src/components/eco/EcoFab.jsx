import React from 'react';

export const EcoFab = ({ label = 'Quick Join nearest event', onClick }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50 hidden md:flex flex-col items-end gap-3">
      <div className="rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white shadow-[0_24px_60px_rgba(33,26,20,0.18)]">
        {label}
      </div>
      <button
        type="button"
        onClick={onClick}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-[0_16px_32px_rgba(247,90,13,0.30)] transition hover:scale-110 active:scale-95"
        aria-label={label}
      >
        <span className="text-2xl font-black">⚡</span>
      </button>
    </div>
  );
};

export default EcoFab;
