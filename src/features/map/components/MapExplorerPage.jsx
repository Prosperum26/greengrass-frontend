import React, { useEffect, useMemo, useState } from 'react';
import { mapApi } from '../../../api';
import GreenMap from './GreenMap';

export const MapExplorerPage = () => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await mapApi.getEcoPoints();
      const points = Array.isArray(data) ? data : data?.data || [];
      setMarkers(points);
      if (points[0]) setSelected(points[0]);
    };
    void load();
  }, []);

  const selectedId = selected?.id;
  const center = useMemo(() => {
    if (selected) return [selected.latitude, selected.longitude];
    return undefined;
  }, [selected]);

  return (
    <div className="relative h-[78vh] w-full overflow-hidden rounded-2xl bg-surface-high shadow-[0_20px_60px_rgba(33,26,20,0.08)]">
      <div className="absolute inset-0">
        <GreenMap
          center={center}
          markers={markers}
          selectedId={selectedId}
          onSelect={(p) => setSelected(p)}
        />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-full md:w-[420px] p-6 flex flex-col gap-6">
        <div className="pointer-events-auto rounded-2xl bg-surface/80 p-6 backdrop-blur-xl shadow-[32px_0_48px_rgba(33,26,20,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary font-display">Route Suggestion</h2>
            <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-secondary/15 text-secondary">Eco-Path</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-xl bg-surface-low p-3">
              <div className="rounded-lg bg-primary px-2 py-2 text-white">🚶</div>
              <div className="flex-1">
                <p className="text-xs text-ink/60 font-medium">Walking Distance</p>
                <p className="text-sm font-bold text-ink">12 mins</p>
              </div>
              <div className="text-secondary font-bold text-sm">-0.2kg CO2</div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-surface-low p-3 ring-2 ring-primary/10">
              <div className="rounded-lg bg-primary px-2 py-2 text-white">🚲</div>
              <div className="flex-1">
                <p className="text-xs text-ink/60 font-medium">Biking Distance</p>
                <p className="text-sm font-bold text-ink">4 mins</p>
              </div>
              <div className="text-secondary font-bold text-sm">-0.2kg CO2</div>
            </div>
          </div>
          <button type="button" className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white shadow-[0_18px_48px_rgba(33,26,20,0.08)]">
            Start Navigation
          </button>
        </div>

        <div className="pointer-events-auto rounded-2xl bg-surface/80 p-6 backdrop-blur-xl shadow-[32px_0_48px_rgba(33,26,20,0.05)]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-ink/60 mb-4">Map Layers</h3>
          <div className="grid grid-cols-1 gap-2">
            {['Events', 'Recycling Points', 'Eco Stations'].map((label) => (
              <label key={label} className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-highest cursor-pointer transition-colors">
                <input defaultChecked className="rounded text-primary focus:ring-primary/30 border-transparent bg-surface-highest" type="checkbox" />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="absolute right-0 top-0 bottom-0 w-full md:w-[380px] bg-surface shadow-[ -32px_0_48px_rgba(33,26,20,0.10)] z-20 overflow-y-auto">
        <div className="p-8 space-y-8">
          <div>
            <span className="inline-flex rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-accent text-white">
              Selected
            </span>
            <h2 className="mt-3 text-2xl font-bold font-display text-ink leading-tight">
              {selected?.name || selected?.title || 'Eco Point'}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {selected?.type || selected?.category || 'Green station'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-surface-low p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-ink/50">Latitude</p>
              <p className="text-sm font-bold">{selected?.latitude?.toFixed?.(4) ?? '-'}</p>
            </div>
            <div className="rounded-2xl bg-surface-low p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-ink/50">Longitude</p>
              <p className="text-sm font-bold">{selected?.longitude?.toFixed?.(4) ?? '-'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Nearby Points</h3>
            <div className="space-y-3">
              {markers.slice(0, 6).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    p.id === selectedId ? 'bg-surface-highest' : 'bg-surface-low hover:bg-surface-highest'
                  }`}
                >
                  <p className="font-bold">{p.name || p.title || 'Eco Point'}</p>
                  <p className="text-sm text-ink/60">{p.type || p.category || 'Green station'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MapExplorerPage;
