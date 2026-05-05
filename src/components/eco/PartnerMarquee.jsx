import React from 'react';

export const PartnerMarquee = ({ partners = [] }) => {
  // Duplicate list for seamless infinite loop
  const duplicatedPartners = [...partners, ...partners];

  if (partners.length === 0) return null;

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 overflow-hidden">
      <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 text-center">
        Các tổ chức đã hợp tác
      </h3>
      
      <div className="relative overflow-hidden">
        {/* Gradient masks for fade effect - items disappear when entering this zone */}
        <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-surface-container-low via-surface-container-low/90 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-surface-container-low via-surface-container-low/90 to-transparent z-10 pointer-events-none" />
        
        {/* Marquee container - items clipped within bounds */}
        <div className="flex animate-marquee hover:[animation-play-state:paused] px-6">
          {duplicatedPartners.map((org, idx) => (
            <div
              key={`${org.id}-${idx}`}
              className="flex-shrink-0 mx-[8px] flex flex-col items-center gap-2 w-20 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-high overflow-hidden border-2 border-surface-variant group-hover:border-primary transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                {org.avatarUrl ? (
                  <img
                    src={org.avatarUrl}
                    alt={org.fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <span className="material-symbols-outlined text-primary/50 text-2xl">
                      account_circle
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-medium text-on-surface-variant text-center line-clamp-2 group-hover:text-primary transition-colors duration-300">
                {org.fullName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
