import React from 'react';

export const ImpactPill = ({ children, tone = 'neutral', className = '' }) => {
  const tones = {
    neutral: 'bg-surface-highest text-ink/70',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    cta: 'bg-accent text-white',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
};

export default ImpactPill;
