import React, { memo } from 'react';

export const EventCard = memo(({ event, onRegister, onDetail }) => {
  const { title, location, points, status, verified, startTime, coverImageUrl } = event;
  const dateText = startTime ? new Date(startTime).toLocaleString() : null;

  return (
    <article className="bg-surface-container-low rounded-3xl p-4 group hover:bg-surface-container-high transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5">
          {coverImageUrl ? (
            <img src={coverImageUrl} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-container-highest to-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary/30">image</span>
            </div>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            {verified && (
              <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-extrabold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                ĐÃ XÁC THỰC
              </span>
            )}
            <span className="bg-primary/90 backdrop-blur text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
              {points} ĐIỂM
            </span>
          </div>
          
          <div className="absolute bottom-4 right-4">
             <span className={`${status === 'ONGOING' ? 'bg-accent' : 'bg-primary-container'} rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md`}>
                {status === 'UPCOMING' ? 'SẮP DIỄN RA' : status === 'ONGOING' ? 'ĐANG DIỄN RA' : status === 'COMPLETED' ? 'ĐÃ KẾT THÚC' : status}
              </span>
          </div>
        </div>

        <div className="px-2 pb-2">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-lg font-extrabold text-primary leading-snug group-hover:text-accent transition-colors cursor-pointer" onClick={() => onDetail?.(event.id)}>
              {title}
            </h3>
            <button type="button" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors flex-shrink-0">
              bookmark
            </button>
          </div>

          <div className="space-y-2 mb-6">
            {dateText && (
              <div className="flex items-center gap-2 text-on-surface-variant/80 text-xs font-semibold">
                <span className="material-symbols-outlined text-base">calendar_today</span>
                {dateText}
              </div>
            )}
            <div className="flex items-center gap-2 text-on-surface-variant/80 text-xs font-semibold">
              <span className="material-symbols-outlined text-base">location_on</span>
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 pt-2 gap-3 flex flex-col">
        {onRegister && (
          <button
            type="button"
            onClick={() => onRegister(event.id)}
            className="w-full bg-accent text-white py-3 rounded-xl font-bold text-sm tracking-wide hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Tham gia sự kiện
          </button>
        )}
        <button
          type="button"
          onClick={() => onDetail?.(event.id)}
          className="w-full bg-surface-container-highest text-primary py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-primary/10 transition-colors"
        >
          Chi tiết
        </button>
      </div>
    </article>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: return true if props are equal (no re-render needed)
  return prevProps.event.id === nextProps.event.id &&
         prevProps.event.title === nextProps.event.title &&
         typeof prevProps.onDetail === typeof nextProps.onDetail;
});

EventCard.displayName = 'EventCard';
export default EventCard;