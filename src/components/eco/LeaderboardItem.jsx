import React from 'react';

export const LeaderboardItem = ({ rank, name, subtitle, points, progressLabel }) => {
  return (
    <div className="group flex items-center gap-4 rounded-2xl bg-surface-highest p-4 shadow-[0_16px_44px_rgba(33,26,20,0.06)] transition-all duration-500 hover:bg-surface-high hover:shadow-[0_24px_60px_rgba(35,70,18,0.12)] hover:-translate-y-1 hover:scale-[1.01] cursor-pointer relative overflow-hidden">
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:animate-[shimmer_1.5s_ease-in-out]" />
      </div>

      <span className="w-8 text-right font-black text-ink/30 group-hover:text-primary transition-all duration-300 group-hover:scale-110">
        {String(rank).padStart(2, '0')}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-secondary font-bold group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
        {(name?.trim()?.[0] || 'U').toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h6 className="truncate font-bold text-ink group-hover:text-primary transition-colors duration-300">{name}</h6>
        </div>
        {subtitle && <p className="text-xs text-ink/60 truncate group-hover:text-ink/80 transition-colors duration-300">{subtitle}</p>}
      </div>

      <div className="hidden md:flex flex-col items-end gap-2 px-4 min-w-[140px]">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
          <div className="h-full w-2/3 rounded-full bg-secondary group-hover:bg-primary transition-colors duration-300" />
        </div>
        {progressLabel && <span className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-primary transition-colors duration-300">{progressLabel === 'Points contribution' ? 'Đóng góp điểm' : progressLabel}</span>}
      </div>

      <div className="text-right group-hover:scale-105 transition-transform duration-300">
        <p className="font-black text-primary group-hover:text-accent transition-colors duration-300">{points?.toLocaleString?.() ?? points}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Điểm tác động</p>
      </div>
    </div>
  );
}

export default LeaderboardItem;
