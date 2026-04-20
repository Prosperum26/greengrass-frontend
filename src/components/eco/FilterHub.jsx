import React from 'react';

export const FilterHub = ({ keyword, onKeywordChange, status, onStatusChange }) => {
  const statuses = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'UPCOMING', label: 'Sắp diễn ra' },
    { id: 'ONGOING', label: 'Đang diễn ra' },
    { id: 'COMPLETED', label: 'Đã kết thúc' },
  ];

  return (
    <section className="bg-surface-container-low rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Bộ lọc</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-3">TỪ KHÓA</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-ink/40 text-sm group-hover:text-primary group-focus-within:text-primary transition-colors duration-300">
              search
            </span>
            <input
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              placeholder="Tìm kiếm sự kiện…"
              className="w-full rounded-xl bg-surface-container-highest pl-10 pr-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 hover:shadow-md hover:bg-white transition-all duration-300 border-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-3">LOẠI HÀNH ĐỘNG</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const active = status === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onStatusChange(s.id)}
                  className={`px-4 py-2 text-[11px] font-bold rounded-full transition-all duration-300 ${
                    active
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                      : 'bg-surface-container-highest text-primary hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterHub;
