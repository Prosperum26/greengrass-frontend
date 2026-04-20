import React from 'react';

export const ImpactPill = ({ children, tone = 'neutral', className = '', interactive = false }) => {
  const tones = {
    neutral: 'bg-surface-highest text-ink/70 hover:bg-primary hover:text-white',
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-secondary text-white hover:bg-secondary/80',
    cta: 'bg-accent text-white hover:bg-accent-hover',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:scale-105 active:scale-95'
    : 'transition-all duration-300 hover:shadow-md';

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tones[tone]} ${interactiveStyles} ${className}`}>
      {children}
    </span>
  );
};

export default ImpactPill;
