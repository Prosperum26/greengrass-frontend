import React from 'react';

export const LeaderboardItem = ({ rank, name, subtitle, points, progressLabel }) => {
  return (
    <div className="group flex items-center gap-4 rounded-2xl bg-surface-highest p-4 shadow-[0_16px_44px_rgba(33,26,20,0.06)] transition hover:bg-surface-high">
      <span className="w-8 text-right font-black text-ink/30 group-hover:text-primary transition-colors">
        {String(rank).padStart(2, '0')}
      </span>

      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-high text-secondary font-bold">
        {(name?.trim()?.[0] || 'U').toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h6 className="truncate font-bold text-ink">{name}</h6>
        </div>
        {subtitle && <p className="text-xs text-ink/60 truncate">{subtitle}</p>}
      </div>

      <div className="hidden md:flex flex-col items-end gap-2 px-4 min-w-[140px]">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/70">
          <div className="h-full w-2/3 rounded-full bg-secondary" />
        </div>
        {progressLabel && <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">{progressLabel === 'Points contribution' ? 'Đóng góp điểm' : progressLabel}</span>}
      </div>

      <div className="text-right">
        <p className="font-black text-primary">{points?.toLocaleString?.() ?? points}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">Điểm tác động</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;
