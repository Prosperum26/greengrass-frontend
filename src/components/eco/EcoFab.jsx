import React from 'react';

export const EcoFab = ({ label = 'Quick Join nearest event', onClick }) => {
  return (
    <div className="fixed bottom-24 right-8 z-[60] flex flex-col items-end gap-4 group md:bottom-8">
      <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        <div className="bg-on-surface text-white text-xs font-bold px-4 py-2 rounded-xl mb-2 shadow-2xl">
          {label}
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-16 h-16 bg-[#F75A0D] text-white rounded-2xl shadow-[0_16px_32px_rgba(247,90,13,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
      </button>
    </div>
  );
};

export default EcoFab;
