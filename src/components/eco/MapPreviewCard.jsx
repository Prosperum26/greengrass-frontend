import React from 'react';
import ImpactPill from './ImpactPill';

export const MapPreviewCard = ({ title = 'Active Zones', liveCount = 0, onExpand }) => {
  return (
    <section className="rounded-2xl bg-surface-low p-4 shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
        <ImpactPill tone="secondary">{liveCount} Live</ImpactPill>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl bg-surface-dim">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute left-1/3 top-1/4 h-3 w-3 rounded-full bg-secondary ring-4 ring-secondary/25" />
        <div className="absolute bottom-1/3 right-1/4 h-3 w-3 rounded-full bg-accent ring-4 ring-accent/25" />
      </div>

      <button
        type="button"
        onClick={onExpand}
        className="mt-4 w-full rounded-xl bg-surface-highest py-2 text-xs font-bold text-primary transition hover:bg-surface-high"
      >
        Expand Ecosystem Map
      </button>
    </section>
  );
};

export default MapPreviewCard;
