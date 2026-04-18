import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi } from '../../../api';
import { useError } from '../../../hooks/useError';
import { useDebounce } from '../../../hooks/useDebounce';
import { getErrorMessage } from '../../../utils/errorMessages';
import { EventCard } from '../../events/components/EventCard';
import { EcoFab, FilterHub, MapPreviewCard } from '../../../components/eco';

export const HomePage = () => {
  const navigate = useNavigate();
  const { addError } = useError();
  
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [liveEventCount, setLiveEventCount] = useState(0);
  const [upcomingEventCount, setUpcomingEventCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus] = useState('ALL');
  
  // Debounce keyword input - API calls only after user stops typing for 500ms
  const debouncedKeyword = useDebounce(keywordInput, 500);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [eventsRes, liveRes, upcomingRes] = await Promise.all([
          eventsApi.getAll({
            limit: 6,
            page: 1,
            keyword: debouncedKeyword || undefined,
            status: status === 'ALL' ? undefined : status,
          }, { skipAuth: true }),
          eventsApi.getAll({
            limit: 1,
            page: 1,
            status: 'ONGOING',
          }, { skipAuth: true }),
          eventsApi.getAll({
            limit: 1,
            page: 1,
            status: 'UPCOMING',
          }, { skipAuth: true }),
        ]);

        const items = eventsRes.data?.data?.items || [];
        setFeaturedEvents(items.map((event, idx) => ({ ...event, verified: idx < 2 })));
        setLiveEventCount(liveRes.data?.data?.pagination?.total || 0);
        setUpcomingEventCount(upcomingRes.data?.data?.pagination?.total || 0);
      } catch (err) {
        const message = getErrorMessage(err);
        addError(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [debouncedKeyword, status, addError]);

  return (
    <div className="flex-grow space-y-12 w-full">
      {/* Hero / Featured Banner */}
      <section className="relative organic-gradient rounded-[2rem] overflow-hidden min-h-[340px] flex flex-col justify-center p-8 md:p-12 text-white">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-40">
          <img className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBovL64LjzGDRXWr6OzL0GRfG5aT4tYOBbA_xl2VhOZgbD5dINsGTsecFbu1gUFnXtviqaz7RRcw17rEZt10K6--YiqlifY2pRoV_aTdUW34erqse-gq3R_fHleW6NHGEpNCy0a0Mnk3W-oD3Ic1PJl0oim0iZW0CRQaS5PeaudmqlQJHww_pu3bNSEWR61Es3IwWZ2JBUXasMhzhNhJepa0VagNfK_-0uxY2z8Reg-bwSQuwrgUT4G2_cIViUHPUab2YD6IYsXxM" alt="Featured" />
        </div>
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Featured Event</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">The Earth doesn't have a reset button.</h1>
          <p className="text-white/80 font-medium text-lg leading-relaxed">Join green events. Earn points and lead your campus leaderboard.</p>
          <div className="pt-4 flex gap-4">
            <button onClick={() => navigate('/events')} className="bg-accent text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-xl shadow-orange-900/20 hover:scale-105 transition-transform">Join Global Action</button>
            <button onClick={() => navigate('/leaderboard')} className="bg-white/10 backdrop-blur-md text-white px-6 py-3.5 rounded-xl font-bold text-sm border border-white/20 hover:bg-white/20 transition-all">Learn More</button>
          </div>
        </div>
      </section>

      {/* Main Container replacing Sidebar setup */}
      <div className="flex gap-8">
        <aside className="hidden lg:flex flex-col gap-8 w-72 flex-shrink-0">
          <MapPreviewCard
            liveCount={liveEventCount}
            upcomingCount={upcomingEventCount}
            onExpand={() => navigate('/map')}
          />
          <FilterHub
            keyword={keywordInput}
            onKeywordChange={setKeywordInput}
            status={status}
            onStatusChange={setStatus}
          />
        </aside>

        <section className="flex-grow">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-primary">Discover Events</h2>
            <button onClick={() => navigate('/events')} className="text-sm font-bold text-on-surface-variant flex items-center gap-1 cursor-pointer hover:text-primary transition-colors border-none bg-transparent">
              Sort: Recently Added <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>

          {loading && <p className="text-on-surface-variant/60">Đang tải các sự kiện...</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} onDetail={(id) => navigate(`/events/${id}`)} onRegister={(id) => navigate(`/events/${id}`)} />
            ))}

            <article className="bg-primary text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary-container/20 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 font-headline">Don't see anything for you?</h3>
                <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[200px]">Organize your own impact event and earn triple the points this month.</p>
              </div>
              <button onClick={() => navigate('/organizer/events/create')} className="relative z-10 mt-8 bg-white text-primary w-full py-3.5 rounded-xl font-bold text-sm hover:bg-secondary-container transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Start New Event
              </button>
            </article>
          </div>
        </section>
      </div>
      <EcoFab onClick={() => navigate('/events')} />
    </div>
  );
};

export default HomePage;
