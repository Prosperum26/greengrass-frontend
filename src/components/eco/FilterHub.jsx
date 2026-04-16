import React from 'react';

export const FilterHub = ({ keyword, onKeywordChange, status, onStatusChange }) => {
  const statuses = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ONGOING', label: 'Ongoing' },
    { id: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <section className="rounded-2xl bg-surface-low p-6 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
      <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-primary">Filter Hub</h3>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ink/60">Keyword</label>
          <input
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search events…"
            className="w-full rounded-xl bg-surface-highest px-4 py-3 text-sm text-ink outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div>
          <label className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-ink/60">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const active = status === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStatusChange(s.id)}
                  className={`rounded-full px-3 py-2 text-[11px] font-bold transition ${
                    active ? 'bg-primary text-white' : 'bg-surface-highest text-primary hover:bg-primary/10'
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
