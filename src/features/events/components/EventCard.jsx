const getStatusColor = (status) => {
  if (status === 'ONGOING') return 'bg-[#F75A0D]';
  return 'bg-[#859448]';
};

export const EventCard = ({ event, onRegister, onDetail, compact = false }) => {
  const { title, description, location, points, status, verified, startTime } = event;
  const dateText = startTime ? new Date(startTime).toLocaleString() : null;

  return (
    <article className="group rounded-3xl bg-surface-low p-4 transition-all duration-300 hover:bg-surface-high shadow-[0_18px_48px_rgba(33,26,20,0.06)]">
      <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-surface-highest to-secondary/10">
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-secondary/20 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
        </div>

        <div className="absolute left-4 top-4 flex gap-2">
          {verified && (
            <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-primary backdrop-blur">
              VERIFIED
            </span>
          )}
          <span className="rounded-lg bg-primary px-2.5 py-1 text-[10px] font-extrabold text-white">
            {points} PTS
          </span>
        </div>

        <div className="absolute bottom-4 right-4">
          <span className={`${status === 'ONGOING' ? 'bg-accent' : 'bg-primary-light'} rounded-full px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest`}>
            {status}
          </span>
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-primary leading-snug group-hover:text-accent transition-colors">
            {title}
          </h3>
          <button type="button" className="text-ink/40 hover:text-primary" aria-label="Bookmark">
            ⌁
          </button>
        </div>

        {!compact && (
          <p className="mb-4 text-sm text-ink/60 line-clamp-2">{description}</p>
        )}

        <div className="space-y-2 mb-6">
          {dateText && (
            <div className="flex items-center gap-2 text-ink/60 text-xs font-semibold">
              <span>📅</span>
              <span>{dateText}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-ink/60 text-xs font-semibold">
            <span>📍</span>
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {onRegister && (
            <button
              type="button"
              onClick={() => onRegister(event.id)}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold tracking-wide text-white transition hover:shadow-[0_18px_48px_rgba(247,90,13,0.18)]"
            >
              Join Event
            </button>
          )}
          <button
            type="button"
            onClick={() => onDetail?.(event.id)}
            className="rounded-xl bg-surface-highest px-4 py-3 text-sm font-bold text-primary hover:bg-primary/10"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;