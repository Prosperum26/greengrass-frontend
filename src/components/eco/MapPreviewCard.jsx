import React from 'react';

export const MapPreviewCard = ({
  title = 'Active Zones',
  liveCount = 0,
  upcomingCount = 0,
  onExpand,
}) => {
  return (
    <section className="bg-surface-container-low rounded-2xl p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-primary">{title}</h3>
        <span className="bg-secondary-container text-[#5b6922] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          {liveCount} Live / {upcomingCount} Soon
        </span>
      </div>
      <div className="relative h-48 rounded-xl overflow-hidden bg-surface-dim">
        <img className="w-full h-full object-cover grayscale brightness-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnddt8gFuHaq3ri3nlOJDreNhAgW4KMnoOXr0bXOviKhoMOjVafNUQt4qXpoyeXb_1X1oF-dwLZYjKuIHfDLD4oWsF-tt8fro-hRIBpazg0n7xLvkKDOHX__xGgEGDhtnwu1AW7LkAo_Vh5aid5Eu0c8G_oKAYcLDF7LO9w3S7D2SbfL6cpFvgVSX1FrHB7qeMaqrrglfT1HMpOOR3HPIt-CnaOhdO436dr-j0TsHTpH5llhiATdqe_O6Be10j3lgn0mOgXfLlAIc" alt="Map" />
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-secondary rounded-full ring-4 ring-secondary/30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-accent rounded-full ring-4 ring-accent/30 animate-pulse"></div>
      </div>
      <button onClick={onExpand} className="w-full mt-4 py-2 text-xs font-bold text-primary hover:bg-primary/5 rounded-lg transition-all flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-sm">map</span>
        Expand Ecosystem Map
      </button>
    </section>
  );
};

export default MapPreviewCard;
