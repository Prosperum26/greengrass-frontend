import React, { memo, useState } from 'react';

export const EventCard = memo(({ event, onRegister, onDetail }) => {
  const { title, location, points, status, verified, startTime, coverImageUrl } = event;
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const dateText = startTime ? new Date(startTime).toLocaleString() : null;

  // Generate stable random delay using index from parent component
  const getAnimationDelay = () => {
    const hash = event.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 10) * 0.03; // 0 to 0.27 seconds
  };

  return (
    <article 
      className="bg-surface-container-low rounded-2xl sm:rounded-3xl p-3 sm:p-4 group hover:bg-surface-container-high transition-all duration-500 flex flex-col justify-between hover:shadow-[0_30px_60px_rgba(35,70,18,0.15)] hover:-translate-y-2 relative overflow-hidden animate-fadeInUp"
      style={{
        animation: 'fadeInUp 0.6s ease-out forwards',
        animationDelay: `${getAnimationDelay()}s`
      }}
    >
      <div>
        <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-5">
          {coverImageUrl ? (
            <>
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest to-surface-container-low animate-pulse" />
              )}
              <img
                src={coverImageUrl}
                alt={title}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-container-highest to-secondary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl sm:text-4xl text-primary/30">image</span>
            </div>
          )}

          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1.5 sm:gap-2 flex-wrap">
            {verified && (
              <span className="bg-white/90 backdrop-blur text-primary text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-0.5 sm:gap-1">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                <span className="hidden xs:inline">ĐÃ XÁC THỰC</span>
                <span className="xs:hidden">XÁC THỰC</span>
              </span>
            )}
            <span className="bg-primary/90 backdrop-blur text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg">
              {points} ĐIỂM
            </span>
          </div>

          <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
            <span className={`${status === 'ONGOING' ? 'bg-accent' : 'bg-primary-container'} rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-wider sm:tracking-widest backdrop-blur-md`}>
              {status === 'UPCOMING' ? 'SẮP DIỄN RA' : status === 'ONGOING' ? 'ĐANG DIỄN RA' : status === 'COMPLETED' ? 'ĐÃ KẾT THÚC' : status}
            </span>
          </div>
        </div>

        <div className="px-1 sm:px-2 pb-2">
          <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
            <h3
              className="text-base sm:text-lg font-extrabold text-primary leading-snug group-hover:text-accent transition-colors cursor-pointer line-clamp-2"
              onClick={() => onDetail?.(event.id)}
            >
              {title}
            </h3>
            <button
              type="button"
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors flex-shrink-0 text-lg sm:text-xl"
            >
              bookmark
            </button>
          </div>

          <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
            {dateText && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant/80 text-xs font-semibold">
                <span className="material-symbols-outlined text-sm sm:text-base">calendar_today</span>
                <span className="truncate">{dateText}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 text-on-surface-variant/80 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm sm:text-base">location_on</span>
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-2 pt-2 gap-2 sm:gap-3 flex flex-col">
        {onRegister && (
          <button
            type="button"
            onClick={() => onRegister(event.id)}
            className="w-full bg-accent text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm tracking-wide hover:shadow-[0_10px_30px_rgba(247,90,13,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-accent to-accent-hover opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
              <span className="material-symbols-outlined text-sm sm:text-base group-hover/btn:rotate-12 transition-transform duration-300">add_circle</span>
              <span className="hidden xs:inline">Tham gia sự kiện</span>
              <span className="xs:hidden">Tham gia</span>
            </span>
            {/* Ripple effect */}
            <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-white/20 transition-transform duration-700 ease-out" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDetail?.(event.id)}
          className="w-full bg-surface-container-highest text-primary py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm tracking-wide hover:bg-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 group/detail relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover opacity-0 group-hover/detail:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
            <span className="material-symbols-outlined text-sm sm:text-base group-hover/detail:translate-x-1 transition-transform duration-300">arrow_forward</span>
            <span>Chi tiết</span>
          </span>
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