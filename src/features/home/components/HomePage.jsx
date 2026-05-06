import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsApi, usersApi } from '../../../api';
import { useError } from '../../../hooks/useError';
import { useDebounce } from '../../../hooks/useDebounce';
import { getErrorMessage } from '../../../utils/errorMessages';
import { EventCard } from '../../events/components/EventCard';
import { EventCardSkeleton } from '../../../components/common/EventCardSkeleton';
import { EcoFab, FilterHub, MapPreviewCard, PartnerMarquee } from '../../../components/eco';

const sortOptions = [
  { value: 'startTime:asc', label: 'Thời gian bắt đầu (Cũ → Mới)' },
  { value: 'startTime:desc', label: 'Thời gian bắt đầu (Mới → Cũ)' },
  { value: 'createdAt:desc', label: 'Mới đăng gần đây' },
  { value: 'title:asc', label: 'Tên A → Z' },
  { value: 'title:desc', label: 'Tên Z → A' },
  { value: 'points:desc', label: 'Điểm thưởng cao nhất' },
  { value: 'points:asc', label: 'Điểm thưởng thấp nhất' },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { addError } = useError();
  
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [liveEventCount, setLiveEventCount] = useState(0);
  const [upcomingEventCount, setUpcomingEventCount] = useState(0);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keywordInput, setKeywordInput] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sort, setSort] = useState('startTime:asc');
  
  // Debounce keyword input - API calls only after user stops typing for 500ms
  const debouncedKeyword = useDebounce(keywordInput, 500);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sortBy, sortOrder] = sort.split(':');
        const [eventsRes, liveRes, upcomingRes] = await Promise.all([
          eventsApi.getAll({
            limit: 5,
            page: 1,
            keyword: debouncedKeyword || undefined,
            status: status === 'ALL' ? undefined : status,
            sortBy,
            sortOrder,
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

        // Load organizers
        const organizersRes = await usersApi.getOrganizers();
        setOrganizers(organizersRes.data || []);
      } catch (err) {
        const message = getErrorMessage(err);
        addError(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    void loadData();
  }, [debouncedKeyword, status, sort, addError]);

  return (
    <div className="flex-grow space-y-8 sm:space-y-10 lg:space-y-12 w-full px-3 sm:px-4 lg:px-6 xl:px-8">
      {/* Hero / Featured Banner */}
      <section className="relative organic-gradient rounded-xl sm:rounded-[2rem] overflow-hidden min-h-[280px] sm:min-h-[340px] flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 text-white">
        <div className="absolute top-0 right-0 w-full sm:w-1/2 h-full opacity-20 sm:opacity-40">
          <img className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBovL64LjzGDRXWr6OzL0GRfG5aT4tYOBbA_xl2VhOZgbD5dINsGTsecFbu1gUFnXtviqaz7RRcw17rEZt10K6--YiqlifY2pRoV_aTdUW34erqse-gq3R_fHleW6NHGEpNCy0a0Mnk3W-oD3Ic1PJl0oim0iZW0CRQaS5PeaudmqlQJHww_pu3bNSEWR61Es3IwWZ2JBUXasMhzhNhJepa0VagNfK_-0uxY2z8Reg-bwSQuwrgUT4G2_cIViUHPUab2YD6IYsXxM" alt="Featured" />
        </div>
        <div className="relative z-10 max-w-lg space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full border border-white/20">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full"></span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em]">Sự kiện nổi bật</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Trái đất không có nút reset.</h1>
          <p className="text-white/80 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">Tham gia sự kiện xanh. Tích điểm và dẫn đầu bảng xếp hạng cộng đồng.</p>
          <div className="pt-2 sm:pt-4 flex flex-col xs:flex-row gap-2 sm:gap-4">
            <button onClick={() => navigate('/events')} className="bg-accent text-white px-[clamp(0.75rem,2vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.875rem)] rounded-lg sm:rounded-xl font-bold text-[clamp(0.625rem,1.5vw,0.875rem)] shadow-xl shadow-orange-900/20 hover:scale-105 transition-transform whitespace-nowrap">
              <span className="hidden xs:inline">Tham gia Hành động</span>
              <span className="xs:hidden">Tham gia</span>
            </button>
            <button onClick={() => navigate('/leaderboard')} className="bg-white/10 backdrop-blur-md text-white px-[clamp(0.75rem,2vw,1.25rem)] py-[clamp(0.5rem,1.5vw,0.875rem)] rounded-lg sm:rounded-xl font-bold text-[clamp(0.625rem,1.5vw,0.875rem)] border border-white/20 hover:bg-white/20 transition-all whitespace-nowrap">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </section>

      {/* Main Container - Responsive Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Hidden on mobile/tablet, shown on desktop */}
        <aside className="hidden lg:flex flex-col gap-6 lg:gap-8 w-64 xl:w-72 flex-shrink-0">
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
          <PartnerMarquee partners={organizers} />
        </aside>

        {/* Mobile Filter - Shown only on mobile/tablet */}
        <div className="lg:hidden">
          <FilterHub
            keyword={keywordInput}
            onKeywordChange={setKeywordInput}
            status={status}
            onStatusChange={setStatus}
            compact
          />
        </div>

        {/* Main Content */}
        <section className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary">Khám phá Sự kiện</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs sm:text-sm font-medium text-on-surface-variant whitespace-nowrap">Sắp xếp:</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-surface-variant bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 hover:bg-surface-container-highest transition-colors cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(4)].map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {/* Events Grid - Responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {featuredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      animation: 'fadeInUp 0.6s ease-out forwards',
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <EventCard
                      event={event}
                      onDetail={(id) => navigate(`/events/${id}`)}
                      onRegister={(id) => navigate(`/events/${id}`)}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* View More Button */}
          <button
            onClick={() => navigate('/events')}
            className="mt-6 sm:mt-8 w-full bg-surface-container-high text-primary py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-primary hover:text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>Xem thêm sự kiện</span>
            <span className="material-symbols-outlined text-base sm:text-lg">arrow_forward</span>
          </button>
        </section>
      </div>

      {/* Floating Action Button - Mobile only */}
      <EcoFab onClick={() => navigate('/events')} />
    </div>
  );
};

export default HomePage;
