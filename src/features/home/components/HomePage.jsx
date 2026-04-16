import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi, pointsApi } from '../../../api';
import { EventCard } from '../../events/components/EventCard';
import { GreenMap } from '../../map';
import { useAuth } from '../../auth/hooks/useAuth';
import { EcoFab, FilterHub, MapPreviewCard } from '../../../components/eco';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('ALL');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, leaderboardRes] = await Promise.all([
          eventsApi.getAll({
            limit: 6,
            page: 1,
            keyword: keyword || undefined,
            status: status === 'ALL' ? undefined : status,
          }),
          pointsApi.getLeaderboard({ limit: 5, timeframe: 'weekly' }),
        ]);

        const items = eventsRes.data?.data?.items || [];
        setFeaturedEvents(items.map((event, idx) => ({ ...event, verified: idx < 2 })));
        setLeaderboard(leaderboardRes.data?.users || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Cannot load homepage data');
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [keyword, status]);

  return (
    <div className="px-6 pb-20 pt-8 max-w-7xl mx-auto flex gap-8">
      <aside className="hidden lg:flex flex-col gap-8 w-72 flex-shrink-0">
        <MapPreviewCard liveCount={12} onExpand={() => navigate('/map')} />
        <FilterHub
          keyword={keyword}
          onKeywordChange={setKeyword}
          status={status}
          onStatusChange={setStatus}
        />
      </aside>

      <div className="flex-grow space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-primary-light p-10 text-white shadow-[0_32px_80px_rgba(33,26,20,0.10)]">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Featured Event</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight font-display">
              The Earth doesn&apos;t have a reset button.
            </h1>

            <p className="text-white/85 font-medium text-lg leading-relaxed">
              Join green events, build your streak, and lead your campus leaderboard.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold shadow-[0_16px_32px_rgba(247,90,13,0.25)] transition hover:scale-[1.02]"
              >
                Join Global Action
              </button>
              <button
                type="button"
                onClick={() => navigate('/leaderboard')}
                className="rounded-xl bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white/20"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary font-display">Discover Events</h2>
            <button type="button" onClick={() => navigate('/events')} className="text-sm font-bold text-ink/60 hover:text-primary">
              View all
            </button>
          </div>

          {loading && <p className="text-ink/60">Loading…</p>}
          {error && <p className="text-accent-hover">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} onDetail={(id) => navigate(`/events/${id}`)} onRegister={(id) => navigate(`/events/${id}`)} />
            ))}

            <article className="rounded-3xl bg-primary p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 font-display">Don&apos;t see anything for you?</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[260px]">
                  Organize your own impact event and earn triple the points this month.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="relative z-10 mt-8 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-primary transition hover:bg-surface-highest"
              >
                Start New Event
              </button>
            </article>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {leaderboard.map((u) => (
            <div key={u.userId} className="flex items-center justify-between rounded-xl bg-surface-high p-4 shadow-[0_16px_44px_rgba(33,26,20,0.06)]">
              <span className="font-medium">{u.rank}. {u.fullName}</span>
              <span className="text-secondary font-semibold">{u.totalPoints} pts</span>
            </div>
          ))}
        </section>
      </div>

      <EcoFab onClick={() => navigate('/events')} />
    </div>
  );
};

export default HomePage;
