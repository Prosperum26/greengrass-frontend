import React from 'react';

export const FilterHub = ({ keyword, onKeywordChange, status, onStatusChange }) => {
  const statuses = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ONGOING', label: 'Ongoing' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <section className="bg-surface-container-low rounded-2xl p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">Filter Hub</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-3">KEYWORD</label>
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search events…"
            className="w-full rounded-xl bg-surface-container-highest px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25 border-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant mb-3">ACTION TYPE</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const active = status === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onStatusChange(s.id)}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-colors ${
                    active ? 'bg-primary text-white' : 'bg-surface-container-highest text-primary hover:bg-primary/10'
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
