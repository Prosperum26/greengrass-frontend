import React from 'react';
import { Link } from 'react-router-dom';

export const MobileNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-nav border-t border-white/10 flex items-center justify-around px-4 z-50">
      <Link to="/events" className="flex flex-col items-center text-[#F75A0D]">
        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>explore</span>
        <span className="text-[10px] font-bold mt-0.5">Explore</span>
      </Link>
      <Link to="/map" className="flex flex-col items-center text-white/60">
        <span className="material-symbols-outlined">map</span>
        <span className="text-[10px] font-bold mt-0.5">Map</span>
      </Link>
      <Link to="/leaderboard" className="flex flex-col items-center text-white/60">
        <span className="material-symbols-outlined">eco</span>
        <span className="text-[10px] font-bold mt-0.5">Impact</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-white/60">
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-bold mt-0.5">Profile</span>
      </Link>
    </div>
  );
};

export default MobileNav;
